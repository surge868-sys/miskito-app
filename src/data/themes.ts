import type { Theme, ThemeGroup } from "@/lib/types";

export const themeGroups: { id: ThemeGroup | "all"; name: { en: string; es: string } }[] = [
  { id: "all", name: { en: "All", es: "Todo" } },
  { id: "everyday", name: { en: "Everyday", es: "Cotidiano" } },
  { id: "family", name: { en: "Family", es: "Familia" } },
  { id: "town", name: { en: "Town", es: "Pueblo" } },
  { id: "river", name: { en: "River & sea", es: "Río y mar" } },
  { id: "health", name: { en: "Health", es: "Salud" } },
];

export const themes: Theme[] = [
  {
    id: "greetings",
    name: { en: "Greetings", es: "Saludos" },
    tagline: { en: "Naksa, at the door", es: "Naksa, en la puerta" },
    group: "everyday",
    tint: "peach",
    icon: "hand",
  },
  {
    id: "family",
    name: { en: "Family", es: "Familia" },
    tagline: { en: "Who's who at home", es: "Quién es quién en casa" },
    group: "family",
    tint: "lavender",
    icon: "users",
  },
  {
    id: "town",
    name: { en: "In Bilwi", es: "En Bilwi" },
    tagline: { en: "Market, money, directions", es: "Mercado, dinero, direcciones" },
    group: "town",
    tint: "sage",
    icon: "basket",
  },
  {
    id: "food",
    name: { en: "Wabul and rice", es: "Wabul y arroz" },
    tagline: { en: "Something warm, please", es: "Algo caliente, por favor" },
    group: "everyday",
    tint: "butter",
    icon: "utensils",
  },
  {
    id: "river",
    name: { en: "River and sea", es: "Río y mar" },
    tagline: { en: "Canoes, fish, the tide", es: "Cayucos, peces, la marea" },
    group: "river",
    tint: "lavender",
    icon: "waves",
  },
  {
    id: "health",
    name: { en: "At the clinic", es: "En la clínica" },
    tagline: { en: "Where it hurts", es: "Dónde duele" },
    group: "health",
    tint: "sage",
    icon: "stethoscope",
  },
  {
    id: "weather",
    name: { en: "Weather", es: "El tiempo" },
    tagline: { en: "Rain, wind, heat", es: "Lluvia, viento, calor" },
    group: "everyday",
    tint: "peach",
    icon: "cloudsun",
  },
  {
    id: "time",
    name: { en: "Days and numbers", es: "Días y números" },
    tagline: { en: "Counting little by little", es: "Contar poco a poco" },
    group: "everyday",
    tint: "butter",
    icon: "hash",
  },
];

export const themeById = new Map(themes.map((t) => [t.id, t]));
