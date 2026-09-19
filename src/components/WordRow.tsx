"use client";

import Link from "next/link";
import { useSettings } from "@/lib/settings";
import { levelFor } from "@/lib/srs";
import { levelKey } from "@/lib/levels";
import type { ReviewRecord } from "@/lib/db";
import type { Entry } from "@/lib/types";
import { StrengthBars } from "./StrengthBars";
import { cn } from "@/lib/cn";

export function WordRow({ entry, rec }: { entry: Entry; rec?: ReviewRecord }) {
  const { meanings, t } = useSettings();
  const level = levelFor(rec);
  return (
    <li className="border-b border-line">
      <Link href={`/words/${entry.id}`} className="flex items-start justify-between gap-4 py-6">
        <div className="min-w-0">
          <div className="text-[28px] font-semibold leading-tight tracking-tight text-ink">{entry.mk}</div>
          {meanings(entry.gloss).map((g, i) => (
            <div key={i} className={cn("mt-1 text-[19px] leading-snug", i === 0 ? "text-ink-2" : "text-ink-3")}>
              {g}
            </div>
          ))}
        </div>
        <StrengthBars level={level} label={t(levelKey[level])} />
      </Link>
    </li>
  );
}

export function PatternRow({ entry }: { entry: Entry }) {
  const { meanings } = useSettings();
  const preview = entry.paradigm?.slice(0, 3).map((p) => p.form).join(" · ");
  return (
    <li className="border-b border-line">
      <Link href={`/words/${entry.id}`} className="block py-6">
        <div className="text-[24px] font-semibold leading-tight tracking-tight text-ink">{entry.mk}</div>
        {meanings(entry.gloss).map((g, i) => (
          <div key={i} className={cn("mt-1 text-[18px] leading-snug", i === 0 ? "text-ink-2" : "text-ink-3")}>
            {g}
          </div>
        ))}
        {preview && <div className="mt-2 text-[15px] text-ink-3">{preview} …</div>}
      </Link>
    </li>
  );
}
