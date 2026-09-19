"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowUpRight, AudioLines } from "lucide-react";
import { useSettings } from "@/lib/settings";
import { normalise } from "@/lib/phrasebook";
import { themeGroups, themes } from "@/data/themes";
import { SearchField } from "@/components/SearchField";
import { Chips } from "@/components/Chips";
import { PageTitle } from "@/components/Section";
import { ThemeCard } from "@/components/ThemeCard";

export function ThemesScreen() {
  const { t, bi } = useSettings();
  const [query, setQuery] = useState("");
  const [group, setGroup] = useState("all");

  const visible = useMemo(() => {
    const q = normalise(query);
    return themes.filter(
      (th) =>
        (group === "all" || th.group === group) &&
        (!q || normalise(`${th.name.en} ${th.name.es} ${th.tagline.en} ${th.tagline.es}`).includes(q)),
    );
  }, [query, group]);

  return (
    <div>
      <SearchField value={query} onChange={setQuery} placeholder={t("findConversation")} />

      <PageTitle eyebrow={t("themesEyebrow")} title={t("themesTitle")} subtitle={t("themesSubtitle")} />

      <Link
        href="/talk"
        className="mt-7 flex items-center justify-between rounded-card bg-surface px-6 py-6 shadow-soft transition-transform active:scale-[0.99]"
      >
        <span className="flex items-center gap-3 text-[24px] font-semibold text-ink">
          <AudioLines className="h-6 w-6" strokeWidth={2.2} />
          {t("justTalk")}
        </span>
        <ArrowUpRight className="h-7 w-7 text-ink" strokeWidth={2.2} />
      </Link>

      <div className="mt-6">
        <Chips items={themeGroups.map((g) => ({ id: g.id, label: bi(g.name) }))} value={group} onChange={setGroup} />
      </div>

      <div className="mt-4 grid grid-cols-2 gap-4">
        {visible.map((th) => (
          <ThemeCard key={th.id} theme={th} />
        ))}
      </div>
      {visible.length === 0 && <p className="mt-8 text-[19px] text-ink-2">{t("noResults")}</p>}
    </div>
  );
}
