import type { Metadata } from "next";
import { Suspense } from "react";
import { WordsScreen } from "@/components/screens/WordsScreen";

export const metadata: Metadata = { title: "Words" };

export default function WordsPage() {
  return (
    <Suspense fallback={null}>
      <WordsScreen />
    </Suspense>
  );
}
