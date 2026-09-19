import type { Lang } from "./types";

export function relativeDay(date: Date | undefined, lang: Lang, never: string): string {
  if (!date) return never;
  const days = Math.round((Date.now() - date.getTime()) / 86_400_000);
  const rtf = new Intl.RelativeTimeFormat(lang, { numeric: "auto" });
  if (Math.abs(days) < 30) return rtf.format(-days, "day");
  return new Intl.DateTimeFormat(lang, { month: "short", day: "numeric" }).format(date);
}
