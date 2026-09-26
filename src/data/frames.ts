import type { Bi } from "@/lib/types";

/*
  Sentence frames. Each is one verified pattern with a slot; the app fills
  the slot from words the learner already has, so a few dozen frames yield
  hundreds of true sentences. A speaker checks the frame once.

  `{x}` is the slot in the template and in the gloss templates. Slots list
  phrasebook entry ids. Everything is a draft until `verified` is flipped.
*/
export type FillFrame = {
  id: string;
  kind: "fill";
  template: string;
  gloss: Bi;
  slots: string[];
  theme: string;
  note?: Bi;
  verified: boolean;
};

/*
  Ending frames drill the present-tense person endings: stem + sna / sma / sa.
  `obj` is a phrasebook entry id (or null for no object); glosses give the
  verb in each person.
*/
export type EndingFrame = {
  id: string;
  kind: "ending";
  stem: string;
  obj: string | null;
  en: [string, string, string];
  es: [string, string, string];
  verified: boolean;
};

export type Frame = FillFrame | EndingFrame;

const f = (x: Omit<FillFrame, "kind" | "verified">): FillFrame => ({ kind: "fill", verified: false, ...x });
const e = (x: Omit<EndingFrame, "kind" | "verified">): EndingFrame => ({ kind: "ending", verified: false, ...x });

const foods = ["plun", "rais", "bins", "inska", "upan", "brit", "mahbra", "turtia"];
const things = ["aras", "yul", "buk", "lalah", "duri", "utla", "kalila", "kwirku"];
const places = ["markit", "skul", "utla", "awala", "kabu", "aspital", "bilwi", "tawan"];

export const frames: Frame[] = [
  f({ id: "want", template: "Yang {x} want sna.", gloss: { en: "I want {x}.", es: "Quiero {x}." }, slots: ["li", "plun", "rais", "inska", "brit", "kuku", "sika", "buk"], theme: "town",
    note: { en: "want is borrowed from English. A purist may prefer brin daukisna.", es: "want viene del inglés. Un purista preferiría brin daukisna." } }),
  f({ id: "need", template: "Yang {x} nit sna.", gloss: { en: "I need {x}.", es: "Necesito {x}." }, slots: ["li", "sika", "lalah", "daktar", "plun"], theme: "health" }),
  f({ id: "have", template: "Yang {x} brisna.", gloss: { en: "I have {x}.", es: "Tengo {x}." }, slots: things, theme: "family" }),
  f({ id: "have-q", template: "Man {x} brisma?", gloss: { en: "Do you have {x}?", es: "¿Tienes {x}?" }, slots: things, theme: "family" }),
  f({ id: "where", template: "{x} anira sa?", gloss: { en: "Where is {x}?", es: "¿Dónde está {x}?" }, slots: ["utla", "markit", "skul", "aspital", "duri", "awala"], theme: "town" }),
  f({ id: "this-is", template: "Naha {x} sa.", gloss: { en: "This is {x}.", es: "Esto es {x}." }, slots: ["li", "plun", "inska", "buk", "utla", "sika"], theme: "greetings",
    note: { en: "naha means this.", es: "naha significa esto." } }),
  f({ id: "eat", template: "Yang {x} pisna.", gloss: { en: "I eat {x}.", es: "Como {x}." }, slots: foods, theme: "food" }),
  f({ id: "drink", template: "Yang {x} disna.", gloss: { en: "I drink {x}.", es: "Bebo {x}." }, slots: ["li", "tiala", "kuku-laya"], theme: "food" }),
  f({ id: "is-good", template: "{x} pain sa.", gloss: { en: "{x} is fine.", es: "{x} está bien." }, slots: ["plun", "tawan", "utla", "wark", "li"], theme: "greetings" }),
  f({ id: "is-big", template: "{x} tara sa.", gloss: { en: "{x} is big.", es: "{x} es grande." }, slots: ["utla", "duri", "awala", "kabu", "tawan", "yul", "aras"], theme: "river" }),
  f({ id: "is-small", template: "{x} sirpi sa.", gloss: { en: "{x} is small.", es: "{x} es pequeño." }, slots: ["utla", "duri", "yul", "tuktan", "inska"], theme: "river" }),
  f({ id: "is-black", template: "{x} siksa sa.", gloss: { en: "{x} is black.", es: "{x} es negro." }, slots: ["yul", "aras", "pus", "kalila"], theme: "family" }),
  f({ id: "is-white", template: "{x} pihni sa.", gloss: { en: "{x} is white.", es: "{x} es blanco." }, slots: ["yul", "aras", "pus", "kalila", "duri"], theme: "family" }),
  f({ id: "going-to", template: "Yang {x} ra wamna.", gloss: { en: "I'm going to {x}.", es: "Voy a {x}." }, slots: places, theme: "town",
    note: { en: "ra is to, at. wamna is I will go, from waia.", es: "ra es a, en. wamna es iré, de waia." } }),
  f({ id: "going-q", template: "Man {x} ra wama?", gloss: { en: "Are you going to {x}?", es: "¿Vas a {x}?" }, slots: places, theme: "town" }),
  f({ id: "give-me", template: "{x} kum aik.", gloss: { en: "Give me a {x}.", es: "Dame un {x}." }, slots: ["brit", "kap", "buk", "turtia", "mahbra", "kuku"], theme: "food",
    note: { en: "kum, one, comes after the noun.", es: "kum, uno, va después del sustantivo." } }),
  f({ id: "like", template: "Yang {x} laik sna.", gloss: { en: "I like {x}.", es: "Me gusta {x}." }, slots: ["inska", "plun", "wabul", "rais", "tawan", "kabu"], theme: "food",
    note: { en: "laik is borrowed from English like.", es: "laik viene del inglés like." } }),
  f({ id: "price", template: "{x} praiska nahki?", gloss: { en: "How much is {x}?", es: "¿Cuánto cuesta {x}?" }, slots: ["inska", "rais", "brit", "kuku", "buk", "mahbra"], theme: "town" }),
  f({ id: "see", template: "Yang {x} kaikisna.", gloss: { en: "I see {x}.", es: "Veo {x}." }, slots: ["yul", "aras", "duri", "tnawira", "kabu", "tuktan"], theme: "river" }),
  f({ id: "buying", template: "Witin {x} atkisa.", gloss: { en: "He or she is buying {x}.", es: "Él o ella compra {x}." }, slots: ["rais", "inska", "brit", "kuku", "sika", "buk"], theme: "town" }),
  f({ id: "from", template: "Yang {x} wina.", gloss: { en: "I'm from {x}.", es: "Soy de {x}." }, slots: ["bilwi", "tawan"], theme: "greetings" }),
  f({ id: "sleep-in", template: "Yang {x} ra yapisna.", gloss: { en: "I sleep in {x}.", es: "Duermo en {x}." }, slots: ["utla", "silmika", "krikri"], theme: "family" }),
  f({ id: "hurts", template: "{x} klauhisa.", gloss: { en: "My {x} hurts.", es: "Me duele {x}." }, slots: ["lal", "biara", "napa", "kiama", "mina"], theme: "health",
    note: { en: "klauhisa, it aches. Body parts here are said without my, like in the course.", es: "klauhisa, duele. Las partes del cuerpo van sin mi, como en el curso." } }),
  f({ id: "speak-q", template: "Man {x} aisisma?", gloss: { en: "Do you speak {x}?", es: "¿Hablas {x}?" }, slots: ["miskitu-bila", "ispail-bila", "ingglis-bila"], theme: "greetings" }),
  f({ id: "learning", template: "Yang {x} lan takisna.", gloss: { en: "I'm learning {x}.", es: "Estoy aprendiendo {x}." }, slots: ["miskitu-bila", "ispail-bila", "ingglis-bila"], theme: "greetings" }),

  e({ id: "pi", stem: "pi", obj: "plun", en: ["eat food", "eat food", "eats food"], es: ["como comida", "comes comida", "come comida"] }),
  e({ id: "di", stem: "di", obj: "li", en: ["drink water", "drink water", "drinks water"], es: ["bebo agua", "bebes agua", "bebe agua"] }),
  e({ id: "aisi", stem: "aisi", obj: "miskitu-bila", en: ["speak Miskito", "speak Miskito", "speaks Miskito"], es: ["hablo miskito", "hablas miskito", "habla miskito"] }),
  e({ id: "bri", stem: "bri", obj: "aras", en: ["have a horse", "have a horse", "has a horse"], es: ["tengo un caballo", "tienes un caballo", "tiene un caballo"] }),
  e({ id: "yapi", stem: "yapi", obj: null, en: ["sleep", "sleep", "sleeps"], es: ["duermo", "duermes", "duerme"] }),
  e({ id: "kaiki", stem: "kaiki", obj: "kabu", en: ["see the sea", "see the sea", "sees the sea"], es: ["veo el mar", "ves el mar", "ve el mar"] }),
  e({ id: "wali", stem: "wali", obj: null, en: ["hear", "hear", "hears"], es: ["oigo", "oyes", "oye"] }),
  e({ id: "ulbi", stem: "ulbi", obj: "buk", en: ["write a book", "write a book", "writes a book"], es: ["escribo un libro", "escribes un libro", "escribe un libro"] }),
  e({ id: "puli", stem: "puli", obj: null, en: ["play", "play", "plays"], es: ["juego", "juegas", "juega"] }),
  e({ id: "luki", stem: "luki", obj: null, en: ["think", "think", "thinks"], es: ["pienso", "piensas", "piensa"] }),
];

export const PERSONS = [
  { pronoun: "Yang", ending: "sna", en: "I", es: "Yo" },
  { pronoun: "Man", ending: "sma", en: "You", es: "Tú" },
  { pronoun: "Witin", ending: "sa", en: "He or she", es: "Él o ella" },
] as const;
