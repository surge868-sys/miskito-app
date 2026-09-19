import { phrasebook } from "@/data/phrasebook";
import { themes } from "@/data/themes";
import type { Entry } from "./types";

const themeOrder = new Map(themes.map((t, i) => [t.id, i]));

export function normalise(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^\p{L}\p{N}\s-]/gu, "")
    .trim();
}

function haystack(e: Entry): string {
  return normalise(
    [e.mk, ...(e.variants ?? []), e.gloss.en, e.gloss.es, ...(e.paradigm?.map((p) => p.form) ?? [])].join(" "),
  );
}

const index = phrasebook.map((e) => ({ e, h: haystack(e) }));

export function searchEntries(query: string, themeId?: string | null): Entry[] {
  const q = normalise(query);
  const terms = q.split(/\s+/).filter(Boolean);
  return index
    .filter(({ e, h }) => (!themeId || e.theme === themeId) && terms.every((t) => h.includes(t)))
    .map(({ e }) => e)
    .sort((a, b) => (themeOrder.get(a.theme) ?? 0) - (themeOrder.get(b.theme) ?? 0));
}

export const words = phrasebook.filter((e) => e.kind !== "pattern");
export const patterns = phrasebook.filter((e) => e.kind === "pattern");

/** A phrase Bila can offer on the Talk screen: short, no blanks. */
export const talkable = phrasebook.filter(
  (e) => e.kind === "phrase" && !e.mk.includes("___") && e.mk.length <= 32,
);

export function pickRandom<T>(items: T[], exclude?: T): T {
  const pool = exclude === undefined || items.length < 2 ? items : items.filter((x) => x !== exclude);
  return pool[Math.floor(Math.random() * pool.length)];
}
