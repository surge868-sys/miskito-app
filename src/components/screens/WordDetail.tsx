"use client";

import { useState } from "react";
import Link from "next/link";
import { useLiveQuery } from "dexie-react-hooks";
import { Check, CircleDashed } from "lucide-react";
import { db } from "@/lib/db";
import { useSettings } from "@/lib/settings";
import { levelFor, rate, Rating, type Grade } from "@/lib/srs";
import { levelKey } from "@/lib/levels";
import { relativeDay } from "@/lib/format";
import { themeById } from "@/data/themes";
import type { Entry } from "@/lib/types";
import { BackLink } from "@/components/BackLink";
import { StrengthBars } from "@/components/StrengthBars";
import { cn } from "@/lib/cn";

export function WordDetail({ entry }: { entry: Entry }) {
  const { t, bi, meanings, lang } = useSettings();
  const rec = useLiveQuery(() => db.reviews.get(entry.id), [entry.id]);
  const level = levelFor(rec);
  const theme = themeById.get(entry.theme);
  const [rated, setRated] = useState<Grade | null>(null);

  const onRate = async (g: Grade) => {
    await rate(entry.id, g, false);
    setRated(g);
  };

  const kindLabel =
    entry.kind === "pattern" ? t("patterns") : entry.kind === "phrase" ? (lang === "es" ? "Frase" : "Phrase") : lang === "es" ? "Palabra" : "Word";

  return (
    <div>
      <BackLink href={theme ? `/words?theme=${theme.id}` : "/words"} />

      <section className="mt-8">
        <div className="eyebrow">
          {theme ? bi(theme.name) : ""} · {kindLabel}
        </div>
        <h1 className="display mt-4 break-words">{entry.mk}</h1>
        {meanings(entry.gloss).map((g, i) => (
          <p key={i} className={cn("mt-3 text-[22px] leading-snug", i === 0 ? "text-ink-2" : "text-ink-3")}>
            {g}
          </p>
        ))}
      </section>

      {(entry.loan || entry.variants?.length) && (
        <div className="mt-5 flex flex-wrap gap-2">
          {entry.loan && (
            <span className="rounded-pill bg-tint-butter px-4 py-2 text-[15px] font-medium text-ink">
              {t("borrowedFrom")} {t(entry.loan === "en" ? "english" : "spanish")}
            </span>
          )}
          {entry.variants?.length ? (
            <span className="rounded-pill bg-surface px-4 py-2 text-[15px] text-ink-2 shadow-soft">
              {t("alsoWritten")}: {entry.variants.join(", ")}
            </span>
          ) : null}
        </div>
      )}

      {entry.note && <p className="mt-6 text-[19px] leading-snug text-ink-2">{bi(entry.note)}</p>}

      {entry.paradigm && (
        <section className="mt-8 rounded-card bg-surface p-6 shadow-soft">
          <div className="eyebrow">{t("forms")}</div>
          <dl className="mt-3 divide-y divide-line">
            {entry.paradigm.map((row) => (
              <div key={row.form} className="flex items-baseline justify-between gap-4 py-3">
                <dt className="text-[22px] font-semibold text-ink">{row.form}</dt>
                <dd className="text-right text-[17px] text-ink-2">{bi(row.label)}</dd>
              </div>
            ))}
          </dl>
        </section>
      )}

      {entry.kind !== "pattern" && (
        <section className="mt-8 rounded-card bg-surface p-6 shadow-soft">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="eyebrow">{t("practiceEyebrow")}</div>
              <p className="mt-2 text-[17px] text-ink-2">
                {t("lastPracticed")}: {relativeDay(rec?.last_review, lang, t("never"))}
              </p>
            </div>
            <StrengthBars level={level} label={t(levelKey[level])} size="lg" />
          </div>

          <p className="mt-6 text-[19px] font-medium text-ink">{t("howDidItGo")}</p>
          <div className="mt-3 grid grid-cols-3 gap-2">
            <RateButton onClick={() => onRate(Rating.Again)} active={rated === Rating.Again} tone="soft">
              {t("rateAgain")}
            </RateButton>
            <RateButton onClick={() => onRate(Rating.Hard)} active={rated === Rating.Hard} tone="butter">
              {t("rateHard")}
            </RateButton>
            <RateButton onClick={() => onRate(Rating.Good)} active={rated === Rating.Good} tone="accent">
              {t("rateGood")}
            </RateButton>
          </div>
        </section>
      )}

      <p className="mt-8 flex items-center gap-2 text-[15px] text-ink-3">
        {entry.verified ? <Check className="h-4 w-4" /> : <CircleDashed className="h-4 w-4" />}
        {entry.verified ? t("verifiedNotice") : t("draftNotice")}
        {entry.source?.startsWith("by ") && ` · Bila Yumhpa ${entry.source.slice(3)}`}
      </p>

      {theme && (
        <p className="mt-2 text-[15px] text-ink-3">
          {t("theme")}:{" "}
          <Link href={`/words?theme=${theme.id}`} className="underline decoration-line underline-offset-4">
            {bi(theme.name)}
          </Link>
        </p>
      )}
    </div>
  );
}

export function RateButton({
  children,
  onClick,
  active,
  tone,
}: {
  children: React.ReactNode;
  onClick: () => void;
  active?: boolean;
  tone: "soft" | "butter" | "accent";
}) {
  const tones = {
    soft: "bg-surface-2 text-ink",
    butter: "bg-tint-butter text-ink",
    accent: "bg-accent text-white",
  };
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-pill px-3 py-3.5 text-[16px] font-semibold transition-transform active:scale-95",
        tones[tone],
        active && "ring-2 ring-ink/40",
      )}
    >
      {children}
    </button>
  );
}
