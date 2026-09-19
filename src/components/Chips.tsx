"use client";

import { cn } from "@/lib/cn";

type Item = { id: string; label: string };

export function Chips({ items, value, onChange }: { items: Item[]; value: string; onChange: (id: string) => void }) {
  return (
    <div className="hide-scrollbar -mx-5 flex gap-2 overflow-x-auto px-5 py-1">
      {items.map((it) => {
        const active = it.id === value;
        return (
          <button
            key={it.id}
            type="button"
            onClick={() => onChange(it.id)}
            aria-pressed={active}
            className={cn(
              "shrink-0 rounded-pill px-5 py-3 text-[17px] transition-colors",
              active ? "bg-tint-peach font-medium text-ink" : "bg-surface text-ink-2",
            )}
          >
            {it.label}
          </button>
        );
      })}
    </div>
  );
}
