"use client";

import Link from "next/link";
import { SlidersHorizontal } from "lucide-react";
import { useSettings } from "@/lib/settings";

export function Header() {
  const { t } = useSettings();
  return (
    <header className="flex items-center justify-between pt-2 pb-5">
      <Link href="/themes" className="flex items-center gap-3" aria-label={t("appName")}>
        <span
          aria-hidden
          className="h-4 w-4 rounded-full"
          style={{ background: "radial-gradient(circle at 30% 30%, #ffd08a, #ff8a4c)" }}
        />
        <span className="text-[30px] font-bold tracking-tight text-ink">{t("appName")}</span>
      </Link>
      <Link
        href="/settings"
        aria-label={t("settings")}
        className="grid h-12 w-12 place-items-center rounded-full bg-surface text-ink shadow-soft"
      >
        <SlidersHorizontal className="h-5 w-5" strokeWidth={2.2} />
      </Link>
    </header>
  );
}
