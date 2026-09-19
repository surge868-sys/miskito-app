import Dexie, { type EntityTable } from "dexie";

/** One row per word the learner has practiced. Mirrors a ts-fsrs Card. */
export interface ReviewRecord {
  id: string;
  due: Date;
  stability: number;
  difficulty: number;
  elapsed_days: number;
  scheduled_days: number;
  learning_steps: number;
  reps: number;
  lapses: number;
  state: number;
  last_review?: Date;
  /** How many of those reps were supported (meaning visible). */
  supported: number;
  updatedAt: Date;
}

export interface ReviewLog {
  id?: number;
  entryId: string;
  rating: number;
  supported: boolean;
  at: Date;
}

export const db = new Dexie("bila") as Dexie & {
  reviews: EntityTable<ReviewRecord, "id">;
  logs: EntityTable<ReviewLog, "id">;
};

db.version(1).stores({
  reviews: "id, due, state, updatedAt",
  logs: "++id, entryId, at",
});
