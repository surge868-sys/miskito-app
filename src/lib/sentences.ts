import { frames, PERSONS, type EndingFrame, type FillFrame } from "@/data/frames";
import { entryById } from "@/data/phrasebook";
import { db } from "./db";
import { isDue, rate, Rating } from "./srs";
import type { Bi, Entry } from "./types";

export type FillItem = { kind: "fill"; frame: FillFrame; word: Entry; sentence: string; gloss: Bi; reviewId: string };
export type OrderItem = { kind: "order"; frame: FillFrame; word: Entry; sentence: string; tiles: string[]; gloss: Bi; reviewId: string };
export type EndingItem = {
  kind: "ending"; frame: EndingFrame; person: number; prompt: string; answer: string; options: string[]; sentence: string; gloss: Bi; reviewId: string;
};
export type SentenceItem = FillItem | OrderItem | EndingItem;

/** The word as it sits inside a sentence: lower-case, no trailing punctuation. */
function inline(e: Entry): string {
  const w = e.mk.replace(/[.!?]+$/, "");
  return /^[A-Z][a-z]/.test(w) && !/^(Bilwi|Miskitu|Ispail|Ingglis)/.test(w) ? w.charAt(0).toLowerCase() + w.slice(1) : w;
}
function firstSense(s: string): string {
  return s.split(/[,;]/)[0].trim().replace(/^(the|a|an)\s+/i, "").toLowerCase();
}
function cap(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}
function fillGloss(frame: FillFrame, word: Entry): Bi {
  const en = frame.gloss.en.replace("{x}", firstSense(word.gloss.en));
  const es = frame.gloss.es.replace("{x}", firstSense(word.gloss.es));
  return { en: cap(en), es: cap(es) };
}
function fillSentence(frame: FillFrame, word: Entry): string {
  const s = frame.template.replace("{x}", inline(word));
  return cap(s);
}
const pick = <T,>(a: readonly T[]): T => a[Math.floor(Math.random() * a.length)];
function shuffle<T>(a: T[]): T[] {
  const b = [...a];
  for (let i = b.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [b[i], b[j]] = [b[j], b[i]];
  }
  return b;
}

export function makeFill(frame: FillFrame, asOrder = false): FillItem | OrderItem {
  const word = entryById.get(pick(frame.slots))!;
  const sentence = fillSentence(frame, word);
  const gloss = fillGloss(frame, word);
  const base = { frame, word, sentence, gloss, reviewId: `frame:${frame.id}` };
  const tiles = sentence.replace(/[.?!]$/, "").split(" ").map((w) => w.toLowerCase());
  // Tiles only make sense with three or more words; shorter frames are said aloud instead.
  if (!asOrder || tiles.length < 3) return { kind: "fill", ...base };
  let shuffled = shuffle(tiles);
  if (tiles.length > 2 && shuffled.join(" ") === tiles.join(" ")) shuffled = [...tiles].reverse();
  return { kind: "order", ...base, tiles: shuffled };
}

export function makeEnding(frame: EndingFrame): EndingItem {
  const person = Math.floor(Math.random() * 3);
  const p = PERSONS[person];
  const obj = frame.obj ? entryById.get(frame.obj) : undefined;
  const objMk = obj ? inline(obj) + " " : "";
  const objForm = frame.id === "bri" ? "aras kum " : objMk;
  return {
    kind: "ending",
    frame,
    person,
    prompt: `${p.pronoun} ${objForm}${frame.stem}`,
    answer: p.ending,
    options: PERSONS.map((x) => x.ending),
    sentence: `${p.pronoun} ${objForm}${frame.stem}${p.ending}.`,
    gloss: { en: `${p.en} ${frame.en[person]}.`, es: `${p.es} ${frame.es[person]}.` },
    reviewId: `ending:${frame.id}`,
  };
}

export const SESSION_SIZE = 10;

export async function buildSentenceSession(): Promise<SentenceItem[]> {
  const reviews = await db.reviews.toArray();
  const map = new Map(reviews.map((r) => [r.id, r]));
  const idOf = (f: (typeof frames)[number]) => (f.kind === "fill" ? `frame:${f.id}` : `ending:${f.id}`);
  const due = frames.filter((f) => isDue(map.get(idOf(f))));
  const fresh = frames.filter((f) => !map.has(idOf(f)));
  const chosen = [...shuffle(due), ...shuffle(fresh)].slice(0, SESSION_SIZE);
  return chosen.map((f, i) => (f.kind === "ending" ? makeEnding(f) : makeFill(f, i % 3 === 2)));
}

export async function sentenceReadyCount(): Promise<number> {
  const reviews = await db.reviews.toArray();
  const map = new Map(reviews.map((r) => [r.id, r]));
  return frames.filter((f) => {
    const id = f.kind === "fill" ? `frame:${f.id}` : `ending:${f.id}`;
    return !map.has(id) || isDue(map.get(id));
  }).length;
}

/** Record a sentence attempt: the frame gets the grade, the slot word gets light credit. */
export async function rateSentence(item: SentenceItem, grade: typeof Rating.Again | typeof Rating.Hard | typeof Rating.Good | typeof Rating.Easy, supported = false) {
  await rate(item.reviewId, grade, supported);
  if (item.kind !== "ending" && grade >= Rating.Good) await rate(item.word.id, Rating.Good, true);
}
