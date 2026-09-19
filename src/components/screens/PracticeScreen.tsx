"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { Sparkles } from "lucide-react";
import { db } from "@/lib/db";
import { useSettings } from "@/lib/settings";
import { isDue, rate, Rating, type Grade } from "@/lib/srs";
import { words } from "@/lib/phrasebook";
import type { Entry } from "@/lib/types";
import { BackLink } from "@/components/BackLink";
import { Eyebrow } from "@/components/Section";
import { RateButton } from "./WordDetail";
import { cn } from "@/lib/cn";

const SESSION_SIZE = 10;

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

async function buildQueue(): Promise<Entry[]> {
  const reviews = await db.reviews.toArray();
  const map = new Map(reviews.map((r) => [r.id, r]));
  const due = words.filter((e) => isDue(map.get(e.id)));
  const fresh = words.filter((e) => !map.has(e.id));
  return [...shuffle(due), ...shuffle(fresh)].slice(0, SESSION_SIZE);
}

function hintFor(mk: string): string {
  return mk
    .split(" ")
    .map((w) => {
      const letters = w.replace(/[^\p{L}]/gu, "");
      if (letters.length <= 1) return w;
      return letters[0] + "·".repeat(letters.length - 1);
    })
    .join(" ");
}

export function PracticeScreen() {
  const { t, meanings, bi } = useSettings();
  const [queue, setQueue] = useState<Entry[] | null>(null);
  const [index, setIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [hinted, setHinted] = useState(false);
  const [tally, setTally] = useState({ again: 0, hard: 0, good: 0, easy: 0 });

  useEffect(() => {
    let alive = true;
    buildQueue().then((q) => alive && setQueue(q));
    return () => {
      alive = false;
    };
  }, []);

  const restart = () => {
    setQueue(null);
    setIndex(0);
    setRevealed(false);
    setHinted(false);
    setTally({ again: 0, hard: 0, good: 0, easy: 0 });
    buildQueue().then(setQueue);
  };

  if (!queue) return <BackLink href="/words" />;

  if (queue.length === 0) {
    return (
      <div>
        <BackLink href="/words" />
        <section className="mt-9">
          <Eyebrow>{t("practiceEyebrow")}</Eyebrow>
          <h1 className="display mt-4">{t("allCaughtUp")}</h1>
          <p className="mt-4 text-[20px] text-ink-2">{t("nothingToPractice")}</p>
        </section>
      </div>
    );
  }

  if (index >= queue.length) {
    const total = queue.length;
    return (
      <div>
        <BackLink href="/words" />
        <section className="mt-9">
          <Eyebrow>{t("practiceEyebrow")}</Eyebrow>
          <h1 className="display mt-4">{t("sessionDone")}</h1>
          <p className="mt-4 text-[20px] text-ink-2">
            {total} {t("sessionSummary")}
          </p>
          <div className="mt-6 grid grid-cols-4 gap-2 text-center">
            {(
              [
                ["again", t("rateAgain")],
                ["hard", t("rateHard")],
                ["good", t("rateGood")],
                ["easy", t("rateEasy")],
              ] as const
            ).map(([k, label]) => (
              <div key={k} className="rounded-card bg-surface px-2 py-4 shadow-soft">
                <div className="text-[26px] font-bold text-ink">{tally[k]}</div>
                <div className="text-[14px] text-ink-2">{label}</div>
              </div>
            ))}
          </div>
          <div className="mt-8 flex flex-col gap-3">
            <button
              type="button"
              onClick={restart}
              className="rounded-pill bg-accent px-6 py-4 text-[18px] font-semibold text-white"
            >
              {t("anotherRound")}
            </button>
            <Link href="/words" className="rounded-pill bg-surface px-6 py-4 text-center text-[18px] font-semibold text-ink shadow-soft">
              {t("backToWords")}
            </Link>
          </div>
        </section>
      </div>
    );
  }

  const entry = queue[index];

  const onRate = async (g: Grade) => {
    await rate(entry.id, g, hinted);
    const key = g === Rating.Again ? "again" : g === Rating.Hard ? "hard" : g === Rating.Good ? "good" : "easy";
    setTally((x) => ({ ...x, [key]: x[key] + 1 }));
    setIndex((i) => i + 1);
    setRevealed(false);
    setHinted(false);
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <BackLink href="/words" />
        <span className="text-[17px] text-ink-2">
          {index + 1} / {queue.length}
        </span>
      </div>

      <motion.section
        key={entry.id}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        className="mt-9"
      >
        <Eyebrow>{t("practiceEyebrow")}</Eyebrow>
        {meanings(entry.gloss).map((g, i) => (
          <p key={i} className={cn(i === 0 ? "display mt-4" : "mt-3 text-[22px] text-ink-2")}>
            {g}
          </p>
        ))}
        <p className="mt-5 text-[19px] text-ink-2">{t("sayItInMiskito")}</p>

        {!revealed && hinted && (
          <p className="mt-8 text-[30px] font-semibold tracking-wide text-ink-3">{hintFor(entry.mk)}</p>
        )}

        {revealed && (
          <div className="mt-8 rounded-card bg-surface p-6 shadow-soft">
            <div className="text-[34px] font-bold leading-tight tracking-tight text-ink">{entry.mk}</div>
            {entry.variants?.length ? (
              <p className="mt-2 text-[15px] text-ink-3">
                {t("alsoWritten")}: {entry.variants.join(", ")}
              </p>
            ) : null}
            {entry.note && <p className="mt-3 text-[17px] text-ink-2">{bi(entry.note)}</p>}
            {hinted && <p className="mt-3 text-[15px] text-ink-3">{t("supportedNote")}</p>}
          </div>
        )}

        {!revealed ? (
          <div className="mt-10 flex gap-3">
            {!hinted && (
              <button
                type="button"
                onClick={() => setHinted(true)}
                className="flex items-center gap-2 rounded-pill bg-surface px-6 py-4 text-[18px] font-semibold text-ink shadow-soft"
              >
                <Sparkles className="h-5 w-5" />
                {t("hint")}
              </button>
            )}
            <button
              type="button"
              onClick={() => setRevealed(true)}
              className="flex-1 rounded-pill bg-accent px-6 py-4 text-[18px] font-semibold text-white"
            >
              {t("show")}
            </button>
          </div>
        ) : (
          <div className={cn("mt-8 grid gap-2", hinted ? "grid-cols-3" : "grid-cols-4")}>
            <RateButton onClick={() => onRate(Rating.Again)} tone="soft">
              {t("rateAgain")}
            </RateButton>
            <RateButton onClick={() => onRate(Rating.Hard)} tone="butter">
              {t("rateHard")}
            </RateButton>
            <RateButton onClick={() => onRate(Rating.Good)} tone="accent">
              {t("rateGood")}
            </RateButton>
            {!hinted && (
              <RateButton onClick={() => onRate(Rating.Easy)} tone="accent">
                {t("rateEasy")}
              </RateButton>
            )}
          </div>
        )}
      </motion.section>
    </div>
  );
}
