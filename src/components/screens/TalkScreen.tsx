"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "motion/react";
import { BookOpen, MessageSquare, MessageSquareText, Mic, PhoneOff, Sparkles } from "lucide-react";
import { useSettings } from "@/lib/settings";
import { pickRandom, talkable } from "@/lib/phrasebook";
import { rate, Rating } from "@/lib/srs";
import { themeById } from "@/data/themes";
import { dialogueById, dialogues, type Choice, type Dialogue } from "@/data/dialogues";
import type { Entry } from "@/lib/types";
import { Orb } from "@/components/Orb";
import { Eyebrow } from "@/components/Section";
import { cn } from "@/lib/cn";

const SPEAK_MS = 1800;

export function TalkScreen() {
  const params = useSearchParams();
  const dialogue = params.get("d") ? dialogueById.get(params.get("d")!) : undefined;
  return dialogue ? <DialogueView key={dialogue.id} dialogue={dialogue} /> : <IdleView />;
}

/* ── Idle: a phrase of the moment and the list of conversations ── */
function IdleView() {
  const { t, bi, meanings } = useSettings();
  const [phrase, setPhrase] = useState<Entry>(() => talkable.find((e) => e.id === "naksa") ?? talkable[0]);
  const [showMeaning, setShowMeaning] = useState(true);
  const [speaking, setSpeaking] = useState(false);
  const timer = useRef<number | null>(null);
  useEffect(() => () => { if (timer.current) window.clearTimeout(timer.current); }, []);

  const next = () => {
    setPhrase((p) => pickRandom(talkable, p));
    setSpeaking(true);
    if (timer.current) window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setSpeaking(false), SPEAK_MS);
  };
  const theme = themeById.get(phrase.theme);

  return (
    <div className="flex flex-col items-center text-center">
      <span className="rounded-pill bg-tint-butter-2 px-5 py-2.5 text-[17px] text-ink-2">{theme ? bi(theme.name) : t("everydayMiskito")}</span>
      <div className="mt-2"><Orb speaking={speaking} size={230} /></div>
      <p className="text-[19px] text-ink-2">{speaking ? t("speaking") : t("readyWhenYouAre")}</p>
      <div className="mt-5 min-h-[90px]">
        <p className="display-sm px-2">{phrase.mk}</p>
        {showMeaning && meanings(phrase.gloss).map((g, i) => (
          <p key={i} className={cn("mt-2 text-[20px]", i === 0 ? "text-ink-2" : "text-ink-3")}>{g}</p>
        ))}
      </div>
      <div className="mt-4 flex items-center gap-6">
        <button type="button" onClick={() => setShowMeaning((v) => !v)} aria-pressed={showMeaning} className="flex items-center gap-1.5 whitespace-nowrap text-[15px] font-medium text-ink">
          {showMeaning ? <MessageSquareText className="h-5 w-5" /> : <MessageSquare className="h-5 w-5" />}{t("meaning")}
        </button>
        <button type="button" onClick={next} className="flex items-center gap-1.5 whitespace-nowrap text-[15px] font-medium text-ink"><Sparkles className="h-5 w-5" />{t("nextPhrase")}</button>
        <Link href={`/words/${phrase.id}`} className="flex items-center gap-1.5 whitespace-nowrap text-[15px] font-medium text-ink"><BookOpen className="h-5 w-5" />{t("openWord")}</Link>
      </div>

      <section className="mt-10 w-full text-left">
        <Eyebrow>{t("conversations")}</Eyebrow>
        <h2 className="display-sm mt-3">{t("pickConversation")}</h2>
        <ul className="mt-4 flex flex-col gap-3">
          {dialogues.map((dl) => {
            const th = themeById.get(dl.theme);
            return (
              <li key={dl.id}>
                <Link href={`/talk?d=${dl.id}`} className="flex items-center justify-between rounded-card bg-surface px-6 py-5 shadow-soft transition-transform active:scale-[0.99]">
                  <span>
                    <span className="block text-[22px] font-semibold text-ink">{bi(dl.title)}</span>
                    <span className="block text-[15px] text-ink-2">{th ? bi(th.name) : ""} · {dl.turns.length} {t("replies")}</span>
                  </span>
                  <span className="rounded-pill bg-accent px-4 py-2 text-[15px] font-semibold text-white">{t("begin")}</span>
                </Link>
              </li>
            );
          })}
        </ul>
        <p className="mt-5 text-[15px] leading-snug text-ink-3">{t("voiceLater")}</p>
      </section>
    </div>
  );
}

/* ── A scripted dialogue on the orb ── */
function DialogueView({ dialogue }: { dialogue: Dialogue }) {
  const { t, bi, meanings } = useSettings();
  const router = useRouter();
  const [turn, setTurn] = useState(-1); // -1 intro, 0..n turns, n = outro
  const [speaking, setSpeaking] = useState(false);
  const [showMeaning, setShowMeaning] = useState(true);
  const [lastYou, setLastYou] = useState<Choice | null>(null);
  const [nudge, setNudge] = useState<Choice | null>(null);
  const [misses, setMisses] = useState(0);
  const timer = useRef<number | null>(null);
  const theme = themeById.get(dialogue.theme);
  const total = dialogue.turns.length;

  const speak = () => {
    setSpeaking(true);
    if (timer.current) window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setSpeaking(false), SPEAK_MS);
  };
  useEffect(() => () => { if (timer.current) window.clearTimeout(timer.current); }, []);

  const begin = () => { setTurn(0); speak(); };
  const choose = async (c: Choice) => {
    if (!c.ok) { setNudge(c); setMisses((m) => m + 1); return; }
    setNudge(null);
    setLastYou(c);
    const nextTurn = turn + 1;
    setTurn(nextTurn);
    speak();
    if (nextTurn === total) await rate(`dialogue:${dialogue.id}`, misses === 0 ? Rating.Good : Rating.Hard, false);
  };

  const current = turn >= 0 && turn < total ? dialogue.turns[turn] : null;
  const line = turn < 0 ? null : current ? { mk: current.bila, gloss: current.gloss } : dialogue.outro;

  return (
    <div className="flex flex-col items-center text-center">
      <span className="rounded-pill bg-tint-butter-2 px-5 py-2.5 text-[17px] text-ink-2">{bi(dialogue.title)}{theme ? ` · ${bi(theme.name)}` : ""}</span>
      <div className="mt-2"><Orb speaking={speaking} size={210} /></div>
      <p className="text-[17px] text-ink-2">{speaking ? t("speaking") : turn < 0 ? t("readyWhenYouAre") : turn < total ? t("yourTurn") : t("conversationDone")}</p>

      {turn < 0 && (
        <div className="mt-6 w-full">
          <p className="text-[20px] text-ink-2">{bi(dialogue.intro)}</p>
          <button type="button" onClick={begin} className="mt-6 w-full rounded-pill bg-accent px-6 py-4 text-[18px] font-semibold text-white">{t("begin")}</button>
        </div>
      )}

      {line && (
        <motion.div key={turn} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }} className="mt-5 w-full">
          <p className="display-sm px-2">{line.mk}</p>
          {showMeaning && meanings(line.gloss).map((g, i) => (
            <p key={i} className={cn("mt-2 text-[19px]", i === 0 ? "text-ink-2" : "text-ink-3")}>{g}</p>
          ))}
          {lastYou && (
            <p className="mt-4 text-[16px] text-ink-2"><span className="eyebrow mr-2 text-[12px]">{t("you")}</span>{lastYou.mk}</p>
          )}
        </motion.div>
      )}

      {current && (
        <div className="mt-6 w-full text-left">
          {nudge && (
            <div className="mb-3 rounded-card bg-tint-butter-2 px-5 py-4 text-[16px] text-ink-2">
              <span className="font-semibold text-ink">{nudge.mk}</span> · {nudge.note ? bi(nudge.note) : t("tryAgain")}
            </div>
          )}
          <ul className="flex flex-col gap-2">
            {current.choices.map((c) => (
              <li key={c.mk}>
                <button type="button" onClick={() => choose(c)} className={cn("w-full rounded-card px-5 py-4 text-left shadow-soft transition-transform active:scale-[0.99]", nudge === c ? "bg-surface-2" : "bg-surface")}>
                  <span className="block text-[20px] font-semibold text-ink">{c.mk}</span>
                  {showMeaning && <span className="block text-[15px] text-ink-2">{meanings(c.gloss)[0]}</span>}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {turn >= total && (
        <div className="mt-6 w-full">
          <p className="text-[17px] text-ink-2">{total} {t("replies")}{misses === 0 ? `, ${t("firstTry")}` : ""}</p>
          <div className="mt-4 flex flex-col gap-3">
            <button type="button" onClick={() => { setTurn(-1); setLastYou(null); setNudge(null); setMisses(0); }} className="rounded-pill bg-accent px-6 py-4 text-[18px] font-semibold text-white">{t("talkAgain")}</button>
            <Link href="/talk" className="rounded-pill bg-surface px-6 py-4 text-[18px] font-semibold text-ink shadow-soft">{t("moreConversations")}</Link>
          </div>
        </div>
      )}

      <div className="mt-8 flex items-center justify-center gap-8">
        <button type="button" onClick={() => setShowMeaning((v) => !v)} aria-pressed={showMeaning} className="flex flex-col items-center gap-2">
          <span className={cn("grid h-[64px] w-[64px] place-items-center rounded-full", showMeaning ? "bg-tint-butter-2 text-ink" : "bg-surface text-ink-2 shadow-soft")}>
            {showMeaning ? <MessageSquareText className="h-6 w-6" /> : <MessageSquare className="h-6 w-6" />}
          </span>
          <span className="text-[15px] text-ink-2">{t("meaning")}</span>
        </button>
        <span className="grid h-[96px] w-[96px] cursor-not-allowed place-items-center rounded-full bg-accent text-ink opacity-50" title={t("voiceLater")}><Mic className="h-9 w-9" strokeWidth={2.2} /></span>
        <button type="button" onClick={() => router.push("/talk")} className="flex flex-col items-center gap-2">
          <span className="grid h-[64px] w-[64px] place-items-center rounded-full bg-surface text-ink shadow-soft"><PhoneOff className="h-6 w-6" /></span>
          <span className="text-[15px] text-ink-2">{t("end")}</span>
        </button>
      </div>
    </div>
  );
}
