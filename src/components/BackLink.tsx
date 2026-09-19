"use client";

import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { useSettings } from "@/lib/settings";

export function BackLink({ href }: { href: string }) {
  const { t } = useSettings();
  return (
    <Link href={href} className="inline-flex items-center gap-1 text-[17px] font-medium text-ink-2">
      <ChevronLeft className="h-5 w-5" />
      {t("back")}
    </Link>
  );
}
