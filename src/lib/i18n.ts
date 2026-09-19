import type { Bi, ExplainIn, Lang } from "./types";

/** UI copy in the app's two explaining languages. */
export const strings = {
  appName: { en: "bila", es: "bila" },
  tabTalk: { en: "Talk", es: "Hablar" },
  tabThemes: { en: "Themes", es: "Temas" },
  tabWords: { en: "Words", es: "Palabras" },
  settings: { en: "Settings", es: "Ajustes" },
  all: { en: "All", es: "Todo" },
  speaking: { en: "Bila is speaking", es: "Bila está hablando" },
  back: { en: "Back", es: "Volver" },

  // Words
  wordsEyebrow: { en: "Little by little · Miskito", es: "Poco a poco · Miskito" },
  wordsTitle: { en: "Your words.", es: "Tus palabras." },
  wordsSubtitle: {
    en: "Familiar words, ready for another conversation.",
    es: "Palabras conocidas, listas para otra conversación.",
  },
  findWord: { en: "Find a word", es: "Busca una palabra" },
  practice: { en: "Practice", es: "Practicar" },
  ready: { en: "ready", es: "por practicar" },
  allCaughtUp: { en: "All caught up for now", es: "Al día por ahora" },
  patterns: { en: "Patterns", es: "Patrones" },
  patternsHint: {
    en: "The small machinery: endings, pronouns, counting.",
    es: "La pequeña maquinaria: terminaciones, pronombres, números.",
  },
  noResults: { en: "Nothing by that name yet.", es: "Nada con ese nombre todavía." },
  levelNew: { en: "New", es: "Nueva" },
  levelFragile: { en: "Fragile", es: "Frágil" },
  levelGrowing: { en: "Growing", es: "Creciendo" },
  levelSteady: { en: "Steady", es: "Firme" },
  barsFootnote: {
    en: "The bars estimate spoken recall, not permanent mastery. Using a word with visible meanings counts as supported practice.",
    es: "Las barras estiman cuánto recuerdas al hablar, no un dominio permanente. Usar una palabra con el significado a la vista cuenta como práctica apoyada.",
  },

  // Word detail
  alsoWritten: { en: "Also written", es: "También se escribe" },
  borrowedFrom: { en: "Borrowed from", es: "Préstamo del" },
  english: { en: "English", es: "inglés" },
  spanish: { en: "Spanish", es: "español" },
  forms: { en: "Forms", es: "Formas" },
  draftNotice: {
    en: "Draft. Not yet checked with a Miskito speaker.",
    es: "Borrador. Aún sin revisar con un hablante miskito.",
  },
  verifiedNotice: { en: "Checked with a speaker.", es: "Revisado con un hablante." },
  howDidItGo: { en: "Say it out loud. How did it go?", es: "Dilo en voz alta. ¿Cómo te fue?" },
  lastPracticed: { en: "Last practiced", es: "Última práctica" },
  never: { en: "never", es: "nunca" },
  theme: { en: "Theme", es: "Tema" },

  // Practice
  practiceEyebrow: { en: "Spoken recall", es: "Recordar al hablar" },
  sayItInMiskito: { en: "Say it in Miskito.", es: "Dilo en miskito." },
  show: { en: "Show", es: "Mostrar" },
  hint: { en: "A little help", es: "Una ayudita" },
  rateAgain: { en: "Not yet", es: "Todavía no" },
  rateHard: { en: "With help", es: "Con ayuda" },
  rateGood: { en: "Got it", es: "Lo tengo" },
  rateEasy: { en: "Easy", es: "Fácil" },
  supportedNote: {
    en: "You peeked, so this counts as supported practice.",
    es: "Miraste la ayuda, así que cuenta como práctica apoyada.",
  },
  sessionDone: { en: "That's the round.", es: "Fin de la ronda." },
  sessionSummary: { en: "words practiced", es: "palabras practicadas" },
  backToWords: { en: "Back to words", es: "Volver a las palabras" },
  anotherRound: { en: "Another round", es: "Otra ronda" },
  nothingToPractice: {
    en: "Nothing is due. Come back later, or open a word and practice it directly.",
    es: "No hay nada pendiente. Vuelve más tarde, o abre una palabra y practícala.",
  },

  // Themes
  themesEyebrow: { en: "A place to begin", es: "Un lugar para empezar" },
  themesTitle: { en: "What's on your mind?", es: "¿Qué tienes en mente?" },
  themesSubtitle: { en: "Same friend. Somewhere new.", es: "El mismo amigo. Un lugar nuevo." },
  findConversation: { en: "Find a conversation", es: "Busca una conversación" },
  justTalk: { en: "Just talk", es: "Solo hablar" },

  // Talk
  everydayMiskito: { en: "A little everyday Miskito", es: "Un poco de miskito cotidiano" },
  readyWhenYouAre: { en: "Ready when you are", es: "Cuando quieras" },
  meaning: { en: "Meaning", es: "Sentido" },
  transcript: { en: "Transcript", es: "Transcripción" },
  micOff: { en: "Microphone off", es: "Micrófono apagado" },
  voiceLater: {
    en: "Voice needs recorded Miskito speakers first. For now, Bila shares a phrase.",
    es: "La voz necesita primero grabaciones de hablantes. Por ahora, Bila comparte una frase.",
  },
  englishWelcome: { en: "English is welcome, too.", es: "El español también es bienvenido." },
  nextPhrase: { en: "Another one", es: "Otra" },
  openWord: { en: "Open this word", es: "Abrir esta palabra" },

  // Settings
  explainIn: { en: "Explain in", es: "Explicar en" },
  both: { en: "Both", es: "Ambos" },
  explainHint: {
    en: "The language Bila uses for meanings and for the app itself.",
    es: "El idioma que Bila usa para los significados y para la propia app.",
  },
  spelling: { en: "Spelling", es: "Ortografía" },
  spellingNote: {
    en: "Words follow the Nicaraguan school standard. Older Moravian and Honduran spellings appear as variants on each word.",
    es: "Las palabras siguen el estándar escolar nicaragüense. Las grafías moravas antiguas y hondureñas aparecen como variantes en cada palabra.",
  },
  progress: { en: "Progress", es: "Progreso" },
  wordsMet: { en: "words met", es: "palabras vistas" },
  steadyWords: { en: "steady", es: "firmes" },
  exportProgress: { en: "Export progress", es: "Exportar progreso" },
  importProgress: { en: "Import progress", es: "Importar progreso" },
  resetProgress: { en: "Reset progress", es: "Borrar progreso" },
  resetConfirm: {
    en: "Forget every review? Your words stay, the bars go back to zero.",
    es: "¿Olvidar todas las prácticas? Las palabras quedan, las barras vuelven a cero.",
  },
  imported: { en: "Progress imported.", es: "Progreso importado." },
  importFailed: { en: "That file didn't look like Bila progress.", es: "Ese archivo no parece progreso de Bila." },
  about: { en: "About", es: "Acerca de" },
  aboutText: {
    en: "Bila is a small companion for learning Miskito. The phrasebook is a draft until a speaker checks it, and it lives entirely on this device.",
    es: "Bila es un pequeño compañero para aprender miskito. El vocabulario es un borrador hasta que un hablante lo revise, y vive solo en este dispositivo.",
  },
  offlineTitle: { en: "You're offline.", es: "Sin conexión." },
  offlineText: {
    en: "Your words are still here. Pages you've opened before will load.",
    es: "Tus palabras siguen aquí. Las páginas que ya abriste cargarán.",
  },
} satisfies Record<string, Bi>;

export type StringKey = keyof typeof strings;

/** The single UI language derived from the explain-in preference. */
export function uiLang(explainIn: ExplainIn): Lang {
  return explainIn === "es" ? "es" : "en";
}

export function pick(bi: Bi, lang: Lang): string {
  return bi[lang];
}

/** Glosses to show for an entry, in display order. */
export function glosses(bi: Bi, explainIn: ExplainIn): string[] {
  if (explainIn === "both") return [bi.en, bi.es];
  return [bi[explainIn]];
}
