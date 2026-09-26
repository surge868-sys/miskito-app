import type { Metadata } from "next";
import { SentencesScreen } from "@/components/screens/SentencesScreen";

export const metadata: Metadata = { title: "Sentences" };

export default function SentencesPage() {
  return <SentencesScreen />;
}
