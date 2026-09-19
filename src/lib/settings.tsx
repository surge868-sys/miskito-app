"use client";

import { createContext, useContext, useMemo, useSyncExternalStore } from "react";
import type { Bi, ExplainIn, Lang } from "./types";
import { glosses, pick, strings, uiLang, type StringKey } from "./i18n";

const STORAGE_KEY = "bila.settings.v1";

type Settings = { explainIn: ExplainIn };
const defaults: Settings = { explainIn: "en" };

/* A tiny external store over localStorage, so React can subscribe to it
   without setting state inside effects. */
let cached: Settings | null = null;
const listeners = new Set<() => void>();

function read(): Settings {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaults;
    const parsed = JSON.parse(raw) as Partial<Settings>;
    const explainIn = parsed.explainIn;
    if (explainIn === "en" || explainIn === "es" || explainIn === "both") return { explainIn };
    return defaults;
  } catch {
    return defaults;
  }
}

function getSnapshot(): Settings {
  if (cached === null) cached = read();
  return cached;
}

function getServerSnapshot(): Settings {
  return defaults;
}

function subscribe(onChange: () => void) {
  listeners.add(onChange);
  const onStorage = (e: StorageEvent) => {
    if (e.key === STORAGE_KEY) {
      cached = read();
      onChange();
    }
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(onChange);
    window.removeEventListener("storage", onStorage);
  };
}

function setExplainIn(explainIn: ExplainIn) {
  cached = { explainIn };
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(cached));
  } catch {
    // Storage can be unavailable in private windows. The choice just won't stick.
  }
  listeners.forEach((l) => l());
}

type Ctx = {
  settings: Settings;
  setExplainIn: (v: ExplainIn) => void;
  lang: Lang;
  /** UI string in the current language. */
  t: (key: StringKey) => string;
  /** Any bilingual field in the current UI language. */
  bi: (value: Bi) => string;
  /** Meanings for an entry, one or two lines depending on the preference. */
  meanings: (value: Bi) => string[];
};

const SettingsContext = createContext<Ctx | null>(null);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const settings = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const value = useMemo<Ctx>(() => {
    const lang = uiLang(settings.explainIn);
    return {
      settings,
      setExplainIn,
      lang,
      t: (key) => pick(strings[key], lang),
      bi: (v) => pick(v, lang),
      meanings: (v) => glosses(v, settings.explainIn),
    };
  }, [settings]);

  return (
    <SettingsContext.Provider value={value}>
      <LangSync lang={value.lang} />
      {children}
    </SettingsContext.Provider>
  );
}

/** Keeps <html lang> in step with the explaining language. */
function LangSync({ lang }: { lang: Lang }) {
  useSyncExternalStore(
    () => () => {},
    () => {
      if (document.documentElement.lang !== lang) document.documentElement.lang = lang;
      return lang;
    },
    () => lang,
  );
  return null;
}

export function useSettings(): Ctx {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error("useSettings must be used inside SettingsProvider");
  return ctx;
}
