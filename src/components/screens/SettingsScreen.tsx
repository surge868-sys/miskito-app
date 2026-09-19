"use client";

import { useRef, useState } from "react";
import { useLiveQuery } from "dexie-react-hooks";
import { Download, Trash2, Upload } from "lucide-react";
import { db } from "@/lib/db";
import { useSettings } from "@/lib/settings";
import { exportProgress, importProgress, levelFor, resetProgress } from "@/lib/srs";
import type { ExplainIn } from "@/lib/types";
import { BackLink } from "@/components/BackLink";
import { Eyebrow } from "@/components/Section";
import { cn } from "@/lib/cn";

const options: { id: ExplainIn; label: string }[] = [
  { id: "en", label: "English" },
  { id: "es", label: "Español" },
  { id: "both", label: "" },
];

export function SettingsScreen() {
  const { t, settings, setExplainIn } = useSettings();
  const reviews = useLiveQuery(() => db.reviews.toArray(), []);
  const met = reviews?.length ?? 0;
  const steady = reviews?.filter((r) => levelFor(r) === 3).length ?? 0;
  const [message, setMessage] = useState<string | null>(null);
  const fileInput = useRef<HTMLInputElement>(null);

  const onExport = async () => {
    const data = await exportProgress();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `bila-progress-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const onImport = async (file: File | undefined) => {
    if (!file) return;
    try {
      const n = await importProgress(JSON.parse(await file.text()));
      setMessage(`${t("imported")} (${n})`);
    } catch {
      setMessage(t("importFailed"));
    }
  };

  const onReset = async () => {
    if (!window.confirm(t("resetConfirm"))) return;
    await resetProgress();
    setMessage(null);
  };

  return (
    <div>
      <BackLink href="/words" />
      <h1 className="display mt-6">{t("settings")}</h1>

      <section className="mt-10">
        <Eyebrow>{t("explainIn")}</Eyebrow>
        <div className="mt-3 flex gap-1 rounded-pill bg-surface p-1.5 shadow-soft">
          {options.map((o) => {
            const active = settings.explainIn === o.id;
            return (
              <button
                key={o.id}
                type="button"
                onClick={() => setExplainIn(o.id)}
                aria-pressed={active}
                className={cn(
                  "flex-1 rounded-pill py-3 text-[17px] font-medium transition-colors",
                  active ? "bg-tint-peach text-ink" : "text-ink-2",
                )}
              >
                {o.label || t("both")}
              </button>
            );
          })}
        </div>
        <p className="mt-3 text-[17px] text-ink-2">{t("explainHint")}</p>
      </section>

      <section className="mt-10">
        <Eyebrow>{t("spelling")}</Eyebrow>
        <p className="mt-3 text-[17px] leading-snug text-ink-2">{t("spellingNote")}</p>
      </section>

      <section className="mt-10">
        <Eyebrow>{t("progress")}</Eyebrow>
        <div className="mt-3 grid grid-cols-2 gap-3">
          <div className="rounded-card bg-surface p-5 shadow-soft">
            <div className="text-[32px] font-bold text-ink">{met}</div>
            <div className="text-[15px] text-ink-2">{t("wordsMet")}</div>
          </div>
          <div className="rounded-card bg-surface p-5 shadow-soft">
            <div className="text-[32px] font-bold text-ink">{steady}</div>
            <div className="text-[15px] text-ink-2">{t("steadyWords")}</div>
          </div>
        </div>
        <div className="mt-4 flex flex-col gap-2">
          <SettingsButton onClick={onExport} icon={<Download className="h-5 w-5" />}>
            {t("exportProgress")}
          </SettingsButton>
          <SettingsButton onClick={() => fileInput.current?.click()} icon={<Upload className="h-5 w-5" />}>
            {t("importProgress")}
          </SettingsButton>
          <input
            ref={fileInput}
            type="file"
            accept="application/json"
            className="hidden"
            onChange={(e) => onImport(e.target.files?.[0])}
          />
          <SettingsButton onClick={onReset} icon={<Trash2 className="h-5 w-5" />} danger>
            {t("resetProgress")}
          </SettingsButton>
        </div>
        {message && <p className="mt-3 text-[17px] text-ink-2">{message}</p>}
      </section>

      <section className="mt-10">
        <Eyebrow>{t("about")}</Eyebrow>
        <p className="mt-3 text-[17px] leading-snug text-ink-2">{t("aboutText")}</p>
      </section>
    </div>
  );
}

function SettingsButton({
  children,
  onClick,
  icon,
  danger,
}: {
  children: React.ReactNode;
  onClick: () => void;
  icon: React.ReactNode;
  danger?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex items-center gap-3 rounded-pill bg-surface px-5 py-4 text-left text-[17px] font-medium shadow-soft",
        danger ? "text-ink-2" : "text-ink",
      )}
    >
      {icon}
      {children}
    </button>
  );
}
