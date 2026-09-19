# Bila

A small, warm companion for learning Miskito (Mískitu), little by little.
Mobile-first web app, installable, works offline.

`bila` is Miskito for mouth, word, and language, as in *Miskitu bila*.

## Run it

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
npm run lint
```

## What's here (first slice)

- **Design system** in `src/app/globals.css`: cream ground, brown ink, one coral accent, four pastel tints, exposed as Tailwind v4 theme tokens.
- **Three tabs**: Talk, Themes, Words, with a floating tab bar.
- **Words**: search, theme filter, three-level spoken-recall estimate (Fragile / Growing / Steady) backed by FSRS scheduling, a Patterns section for grammar, and a word detail page with forms, notes, loanword badges, and quick self-rating.
- **Practice**: a ten-word round of spoken recall. Peeking at the hint counts as supported practice and never scores above "With help".
- **Themes**: scenario cards filtered by chips; each opens its words.
- **Talk**: the orb, with a phrase of the moment and a Meaning toggle. Voice is deliberately not wired up yet, see below.
- **Explain in** English, Español, or both, from Settings. Progress export/import/reset.
- **PWA**: manifest, icons, and a small service worker that keeps the shell and visited pages available offline.

Progress lives on the device in IndexedDB. There are no accounts.

## Content

The phrasebook is `src/data/phrasebook.ts`. Themes are `src/data/themes.ts`.

Every entry carries `verified: false` until a Miskito speaker has checked it.
The seed is a draft from published grammars and dictionaries, so expect some
forms to need correcting. Spelling follows the Nicaraguan school standard;
put other spellings in `variants`.

Entry shape:

```ts
{
  id: "tingki",
  mk: "Tingki",                       // Miskito
  gloss: { en: "Thank you", es: "Gracias" },
  note?: { en, es },
  theme: "greetings",
  kind: "word" | "phrase" | "pattern",
  loan?: "en" | "es",                 // borrowed from
  variants?: ["..."],
  paradigm?: [{ form, label: { en, es } }],
  verified: false,
}
```

## Why voice isn't here yet

There is no text-to-speech or speech recognition for Miskito in any browser,
and language models are unreliable in it. Audio should come from recorded
speakers, and the AI side should be grounded on the verified phrasebook.
Both are planned once the content has been checked.

## Roadmap

1. Verify the seed phrasebook with speakers; grow it by theme.
2. Recorded audio per entry, with a contributor mode to record in the browser.
3. Scripted, offline dialogues per theme.
4. A grounded text-first AI friend on the Talk tab.
5. Optional accounts and sync.

## Stack

Next.js (App Router), TypeScript, Tailwind v4, Motion, Dexie, ts-fsrs, lucide-react.
