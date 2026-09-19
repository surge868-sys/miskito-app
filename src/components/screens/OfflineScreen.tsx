"use client";

import { useSettings } from "@/lib/settings";
import { PageTitle } from "@/components/Section";

export function OfflineScreen() {
  const { t } = useSettings();
  return <PageTitle eyebrow={t("appName")} title={t("offlineTitle")} subtitle={t("offlineText")} />;
}
