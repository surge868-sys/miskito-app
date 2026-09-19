import { createEmptyCard, fsrs, generatorParameters, Rating, State, type Card, type Grade } from "ts-fsrs";
import { db, type ReviewRecord } from "./db";
import type { Level } from "./types";

const scheduler = fsrs(generatorParameters({ enable_fuzz: true, request_retention: 0.9 }));

export { Rating };
export type { Grade };

function toCard(rec: ReviewRecord): Card {
  return {
    due: rec.due,
    stability: rec.stability,
    difficulty: rec.difficulty,
    elapsed_days: rec.elapsed_days,
    scheduled_days: rec.scheduled_days,
    learning_steps: rec.learning_steps,
    reps: rec.reps,
    lapses: rec.lapses,
    state: rec.state as State,
    last_review: rec.last_review,
  };
}

/**
 * Map a scheduler card onto the three visible bars.
 * Stability says how long a memory lasts; retrievability says how much of it
 * is left right now. Long stability with nothing left still reads as fragile.
 */
export function levelFor(rec: ReviewRecord | undefined, now = new Date()): Level {
  if (!rec || rec.state === State.New || rec.reps === 0) return 0;
  const card = toCard(rec);
  const r = scheduler.get_retrievability(card, now, false);
  const s = rec.stability;
  let level: Level = s < 3 ? 1 : s < 14 ? 2 : 3;
  if (r < 0.5) level = 1;
  else if (r < 0.75 && level === 3) level = 2;
  return level;
}

export function isDue(rec: ReviewRecord | undefined, now = new Date()): boolean {
  if (!rec) return false;
  return rec.due.getTime() <= now.getTime();
}

/**
 * Record one spoken attempt. Supported practice (the meaning was visible)
 * never counts for more than Hard: the bars estimate unsupported recall.
 */
export async function rate(entryId: string, rating: Grade, supported: boolean, now = new Date()) {
  const existing = await db.reviews.get(entryId);
  const card = existing ? toCard(existing) : createEmptyCard(now);
  const effective: Grade = supported && rating > Rating.Hard ? Rating.Hard : rating;
  const { card: next } = scheduler.next(card, now, effective);
  const record: ReviewRecord = {
    id: entryId,
    due: next.due,
    stability: next.stability,
    difficulty: next.difficulty,
    elapsed_days: next.elapsed_days,
    scheduled_days: next.scheduled_days,
    learning_steps: next.learning_steps,
    reps: next.reps,
    lapses: next.lapses,
    state: next.state,
    last_review: next.last_review,
    supported: (existing?.supported ?? 0) + (supported ? 1 : 0),
    updatedAt: now,
  };
  await db.transaction("rw", db.reviews, db.logs, async () => {
    await db.reviews.put(record);
    await db.logs.add({ entryId, rating: effective, supported, at: now });
  });
  return record;
}

export async function resetProgress() {
  await db.transaction("rw", db.reviews, db.logs, async () => {
    await db.reviews.clear();
    await db.logs.clear();
  });
}

export type ProgressExport = {
  app: "bila";
  version: 1;
  exportedAt: string;
  reviews: ReviewRecord[];
};

export async function exportProgress(): Promise<ProgressExport> {
  const reviews = await db.reviews.toArray();
  return { app: "bila", version: 1, exportedAt: new Date().toISOString(), reviews };
}

function reviveDates(rec: ReviewRecord): ReviewRecord {
  return {
    ...rec,
    due: new Date(rec.due),
    last_review: rec.last_review ? new Date(rec.last_review) : undefined,
    updatedAt: new Date(rec.updatedAt),
  };
}

export async function importProgress(raw: unknown): Promise<number> {
  const data = raw as Partial<ProgressExport>;
  if (!data || data.app !== "bila" || !Array.isArray(data.reviews)) {
    throw new Error("Not a Bila progress file");
  }
  const rows = data.reviews.map(reviveDates);
  await db.reviews.bulkPut(rows);
  return rows.length;
}
