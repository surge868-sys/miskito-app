import { cn } from "@/lib/cn";
import type { Level } from "@/lib/types";

export function StrengthBars({ level, label, size = "md" }: { level: Level; label?: string; size?: "md" | "lg" }) {
  return (
    <div className="flex shrink-0 flex-col items-end gap-1.5">
      <div className="flex gap-1.5" role="img" aria-label={label}>
        {[1, 2, 3].map((i) => (
          <span
            key={i}
            className={cn(
              "rounded-pill",
              size === "lg" ? "h-3 w-12" : "h-2.5 w-9",
              i <= level ? "bg-accent" : "bg-accent-soft",
            )}
          />
        ))}
      </div>
      {label && <span className={cn("text-ink-2", size === "lg" ? "text-[19px]" : "text-[17px]")}>{label}</span>}
    </div>
  );
}
