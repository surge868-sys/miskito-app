"use client";

import Link from "next/link";
import { useSettings } from "@/lib/settings";
import type { Theme, Tint } from "@/lib/types";
import { ThemeIcon } from "./ThemeIcon";
import { cn } from "@/lib/cn";

export const tintClass: Record<Tint, string> = {
  peach: "bg-tint-peach",
  lavender: "bg-tint-lavender",
  sage: "bg-tint-sage",
  butter: "bg-tint-butter",
};

export function ThemeCard({ theme }: { theme: Theme }) {
  const { bi } = useSettings();
  return (
    <Link
      href={`/words?theme=${theme.id}`}
      className={cn("flex min-h-[210px] flex-col justify-between rounded-card p-6 transition-transform active:scale-[0.98]", tintClass[theme.tint])}
    >
      <ThemeIcon name={theme.icon} className="h-10 w-10 text-ink" strokeWidth={1.6} />
      <div>
        <div className="text-[24px] font-semibold leading-tight tracking-tight text-ink">{bi(theme.name)}</div>
        <div className="mt-1 text-[17px] leading-snug text-ink-2">{bi(theme.tagline)}</div>
      </div>
    </Link>
  );
}
