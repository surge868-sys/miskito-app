"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { Sparkles } from "lucide-react";
import { useSettings } from "@/lib/settings";
import { Rating } from "@/lib/srs";
import { buildSentenceSession, rateSentence, type SentenceItem } from "@/lib/sentences";
import { BackLink } from "@/components/BackLink";
import { Eyebrow } from "@/components/Section";
import { RateButton } from "./WordDetail";
import { cn } from "@/lib/cn";

type Tally = { again: number; hard: number; good: number; easy: number };
const zero: Tally = { again: 0, hard: 0, good: 0, easy: 0 };

export function SentencesScreen() {
  const { t, bi, meanings } = useSettings();
  const [queue, setQueue] = useState<SentenceItem[] | null>(null);
  const [index, setIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [hinted, setHinted] = useState(false);
  const [picked, setPicked] = useState<string | null>(null);
  const [order, setOrder] = useState<number[]>([]);
  const [checked, setChecked] = useState<boolean | null>(null);
  const [tally, setTally] = useState<Tally>(zero);

  useEffect(() => {
    let alive = true;
    buildSentenceSession().then((q) => alive && setQueue(q));
    return () => {
      alive = false;
    };
  }, []);

  const resetItem = () => {
    setRevealed(false);
    setHinted(false);
    setPicked(null);
    setOrder([]);
    setChecked(null);
  };
  const restart = () => {
    setQueue(null);
    setIndex(0);
    setTally(zero);
    resetItem();
    buildSentenceSession().then(setQueue);
  };
  const advance = (key: keyof Tally) => {
    setTally((x) => ({ ...x, [key]: x[key] + 1 }));
    setIndex((i) => i + 1);
    resetItem();
  };

  if (!queue) return <BackLink href="/words" />;

  if (queue.length === 0) {
    return (
      <div>
        <BackLink href="/words" />
        <section className="mt-9">
          <Eyebrow>{t("sentencesEyebrow")}</Eyebrow>
          <h1 className="display mt-4">{t("allCaughtUp")}</h1>
          <p className="mt-4 text-[20px] text-ink-2">{t("nothingToPractice")}</p>
        </section>
      </div>
    );
  }

  if (index >= queue.length) {
    return (
      <div>
        <BackLink href="/words" />
        <section className="mt-9">
          <Eyebrow>{t("sentencesEyebrow")}</Eyebrow>
          <h1 className="display mt-4">{t("sessionDone")}</h1>
          <p className="mt-4 text-[20px] text-ink-2">
            {queue.length} {t("sentences").toLowerCase()}
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
            <button type="button" onClick={restart} className="rounded-pill bg-accent px-6 py-4 text-[18px] font-semibold text-white">
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

  const item = queue[index];
  const header = (
    <div className="flex items-center justify-between">
      <BackLink href="/words" />
      <span className="text-[17px] text-ink-2">
        {index + 1} / {queue.length}
      </span>
    </div>
  );
  const glossBlock = meanings(item.gloss).map((g, i) => (
    <p key={i} className={cn(i === 0 ? "display-sm mt-4" : "mt-3 text-[20px] text-ink-2")}>
      {g}
    </p>
  ));
  const note = item.kind !== "ending" && item.frame.note ? <p className="mt-3 text-[15px] text-ink-3">{bi(item.frame.note)}</p> : null;

  /* ── Say the whole sentence ── */
  if (item.kind === "fill") {
    const onRate = async (g: typeof Rating.Again | typeof Rating.Hard | typeof Rating.Good | typeof Rating.Easy) => {
      await rateSentence(item, g, hinted);
      advance(g === Rating.Again ? "again" : g === Rating.Hard ? "hard" : g === Rating.Good ? "good" : "easy");
    };
    return (
      <div>
        {header}
        <motion.section key={index} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }} className="mt-9">
          <Eyebrow>{t("sentencesEyebrow")}</Eyebrow>
          {glossBlock}
          <p className="mt-5 text-[19px] text-ink-2">{t("sayTheSentence")}</p>
          {!revealed && hinted && (
            <p className="mt-8 text-[24px] font-semibold text-ink-3">{item.frame.template.replace("{x}", "___")}</p>
          )}
          {revealed && (
            <div className="mt-8 rounded-card bg-surface p-6 shadow-soft">
              <div className="text-[30px] font-bold leading-tight tracking-tight text-ink">{item.sentence}</div>
              <p className="mt-3 text-[15px] text-ink-3">
                {t("frameNote")}: {item.frame.template}
              </p>
              {note}
              {hinted && <p className="mt-3 text-[15px] text-ink-3">{t("supportedNote")}</p>}
            </div>
          )}
          {!revealed ? (
            <div className="mt-10 flex gap-3">
              {!hinted && (
                <button type="button" onClick={() => setHinted(true)} className="flex items-center gap-2 rounded-pill bg-surface px-6 py-4 text-[18px] font-semibold text-ink shadow-soft">
                  <Sparkles className="h-5 w-5" />
                  {t("hint")}
                </button>
              )}
              <button type="button" onClick={() => setRevealed(true)} className="flex-1 rounded-pill bg-accent px-6 py-4 text-[18px] font-semibold text-white">
                {t("show")}
              </button>
            </div>
          ) : (
            <div className={cn("mt-8 grid gap-2", hinted ? "grid-cols-3" : "grid-cols-4")}>
              <RateButton onClick={() => onRate(Rating.Again)} tone="soft">{t("rateAgain")}</RateButton>
              <RateButton onClick={() => onRate(Rating.Hard)} tone="butter">{t("rateHard")}</RateButton>
              <RateButton onClick={() => onRate(Rating.Good)} tone="accent">{t("rateGood")}</RateButton>
              {!hinted && <RateButton onClick={() => onRate(Rating.Easy)} tone="accent">{t("rateEasy")}</RateButton>}
            </div>
          )}
        </motion.section>
      </div>
    );
  }

  /* ── Pick the ending ── */
  if (item.kind === "ending") {
    const onPick = async (opt: string) => {
      if (picked) return;
      setPicked(opt);
      const ok = opt === item.answer;
      setChecked(ok);
      await rateSentence(item, ok ? Rating.Good : Rating.Again);
    };
    return (
      <div>
        {header}
        <motion.section key={index} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }} className="mt-9">
          <Eyebrow>{t("sentencesEyebrow")}</Eyebrow>
          {glossBlock}
          <p className="mt-5 text-[19px] text-ink-2">{t("pickEnding")}</p>
          <p className="mt-8 text-[32px] font-bold tracking-tight text-ink">
            {item.prompt}
            <span className={cn("rounded-md px-1", picked ? (checked ? "bg-tint-sage" : "bg-tint-peach") : "bg-tint-butter-2")}>{picked ?? "___"}</span>
          </p>
          <div className="mt-8 grid grid-cols-3 gap-2">
            {item.options.map((o) => (
              <button
                key={o}
                type="button"
                onClick={() => onPick(o)}
                className={cn(
                  "rounded-pill px-4 py-4 text-[20px] font-semibold transition-colors",
                  picked === null ? "bg-surface text-ink shadow-soft" : o === item.answer ? "bg-tint-sage text-ink" : picked === o ? "bg-tint-peach text-ink-2" : "bg-surface-2 text-ink-3",
                )}
              >
                -{o}
              </button>
            ))}
          </div>
          <p className="mt-4 text-[15px] text-ink-3">{t("endingHint")}</p>
          {picked && (
            <div className="mt-6 rounded-card bg-surface p-6 shadow-soft">
              <p className="text-[17px] text-ink-2">{checked ? t("thatsIt") : t("notQuite")}</p>
              <div className="mt-1 text-[26px] font-bold text-ink">{item.sentence}</div>
              <button type="button" onClick={() => advance(checked ? "good" : "again")} className="mt-5 w-full rounded-pill bg-accent px-6 py-4 text-[18px] font-semibold text-white">
                {t("next")}
              </button>
            </div>
          )}
        </motion.section>
      </div>
    );
  }

  /* ── Put the words in order ── */
  const built = order.map((i) => item.tiles[i]).join(" ");
  const target = item.sentence.replace(/[.?!]$/, "").toLowerCase();
  const onCheck = async () => {
    const ok = built === target;
    setChecked(ok);
    await rateSentence(item, ok ? Rating.Good : Rating.Again);
  };
  return (
    <div>
      {header}
      <motion.section key={index} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }} className="mt-9">
        <Eyebrow>{t("sentencesEyebrow")}</Eyebrow>
        {glossBlock}
        <p className="mt-5 text-[19px] text-ink-2">{t("putInOrder")}</p>
        <div className="mt-8 min-h-[64px] rounded-card border border-line bg-surface px-5 py-4 text-[24px] font-semibold text-ink">
          {built || <span className="text-ink-3">…</span>}
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          {item.tiles.map((tile, i) => {
            const used = order.includes(i);
            return (
              <button
                key={i}
                type="button"
                disabled={used || checked !== null}
                onClick={() => setOrder((o) => [...o, i])}
                className={cn("rounded-pill px-5 py-3 text-[20px] font-medium transition-colors", used ? "bg-surface-2 text-ink-3" : "bg-tint-butter text-ink")}
              >
                {tile}
              </button>
            );
          })}
        </div>
        {checked === null ? (
          <div className="mt-8 flex gap-3">
            <button type="button" onClick={() => setOrder([])} className="rounded-pill bg-surface px-6 py-4 text-[18px] font-semibold text-ink shadow-soft">
              {t("startOver")}
            </button>
            <button
              type="button"
              disabled={order.length !== item.tiles.length}
              onClick={onCheck}
              className="flex-1 rounded-pill bg-accent px-6 py-4 text-[18px] font-semibold text-white disabled:opacity-50"
            >
              {t("check")}
            </button>
          </div>
        ) : (
          <div className="mt-6 rounded-card bg-surface p-6 shadow-soft">
            <p className="text-[17px] text-ink-2">{checked ? t("thatsIt") : t("notQuite")}</p>
            <div className="mt-1 text-[26px] font-bold text-ink">{item.sentence}</div>
            {note}
            <button type="button" onClick={() => advance(checked ? "good" : "again")} className="mt-5 w-full rounded-pill bg-accent px-6 py-4 text-[18px] font-semibold text-white">
              {t("next")}
            </button>
          </div>
        )}
      </motion.section>
    </div>
  );
}
