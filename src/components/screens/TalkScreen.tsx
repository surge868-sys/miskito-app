"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { BookOpen, MessageSquare, MessageSquareText, Mic, Sparkles } from "lucide-react";
import { useSettings } from "@/lib/settings";
import { pickRandom, talkable } from "@/lib/phrasebook";
import { themeById } from "@/data/themes";
import type { Entry } from "@/lib/types";
import { Orb } from "@/components/Orb";
import { cn } from "@/lib/cn";

export function TalkScreen() {
  const { t, bi, meanings } = useSettings();
  // Start on the greeting, like the reference starts on "Hola". Random comes on tap.
  const [phrase, setPhrase] = useState<Entry>(() => talkable.find((e) => e.id === "naksa") ?? talkable[0]);
  const [showMeaning, setShowMeaning] = useState(true);
  const [speaking, setSpeaking] = useState(false);
  const timer = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (timer.current) window.clearTimeout(timer.current);
    };
  }, []);

  const next = () => {
    setPhrase((p) => pickRandom(talkable, p));
    setSpeaking(true);
    if (timer.current) window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setSpeaking(false), 1800);
  };

  const theme = themeById.get(phrase.theme);

  return (
    <div className="flex flex-col items-center text-center">
      <span className="rounded-pill bg-tint-butter-2 px-5 py-2.5 text-[17px] text-ink-2">
        {theme ? bi(theme.name) : t("everydayMiskito")}
      </span>

      <div className="mt-4">
        <Orb speaking={speaking} size={250} />
      </div>

      <p className="text-[19px] text-ink-2">{speaking ? t("speaking") : t("readyWhenYouAre")}</p>

      <div className="mt-6 min-h-[100px]">
        <p className="display-sm px-2">{phrase.mk}</p>
        {showMeaning &&
          meanings(phrase.gloss).map((g, i) => (
            <p key={i} className={cn("mt-2 text-[20px]", i === 0 ? "text-ink-2" : "text-ink-3")}>
              {g}
            </p>
          ))}
      </div>

      <div className="mt-8 flex items-end justify-center gap-8">
        <button
          type="button"
          onClick={() => setShowMeaning((v) => !v)}
          aria-pressed={showMeaning}
          className="flex flex-col items-center gap-2"
        >
          <span
            className={cn(
              "grid h-[72px] w-[72px] place-items-center rounded-full transition-colors",
              showMeaning ? "bg-tint-butter-2 text-ink" : "bg-surface text-ink-2 shadow-soft",
            )}
          >
            {showMeaning ? <MessageSquareText className="h-7 w-7" /> : <MessageSquare className="h-7 w-7" />}
          </span>
          <span className="text-[17px] text-ink-2">{t("meaning")}</span>
        </button>

        <button
          type="button"
          aria-disabled
          title={t("voiceLater")}
          className="grid h-[120px] w-[120px] cursor-not-allowed place-items-center rounded-full bg-accent text-ink opacity-60"
        >
          <Mic className="h-10 w-10" strokeWidth={2.2} />
        </button>

        <button type="button" aria-disabled className="flex cursor-not-allowed flex-col items-center gap-2 opacity-50">
          <span className="grid h-[72px] w-[72px] place-items-center rounded-full bg-surface text-ink-2 shadow-soft">
            <MessageSquare className="h-7 w-7" />
          </span>
          <span className="text-[17px] text-ink-2">{t("transcript")}</span>
        </button>
      </div>

      <p className="mt-5 text-[17px] text-ink-2">{t("micOff")}</p>
      <p className="mt-1 max-w-[320px] text-[15px] leading-snug text-ink-3">{t("voiceLater")}</p>

      <div className="mt-4 flex items-center gap-6">
        <button type="button" onClick={next} className="flex items-center gap-2 text-[18px] font-medium text-ink">
          <Sparkles className="h-5 w-5" />
          {t("hint")}
        </button>
        <Link href={`/words/${phrase.id}`} className="flex items-center gap-2 text-[18px] font-medium text-ink">
          <BookOpen className="h-5 w-5" />
          {t("openWord")}
        </Link>
      </div>
    </div>
  );
}
