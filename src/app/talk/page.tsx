import type { Metadata } from "next";
import { TalkScreen } from "@/components/screens/TalkScreen";

export const metadata: Metadata = { title: "Talk" };

export default function TalkPage() {
  return <TalkScreen />;
}
