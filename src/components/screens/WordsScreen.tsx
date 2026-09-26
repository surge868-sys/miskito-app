"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useLiveQuery } from "dexie-react-hooks";
import { ArrowUpRight, MessageSquareQuote, RotateCcw } from "lucide-react";
import { db } from "@/lib/db";
import { useSettings } from "@/lib/settings";
import { isDue } from "@/lib/srs";
import { frames } from "@/data/frames";
import { searchEntries, words } from "@/lib/phrasebook";
import { themes, themeById } from "@/data/themes";
import { SearchField } from "@/components/SearchField";
import { Chips } from "@/components/Chips";
import { PageTitle } from "@/components/Section";
import { PatternRow, WordRow } from "@/components/WordRow";

export function WordsScreen() {
  const { t, bi } = useSettings();
  const router = useRouter();
  const params = useSearchParams();
  const themeParam = params.get("theme");
  const theme = themeParam && themeById.has(themeParam) ? themeParam : null;
  const [query, setQuery] = useState("");

  const reviews = useLiveQuery(() => db.reviews.toArray(), []);
  const recMap = useMemo(() => new Map((reviews ?? []).map((r) => [r.id, r])), [reviews]);

  const results = useMemo(() => searchEntries(query, theme), [query, theme]);
  const wordResults = results.filter((e) => e.kind !== "pattern");
  const patternResults = results.filter((e) => e.kind === "pattern");

  const readyCount = useMemo(() => {
    if (!reviews) return 0;
    return words.filter((e) => {
      const r = recMap.get(e.id);
      return !r || isDue(r);
    }).length;
  }, [reviews, recMap]);

  const sentenceReady = useMemo(() => {
    if (!reviews) return 0;
    return frames.filter((f) => {
      const r = recMap.get(f.kind === "fill" ? `frame:${f.id}` : `ending:${f.id}`);
      return !r || isDue(r);
    }).length;
  }, [reviews, recMap]);

  const chips = [{ id: "all", label: t("all") }, ...themes.map((th) => ({ id: th.id, label: bi(th.name) }))];

  const onChip = (id: string) => {
    const next = id === "all" ? null : id;
    router.replace(next ? `/words?theme=${next}` : "/words", { scroll: false });
  };

  const eyebrow = theme ? `${bi(themeById.get(theme)!.name)} · Miskito` : t("wordsEyebrow");

  return (
    <div>
      <SearchField value={query} onChange={setQuery} placeholder={t("findWord")} />

      <PageTitle eyebrow={eyebrow} title={t("wordsTitle")} subtitle={t("wordsSubtitle")} />

      <Link
        href="/practice"
        className="mt-7 flex items-center justify-between rounded-card bg-surface px-6 py-5 shadow-soft transition-transform active:scale-[0.99]"
      >
        <span className="flex items-center gap-3 text-[22px] font-semibold text-ink">
          <RotateCcw className="h-6 w-6" strokeWidth={2.2} />
          {t("practice")}
        </span>
        <span className="flex items-center gap-3 text-[17px] text-ink-2">
          {readyCount > 0 ? `${readyCount} ${t("ready")}` : t("allCaughtUp")}
          <ArrowUpRight className="h-6 w-6 text-ink" strokeWidth={2.2} />
        </span>
      </Link>

      <Link
        href="/practice/sentences"
        className="mt-3 flex items-center justify-between rounded-card bg-surface px-6 py-5 shadow-soft transition-transform active:scale-[0.99]"
      >
        <span className="flex items-center gap-3 text-[22px] font-semibold text-ink">
          <MessageSquareQuote className="h-6 w-6" strokeWidth={2.2} />
          {t("sentences")}
        </span>
        <span className="flex items-center gap-3 text-[17px] text-ink-2">
          {sentenceReady > 0 ? `${sentenceReady} ${t("ready")}` : t("allCaughtUp")}
          <ArrowUpRight className="h-6 w-6 text-ink" strokeWidth={2.2} />
        </span>
      </Link>

      <div className="mt-6">
        <Chips items={chips} value={theme ?? "all"} onChange={onChip} />
      </div>

      {wordResults.length === 0 && patternResults.length === 0 && (
        <p className="mt-10 text-[19px] text-ink-2">{t("noResults")}</p>
      )}

      {wordResults.length > 0 && (
        <ul className="mt-2">
          {wordResults.map((e) => (
            <WordRow key={e.id} entry={e} rec={recMap.get(e.id)} />
          ))}
        </ul>
      )}

      {patternResults.length > 0 && (
        <section className="mt-12">
          <h2 className="display-sm">{t("patterns")}</h2>
          <p className="mt-2 text-[19px] text-ink-2">{t("patternsHint")}</p>
          <ul className="mt-2">
            {patternResults.map((e) => (
              <PatternRow key={e.id} entry={e} />
            ))}
          </ul>
        </section>
      )}

      <div className="mt-8 flex justify-between text-[17px] text-ink-2">
        <span>1 · {t("levelFragile")}</span>
        <span>2 · {t("levelGrowing")}</span>
        <span>3 · {t("levelSteady")}</span>
      </div>
      <p className="mt-5 text-[17px] leading-snug text-ink-2">{t("barsFootnote")}</p>
    </div>
  );
}
