import type { Metadata } from "next";
import { Suspense } from "react";
import { TalkScreen } from "@/components/screens/TalkScreen";

export const metadata: Metadata = { title: "Talk" };

export default function TalkPage() {
  return (
    <Suspense fallback={null}>
      <TalkScreen />
    </Suspense>
  );
}
