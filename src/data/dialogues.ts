import type { Bi } from "@/lib/types";

/*
  Scripted dialogues. Bila speaks a line; you answer by choosing a reply.
  Replies marked `ok: false` are understandable but not what Bila asked;
  Bila nudges and lets you choose again. Each dialogue is a draft until a
  speaker checks it. Keep lines to phrases that exist in the phrasebook.
*/
export type Choice = { mk: string; gloss: Bi; ok?: boolean; note?: Bi };
export type Turn = { bila: string; gloss: Bi; choices: Choice[] };
export type Dialogue = {
  id: string;
  theme: string;
  title: Bi;
  intro: Bi;
  turns: Turn[];
  outro: { mk: string; gloss: Bi };
  verified: boolean;
};

const d = (x: Omit<Dialogue, "verified">): Dialogue => ({ verified: false, ...x });

export const dialogues: Dialogue[] = [
  d({
    id: "door",
    theme: "greetings",
    title: { en: "At the door", es: "En la puerta" },
    intro: { en: "A neighbour stops by. Say hello and introduce yourself.", es: "Pasa un vecino. Saluda y preséntate." },
    turns: [
      {
        bila: "Naksa!",
        gloss: { en: "Hello!", es: "¡Hola!" },
        choices: [
          { mk: "Pain. Nakisma?", gloss: { en: "Fine. How are you?", es: "Bien. ¿Cómo estás?" }, ok: true },
          { mk: "Aisabe.", gloss: { en: "Goodbye.", es: "Adiós." }, note: { en: "That's a goodbye. Try answering the greeting.", es: "Eso es una despedida. Responde al saludo." } },
          { mk: "Tingki pali.", gloss: { en: "Thank you very much.", es: "Muchas gracias." }, note: { en: "Nothing to thank yet. Answer Naksa with Pain.", es: "Aún no hay nada que agradecer. A Naksa se responde Pain." } },
        ],
      },
      {
        bila: "Pain sna. Man ninam dia?",
        gloss: { en: "I'm fine. What's your name?", es: "Estoy bien. ¿Cómo te llamas?" },
        choices: [
          { mk: "Yang nini ___ sa.", gloss: { en: "My name is ___.", es: "Me llamo ___." }, ok: true },
          { mk: "Man ninam dia?", gloss: { en: "What's your name?", es: "¿Cómo te llamas?" }, note: { en: "You'd echo the question. Say your name first: Yang nini ___ sa.", es: "Repetirías la pregunta. Di tu nombre: Yang nini ___ sa." } },
        ],
      },
      {
        bila: "Lilia sna mai kakaira takaia. Man ani wina?",
        gloss: { en: "Glad to meet you. Where are you from?", es: "Me alegra conocerte. ¿De dónde eres?" },
        choices: [
          { mk: "Yang Bilwi wina.", gloss: { en: "I'm from Bilwi.", es: "Soy de Bilwi." }, ok: true },
          { mk: "Yang tawan wina.", gloss: { en: "I'm from town.", es: "Soy del pueblo." }, ok: true },
          { mk: "Kli aisas.", gloss: { en: "Say it again.", es: "Dilo otra vez." }, note: { en: "Fair enough. ani wina means from where.", es: "Vale. ani wina significa de dónde." } },
        ],
      },
      {
        bila: "Man Miskitu aisisma?",
        gloss: { en: "Do you speak Miskito?", es: "¿Hablas miskito?" },
        choices: [
          { mk: "Wiria. Yang Miskitu bila lan takisna.", gloss: { en: "A little. I'm learning Miskito.", es: "Un poco. Estoy aprendiendo miskito." }, ok: true },
          { mk: "Apia.", gloss: { en: "No.", es: "No." }, ok: true, note: { en: "You just did, though.", es: "Pero acabas de hacerlo." } },
        ],
      },
    ],
    outro: { mk: "Yamni! Kaiki was.", gloss: { en: "Good! Take care.", es: "¡Bien! Que te vaya bien." } },
  }),
  d({
    id: "market",
    theme: "town",
    title: { en: "At the market", es: "En el mercado" },
    intro: { en: "You're buying fish in Bilwi. Ask the price and decide.", es: "Compras pescado en Bilwi. Pregunta el precio y decide." },
    turns: [
      {
        bila: "Naksa! Dia want sma?",
        gloss: { en: "Hello! What do you want?", es: "¡Hola! ¿Qué quieres?" },
        choices: [
          { mk: "Inska want sna.", gloss: { en: "I want fish.", es: "Quiero pescado." }, ok: true },
          { mk: "Rais want sna.", gloss: { en: "I want rice.", es: "Quiero arroz." }, ok: true },
          { mk: "Pain sna.", gloss: { en: "I'm fine.", es: "Estoy bien." }, note: { en: "That answers Nakisma. Here you're asked what you want.", es: "Eso responde a Nakisma. Aquí te preguntan qué quieres." } },
        ],
      },
      {
        bila: "Naha inska pain sa.",
        gloss: { en: "This fish is good.", es: "Este pescado está bueno." },
        choices: [
          { mk: "Praiska nahki?", gloss: { en: "How much is it?", es: "¿Cuánto cuesta?" }, ok: true },
          { mk: "Inska tara sa!", gloss: { en: "It's a big fish!", es: "¡Es un pez grande!" }, ok: true, note: { en: "True. Now ask the price: Praiska nahki?", es: "Cierto. Ahora pregunta el precio: Praiska nahki?" } },
        ],
      },
      {
        bila: "Yawanaiska.",
        gloss: { en: "Twenty.", es: "Veinte." },
        choices: [
          { mk: "Pain sa. Kum aik.", gloss: { en: "Fine. Give me one.", es: "Está bien. Dame uno." }, ok: true },
          { mk: "Uya! Apia, tingki.", gloss: { en: "A lot! No, thanks.", es: "¡Mucho! No, gracias." }, ok: true },
          { mk: "Matawalsip?", gloss: { en: "Ten?", es: "¿Diez?" }, ok: true, note: { en: "Bargaining. yawanaiska is twenty, matawalsip ten.", es: "Regateo. yawanaiska es veinte, matawalsip diez." } },
        ],
      },
    ],
    outro: { mk: "Tingki pali! Kaiki was.", gloss: { en: "Thank you very much! Take care.", es: "¡Muchas gracias! Que te vaya bien." } },
  }),
  d({
    id: "family",
    theme: "family",
    title: { en: "Who's at home", es: "Quién hay en casa" },
    intro: { en: "A friend asks about your family.", es: "Un amigo te pregunta por tu familia." },
    turns: [
      {
        bila: "Mayam brisma?",
        gloss: { en: "Do you have a spouse?", es: "¿Tienes esposo o esposa?" },
        choices: [
          { mk: "Au, yang mayi brisna.", gloss: { en: "Yes, I have a spouse.", es: "Sí, tengo esposo, esposa." }, ok: true },
          { mk: "Apia, yang mayi apu.", gloss: { en: "No, I don't have one.", es: "No, no tengo." }, ok: true },
        ],
      },
      {
        bila: "Tuktan brisma?",
        gloss: { en: "Do you have children?", es: "¿Tienes hijos?" },
        choices: [
          { mk: "Au, tuktan wal brisna.", gloss: { en: "Yes, I have two children.", es: "Sí, tengo dos hijos." }, ok: true },
          { mk: "Apia.", gloss: { en: "No.", es: "No." }, ok: true },
          { mk: "Au, yul kum brisna.", gloss: { en: "Yes, I have a dog.", es: "Sí, tengo un perro." }, note: { en: "A dog is yul. tuktan is a child.", es: "Un perro es yul. tuktan es niño." } },
        ],
      },
      {
        bila: "Pamalikam anira iwisa?",
        gloss: { en: "Where does your family live?", es: "¿Dónde vive tu familia?" },
        choices: [
          { mk: "Bilwi ra.", gloss: { en: "In Bilwi.", es: "En Bilwi." }, ok: true },
          { mk: "Awala ra, tawan sirpi kum ra.", gloss: { en: "On the river, in a small village.", es: "En el río, en un pueblo pequeño." }, ok: true },
        ],
      },
    ],
    outro: { mk: "Yamni. Pamalikam ra audiki yas.", gloss: { en: "Good. Give my greetings to your family.", es: "Bien. Saluda a tu familia de mi parte." } },
  }),
  d({
    id: "clinic",
    theme: "health",
    title: { en: "At the clinic", es: "En la clínica" },
    intro: { en: "You don't feel well. Tell the doctor what's wrong.", es: "No te sientes bien. Dile al médico qué te pasa." },
    turns: [
      {
        bila: "Naksa. Dîa brisma?",
        gloss: { en: "Hello. What's wrong?", es: "Hola. ¿Qué tienes?" },
        choices: [
          { mk: "Siknis ai daukisa.", gloss: { en: "I'm sick.", es: "Estoy enfermo, enferma." }, ok: true },
          { mk: "Lal klauhisa.", gloss: { en: "My head hurts.", es: "Me duele la cabeza." }, ok: true },
          { mk: "Yapan ai daukisa.", gloss: { en: "I'm sleepy.", es: "Tengo sueño." }, ok: true, note: { en: "Understood, though the doctor may want more.", es: "Entendido, aunque el médico querrá saber más." } },
        ],
      },
      {
        bila: "Anira latwan sma?",
        gloss: { en: "Where does it hurt?", es: "¿Dónde te duele?" },
        choices: [
          { mk: "Lal klauhisa.", gloss: { en: "My head hurts.", es: "Me duele la cabeza." }, ok: true },
          { mk: "Biara klauhisa.", gloss: { en: "My stomach hurts.", es: "Me duele el estómago." }, ok: true },
          { mk: "Tihmia yamni.", gloss: { en: "Good night.", es: "Buenas noches." }, note: { en: "Not yet. Name a body part: lal, biara.", es: "Todavía no. Di una parte del cuerpo: lal, biara." } },
        ],
      },
      {
        bila: "Rih brisma?",
        gloss: { en: "Do you have a fever?", es: "¿Tienes fiebre?" },
        choices: [
          { mk: "Au, rih brisna.", gloss: { en: "Yes, I have a fever.", es: "Sí, tengo fiebre." }, ok: true },
          { mk: "Apia, rih apu.", gloss: { en: "No, no fever.", es: "No, no tengo fiebre." }, ok: true },
        ],
      },
      {
        bila: "Naha sîka dis. Yamni yaps.",
        gloss: { en: "Drink this medicine. Sleep well.", es: "Toma esta medicina. Duerme bien." },
        choices: [
          { mk: "Tingki, daktar.", gloss: { en: "Thank you, doctor.", es: "Gracias, doctor." }, ok: true },
          { mk: "Kli aisas.", gloss: { en: "Say it again.", es: "Dilo otra vez." }, ok: true, note: { en: "sîka is medicine; dis is drink, as an order.", es: "sîka es medicina; dis es bebe, en imperativo." } },
        ],
      },
    ],
    outro: { mk: "Kaiki was.", gloss: { en: "Take care.", es: "Que te vaya bien." } },
  }),
  d({
    id: "sea",
    theme: "river",
    title: { en: "Out on the water", es: "En el agua" },
    intro: { en: "Bila is taking the canoe out. Come along.", es: "Bila saca el cayuco. Acompáñalo." },
    turns: [
      {
        bila: "Naiwa kabu ra wamna. Man wama?",
        gloss: { en: "Today I'm going to the sea. Are you coming?", es: "Hoy voy al mar. ¿Vienes?" },
        choices: [
          { mk: "Au, yang sin wamna.", gloss: { en: "Yes, I'm going too.", es: "Sí, yo también voy." }, ok: true },
          { mk: "Kaisa!", gloss: { en: "Let's go!", es: "¡Vamos!" }, ok: true },
          { mk: "Apia, li auhwisa.", gloss: { en: "No, it's raining.", es: "No, está lloviendo." }, ok: true, note: { en: "Bila goes anyway.", es: "Bila va de todos modos." } },
        ],
      },
      {
        bila: "Duri ra! Inska alkaia.",
        gloss: { en: "Into the canoe! Let's fish.", es: "¡Al cayuco! A pescar." },
        choices: [
          { mk: "Pasa karna sa?", gloss: { en: "Is the wind strong?", es: "¿Hay viento fuerte?" }, ok: true },
          { mk: "Li wiria aik.", gloss: { en: "Give me a little water.", es: "Dame un poco de agua." }, ok: true },
        ],
      },
      {
        bila: "Apia, pasa apu. Lapta sa.",
        gloss: { en: "No, no wind. It's hot.", es: "No, no hay viento. Hace calor." },
        choices: [
          { mk: "Kabu tara sa.", gloss: { en: "The sea is big.", es: "El mar es grande." }, ok: true },
          { mk: "Yang inska kaikisna!", gloss: { en: "I see a fish!", es: "¡Veo un pez!" }, ok: true },
        ],
      },
    ],
    outro: { mk: "Inska tara! Lilia sna.", gloss: { en: "A big fish! I'm happy.", es: "¡Un pez grande! Estoy feliz." } },
  }),
  d({
    id: "morning",
    theme: "weather",
    title: { en: "A rainy morning", es: "Una mañana de lluvia" },
    intro: { en: "Rain on the roof. Bila asks about your day.", es: "Llueve sobre el techo. Bila te pregunta por tu día." },
    turns: [
      {
        bila: "Titan yamni! Li auhwisa.",
        gloss: { en: "Good morning! It's raining.", es: "¡Buenos días! Está lloviendo." },
        choices: [
          { mk: "Titan yamni. Au, kauhla sa.", gloss: { en: "Good morning. Yes, it's cold.", es: "Buenos días. Sí, hace frío." }, ok: true },
          { mk: "Tutni yamni.", gloss: { en: "Good afternoon.", es: "Buenas tardes." }, note: { en: "It's morning: titan, not tutni.", es: "Es de mañana: titan, no tutni." } },
        ],
      },
      {
        bila: "Naiwa wark ra wama?",
        gloss: { en: "Are you going to work today?", es: "¿Vas al trabajo hoy?" },
        choices: [
          { mk: "Au, wamna.", gloss: { en: "Yes, I'm going.", es: "Sí, voy." }, ok: true },
          { mk: "Apia, naiwa Sandi sa.", gloss: { en: "No, today is Sunday.", es: "No, hoy es domingo." }, ok: true },
        ],
      },
      {
        bila: "Yauhka lapta sa kaka, kabu ra wamna.",
        gloss: { en: "If it's sunny tomorrow, I'm going to the sea.", es: "Si mañana hace sol, voy al mar." },
        choices: [
          { mk: "Yang sin!", gloss: { en: "Me too!", es: "¡Yo también!" }, ok: true },
          { mk: "Yamni. Kaiki was.", gloss: { en: "Good. Take care.", es: "Bien. Que te vaya bien." }, ok: true },
        ],
      },
    ],
    outro: { mk: "Aisabe! Yamni yaps.", gloss: { en: "Goodbye! Sleep well.", es: "¡Adiós! Que duermas bien." } },
  }),
];

export const dialogueById = new Map(dialogues.map((x) => [x.id, x]));
