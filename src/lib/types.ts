export type Lang = "en" | "es";
export type ExplainIn = Lang | "both";

/** A short bilingual string: what the app says in English and in Spanish. */
export type Bi = { en: string; es: string };

export type ThemeGroup = "everyday" | "family" | "town" | "river" | "health";
export type Tint = "peach" | "lavender" | "sage" | "butter";

export type Theme = {
  id: string;
  name: Bi;
  tagline: Bi;
  group: ThemeGroup;
  tint: Tint;
  icon: string;
};

export type EntryKind = "word" | "phrase" | "pattern";

export type ParadigmRow = { form: string; label: Bi };

export type Entry = {
  id: string;
  /** Miskito, in the spelling we normalise to. */
  mk: string;
  /** Other spellings you may meet (older Moravian, Honduran). */
  variants?: string[];
  gloss: Bi;
  note?: Bi;
  theme: string;
  kind: EntryKind;
  pos?: string;
  /** The language this word was borrowed from, when it was. */
  loan?: Lang;
  paradigm?: ParadigmRow[];
  /** True once a Miskito speaker has checked it. Everything starts false. */
  verified: boolean;
};

/** Spoken-recall estimate: 0 = new, 1 = fragile, 2 = growing, 3 = steady. */
export type Level = 0 | 1 | 2 | 3;
