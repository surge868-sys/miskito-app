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
export type Tense = "present" | "past" | "future";
export type EndingFrame = {
  id: string;
  kind: "ending";
  tense: Tense;
  /** The verb without its person ending: pi, kaik, wa. */
  stem: string;
  /** Endings for I, you, he or she. */
  endings: [string, string, string];
  obj: string | null;
  en: [string, string, string];
  es: [string, string, string];
  verified: boolean;
};

export type Frame = FillFrame | EndingFrame;

const f = (x: Omit<FillFrame, "kind" | "verified">): FillFrame => ({ kind: "fill", verified: false, ...x });
const e = (x: Omit<EndingFrame, "kind" | "verified" | "tense" | "endings"> & Partial<Pick<EndingFrame, "tense" | "endings">>): EndingFrame => ({
  kind: "ending",
  verified: false,
  tense: "present",
  endings: ["sna", "sma", "sa"],
  ...x,
});
const PAST_V: [string, string, string] = ["ri", "ram", "n"]; // vowel-final stems: piri, piram, pin
const PAST_C: [string, string, string] = ["ri", "ram", "an"]; // consonant-final: kaikri, kaikram, kaikan
const FUT_C: [string, string, string] = ["amna", "ma", "bia"]; // kaikamna, kaikma, kaikbia

const foods = ["plun", "rais", "bins", "inska", "upan", "brit", "mahbra", "turtia"];
const things = ["aras", "yul", "buk", "lalah", "duri", "utla", "kalila", "kwirku"];
const places = ["markit", "skul", "utla", "awala", "kabu", "aspital", "bilwi", "tawan"];
const adjs = ["tara", "sirpi", "yamni", "saura", "raya", "almuk", "kauhla", "lapta", "damni", "tahpla", "klin", "taski", "pihni", "siksa"];
const feelings = ["lilia", "sari", "dirankira", "umpira"];
const seen = ["yul", "aras", "duri", "tnawira", "kabu", "tuktan", "inska", "limi", "sula"];

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

  // ── Location, existence, plural ──
  f({ id: "live-in", template: "Yang {x} ra iwisna.", gloss: { en: "I live in {x}.", es: "Vivo en {x}." }, slots: ["bilwi", "tawan", "utla", "awala"], theme: "family",
    note: { en: "iwaia is to live, to sit, to stay.", es: "iwaia es vivir, sentarse, quedarse." } }),
  f({ id: "live-q", template: "Man {x} ra iwisma?", gloss: { en: "Do you live in {x}?", es: "¿Vives en {x}?" }, slots: ["bilwi", "tawan", "utla", "awala"], theme: "family" }),
  f({ id: "none", template: "{x} apu.", gloss: { en: "There's no {x}.", es: "No hay {x}." }, slots: ["li", "plun", "lalah", "inska", "pasa", "rih"], theme: "town",
    note: { en: "apu is none, nothing. Also zero.", es: "apu es nada, no hay. También cero." } }),
  f({ id: "many", template: "{x} nani ailal sa.", gloss: { en: "There are many {x}.", es: "Hay muchos {x}." }, slots: ["inska", "tuktan", "yul", "aras", "tnawira", "tairi"], theme: "river",
    note: { en: "nani makes the plural; ailal is many.", es: "nani forma el plural; ailal es muchos." } }),
  f({ id: "at-home", template: "Witin {x} ra sa.", gloss: { en: "He or she is at {x}.", es: "Él o ella está en {x}." }, slots: places, theme: "town" }),
  f({ id: "have-one", template: "Yang {x} kum brisna.", gloss: { en: "I have a {x}.", es: "Tengo un {x}." }, slots: ["aras", "yul", "duri", "utla", "buk", "kalila"], theme: "family" }),

  // ── Describing ──
  f({ id: "this-adj", template: "Naha {x} sa.", gloss: { en: "This is {x}.", es: "Esto es {x}." }, slots: adjs, theme: "town" }),
  f({ id: "i-feel", template: "Yang {x} sna.", gloss: { en: "I'm {x}.", es: "Estoy {x}." }, slots: feelings, theme: "health" }),
  f({ id: "you-feel-q", template: "Man {x} sma?", gloss: { en: "Are you {x}?", es: "¿Estás {x}?" }, slots: feelings, theme: "health" }),
  f({ id: "he-is", template: "Witin {x} sa.", gloss: { en: "He or she is {x}.", es: "Él o ella está {x}." }, slots: feelings, theme: "health" }),
  f({ id: "today-weather", template: "Naiwa {x} sa.", gloss: { en: "Today it's {x}.", es: "Hoy está {x}." }, slots: ["lapta", "kauhla", "bitni", "buswan"], theme: "weather" }),
  f({ id: "very", template: "{x} uya sa.", gloss: { en: "There's a lot of {x}.", es: "Hay mucho {x}." }, slots: ["pasa", "lapta", "li", "wark", "plun"], theme: "weather",
    note: { en: "uya is much, many, a lot.", es: "uya es mucho, muchos." } }),

  // ── Yesterday: past tense ──
  f({ id: "ate-past", template: "Nahwala yang {x} piri.", gloss: { en: "Yesterday I ate {x}.", es: "Ayer comí {x}." }, slots: foods, theme: "food",
    note: { en: "Past tense: piri, I ate; piram, you ate; pin, he or she ate.", es: "Pasado: piri, comí; piram, comiste; pin, comió." } }),
  f({ id: "saw-past", template: "Nahwala yang {x} kaikri.", gloss: { en: "Yesterday I saw {x}.", es: "Ayer vi {x}." }, slots: seen, theme: "river" }),
  f({ id: "went-past", template: "Nahwala yang {x} ra wari.", gloss: { en: "Yesterday I went to {x}.", es: "Ayer fui a {x}." }, slots: places, theme: "town",
    note: { en: "wari, I went; waram, you went; wan, he or she went.", es: "wari, fui; waram, fuiste; wan, fue." } }),
  f({ id: "went-q", template: "Man {x} ra waram?", gloss: { en: "Did you go to {x}?", es: "¿Fuiste a {x}?" }, slots: places, theme: "town" }),
  f({ id: "bought-past", template: "Yang {x} atkri.", gloss: { en: "I bought {x}.", es: "Compré {x}." }, slots: ["rais", "inska", "brit", "kuku", "sika", "buk", "bins"], theme: "town" }),
  f({ id: "came-past", template: "Witin {x} wina balan.", gloss: { en: "He or she came from {x}.", es: "Él o ella vino de {x}." }, slots: ["bilwi", "tawan", "awala", "kabu", "markit"], theme: "town" }),

  // ── Tomorrow: future tense ──
  f({ id: "will-see", template: "Yauhka yang {x} kaikamna.", gloss: { en: "Tomorrow I'll see {x}.", es: "Mañana veré {x}." }, slots: seen, theme: "river",
    note: { en: "Future: kaikamna, I will see; kaikma, you will; kaikbia, he or she will.", es: "Futuro: kaikamna, veré; kaikma, verás; kaikbia, verá." } }),
  f({ id: "will-go", template: "Witin {x} ra wabia.", gloss: { en: "He or she will go to {x}.", es: "Él o ella irá a {x}." }, slots: places, theme: "town" }),
  f({ id: "will-come", template: "Yauhka {x} balbia.", gloss: { en: "Tomorrow {x} will come.", es: "Mañana vendrá {x}." }, slots: ["daktar", "pana", "mama", "papa", "pasa", "li"], theme: "family" }),
  f({ id: "will-buy", template: "Yang {x} atkamna.", gloss: { en: "I'll buy {x}.", es: "Compraré {x}." }, slots: ["rais", "inska", "brit", "kuku", "sika", "buk"], theme: "town" }),

  // ── Not: negation ──
  f({ id: "not-have", template: "Yang {x} briras.", gloss: { en: "I don't have {x}.", es: "No tengo {x}." }, slots: [...things, "lalah", "sika"], theme: "town",
    note: { en: "ras makes a verb negative for every person: briras, piras, kaikras.", es: "ras niega el verbo para todas las personas: briras, piras, kaikras." } }),
  f({ id: "not-eat", template: "Yang {x} piras.", gloss: { en: "I don't eat {x}.", es: "No como {x}." }, slots: foods, theme: "food" }),
  f({ id: "not-drink", template: "Yang {x} diras.", gloss: { en: "I don't drink {x}.", es: "No bebo {x}." }, slots: ["li", "tiala", "kuku-laya"], theme: "food" }),
  f({ id: "not-see", template: "Yang {x} kaikras.", gloss: { en: "I don't see {x}.", es: "No veo {x}." }, slots: seen, theme: "river" }),
  f({ id: "not-know", template: "Yang {x} nu apia.", gloss: { en: "I don't know {x}.", es: "No conozco {x}." }, slots: ["bilwi", "tawan", "daktar", "witin"], theme: "greetings",
    note: { en: "nu apia: not known. apia negates what isn't a verb.", es: "nu apia: no conocido. apia niega lo que no es verbo." } }),

  // ── Commands ──
  f({ id: "cmd-eat", template: "{x} pis!", gloss: { en: "Eat the {x}!", es: "¡Come el {x}!" }, slots: foods, theme: "food",
    note: { en: "Commands end in s: pis, dis, kaiks, was. Come is just bal.", es: "Los mandatos terminan en s: pis, dis, kaiks, was. Ven es solo bal." } }),
  f({ id: "cmd-drink", template: "{x} dis!", gloss: { en: "Drink the {x}!", es: "¡Bebe el {x}!" }, slots: ["li", "tiala", "sika", "kuku-laya"], theme: "food" }),
  f({ id: "cmd-look", template: "{x} kaiks!", gloss: { en: "Look at the {x}!", es: "¡Mira el {x}!" }, slots: seen, theme: "river" }),
  f({ id: "cmd-go", template: "{x} ra was!", gloss: { en: "Go to {x}!", es: "¡Ve a {x}!" }, slots: places, theme: "town" }),
  f({ id: "cmd-come", template: "{x} ra bal!", gloss: { en: "Come to {x}!", es: "¡Ven a {x}!" }, slots: ["utla", "kabu", "awala", "markit", "duri"], theme: "town" }),
  f({ id: "cmd-give", template: "{x} aik!", gloss: { en: "Give me {x}!", es: "¡Dame {x}!" }, slots: ["li", "plun", "sika", "lalah", "buk"], theme: "food" }),

  // ── Mine and yours ──
  f({ id: "mine", template: "Naha {x}ki sa.", gloss: { en: "This is my {x}.", es: "Este es mi {x}." }, slots: ["aras", "yul", "duri", "buk", "kalila"], theme: "family",
    note: { en: "ki on the noun means my; kam is your; ka is his or her. Some nouns change shape instead, so check each one.", es: "ki en el sustantivo es mi; kam es tu; ka es su. Algunos sustantivos cambian de forma, revisa cada uno." } }),
  f({ id: "yours-q", template: "Naha {x}kam sa?", gloss: { en: "Is this your {x}?", es: "¿Es este tu {x}?" }, slots: ["aras", "yul", "duri", "buk", "kalila"], theme: "family" }),
  f({ id: "his", template: "Baha {x}ka sa.", gloss: { en: "That is his or her {x}.", es: "Ese es su {x}." }, slots: ["aras", "yul", "duri", "buk", "kalila"], theme: "family",
    note: { en: "baha means that.", es: "baha significa eso, ese." } }),

  // ── Wanting and liking ──
  f({ id: "like-q", template: "Man {x} laik sma?", gloss: { en: "Do you like {x}?", es: "¿Te gusta {x}?" }, slots: ["inska", "plun", "wabul", "rais", "tawan", "kabu"], theme: "food" }),
  f({ id: "want-q", template: "Man {x} want sma?", gloss: { en: "Do you want {x}?", es: "¿Quieres {x}?" }, slots: ["li", "plun", "rais", "inska", "brit", "kuku"], theme: "food" }),
  f({ id: "he-eats", template: "Witin {x} pisa.", gloss: { en: "He or she eats {x}.", es: "Él o ella come {x}." }, slots: foods, theme: "food" }),
  f({ id: "you-eat-q", template: "Man {x} pisma?", gloss: { en: "Do you eat {x}?", es: "¿Comes {x}?" }, slots: foods, theme: "food" }),

  // ── Past tense drills ──
  e({ id: "pi-past", tense: "past", stem: "pi", endings: PAST_V, obj: "plun", en: ["ate food", "ate food", "ate food"], es: ["comí comida", "comiste comida", "comió comida"] }),
  e({ id: "di-past", tense: "past", stem: "di", endings: PAST_V, obj: "li", en: ["drank water", "drank water", "drank water"], es: ["bebí agua", "bebiste agua", "bebió agua"] }),
  e({ id: "wa-past", tense: "past", stem: "wa", endings: PAST_V, obj: "markit-ra", en: ["went to the market", "went to the market", "went to the market"], es: ["fui al mercado", "fuiste al mercado", "fue al mercado"] }),
  e({ id: "kaik-past", tense: "past", stem: "kaik", endings: PAST_C, obj: "kabu", en: ["saw the sea", "saw the sea", "saw the sea"], es: ["vi el mar", "viste el mar", "vio el mar"] }),
  e({ id: "bal-past", tense: "past", stem: "bal", endings: PAST_C, obj: null, en: ["came", "came", "came"], es: ["vine", "viniste", "vino"] }),
  e({ id: "yap-past", tense: "past", stem: "yap", endings: PAST_C, obj: null, en: ["slept", "slept", "slept"], es: ["dormí", "dormiste", "durmió"] }),
  e({ id: "atk-past", tense: "past", stem: "atk", endings: PAST_C, obj: "rais", en: ["bought rice", "bought rice", "bought rice"], es: ["compré arroz", "compraste arroz", "compró arroz"] }),

  // ── Future tense drills ──
  e({ id: "wa-fut", tense: "future", stem: "wa", endings: ["mna", "ma", "bia"], obj: "kabu-ra", en: ["will go to the sea", "will go to the sea", "will go to the sea"], es: ["iré al mar", "irás al mar", "irá al mar"] }),
  e({ id: "kaik-fut", tense: "future", stem: "kaik", endings: FUT_C, obj: "inska", en: ["will see the fish", "will see the fish", "will see the fish"], es: ["veré el pez", "verás el pez", "verá el pez"] }),
  e({ id: "bal-fut", tense: "future", stem: "bal", endings: FUT_C, obj: null, en: ["will come", "will come", "will come"], es: ["vendré", "vendrás", "vendrá"] }),
  e({ id: "yap-fut", tense: "future", stem: "yap", endings: FUT_C, obj: null, en: ["will sleep", "will sleep", "will sleep"], es: ["dormiré", "dormirás", "dormirá"] }),
  e({ id: "ais-fut", tense: "future", stem: "ais", endings: FUT_C, obj: "miskitu-bila", en: ["will speak Miskito", "will speak Miskito", "will speak Miskito"], es: ["hablaré miskito", "hablarás miskito", "hablará miskito"] }),
  e({ id: "atk-fut", tense: "future", stem: "atk", endings: FUT_C, obj: "brit", en: ["will buy bread", "will buy bread", "will buy bread"], es: ["compraré pan", "comprarás pan", "comprará pan"] }),

  // ── Present tense drills ──
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

/** Object phrases that aren't single entries. */
export const OBJECT_PHRASES: Record<string, string> = { "markit-ra": "markit ra", "kabu-ra": "kabu ra" };

export const PERSONS = [
  { pronoun: "Yang", ending: "sna", en: "I", es: "Yo" },
  { pronoun: "Man", ending: "sma", en: "You", es: "Tú" },
  { pronoun: "Witin", ending: "sa", en: "He or she", es: "Él o ella" },
] as const;
