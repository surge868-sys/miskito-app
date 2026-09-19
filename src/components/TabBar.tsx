"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AudioLines, BookOpen, LayoutGrid } from "lucide-react";
import { useSettings } from "@/lib/settings";
import { cn } from "@/lib/cn";
import type { StringKey } from "@/lib/i18n";

const tabs: { href: string; key: StringKey; Icon: typeof AudioLines; also: string[] }[] = [
  { href: "/talk", key: "tabTalk", Icon: AudioLines, also: [] },
  { href: "/themes", key: "tabThemes", Icon: LayoutGrid, also: ["/"] },
  { href: "/words", key: "tabWords", Icon: BookOpen, also: ["/practice"] },
];

export function TabBar() {
  const pathname = usePathname();
  const { t } = useSettings();
  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-40 flex justify-center px-4"
      style={{ paddingBottom: "calc(var(--safe-bottom) + 12px)" }}
    >
      <div className="flex w-full max-w-[400px] items-center gap-1 rounded-pill bg-surface/85 p-1.5 shadow-float backdrop-blur-xl">
        {tabs.map(({ href, key, Icon, also }) => {
          const active = [href, ...also].some((p) => pathname === p || pathname.startsWith(p + "/"));
          return (
            <Link
              key={href}
              href={href}
              aria-current={active ? "page" : undefined}
              className={cn(
                "flex flex-1 flex-col items-center gap-1 rounded-pill py-2.5 text-[13px] font-semibold text-ink transition-colors",
                active ? "bg-surface-3" : "hover:bg-surface-2",
              )}
            >
              <Icon className="h-6 w-6" strokeWidth={2.2} />
              {t(key)}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
