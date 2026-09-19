"use client";

import { Search } from "lucide-react";

type Props = {
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
};

export function SearchField({ value, onChange, placeholder }: Props) {
  return (
    <label className="flex items-center gap-3 rounded-pill bg-surface px-5 py-4 shadow-soft">
      <Search className="h-6 w-6 shrink-0 text-ink" strokeWidth={2.2} />
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-transparent text-[20px] text-ink outline-none placeholder:text-ink-2"
        autoComplete="off"
        spellCheck={false}
      />
    </label>
  );
}
