import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { entryById, phrasebook } from "@/data/phrasebook";
import { WordDetail } from "@/components/screens/WordDetail";

type Params = Promise<{ id: string }>;

export const dynamicParams = false;

export function generateStaticParams() {
  return phrasebook.map((e) => ({ id: e.id }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { id } = await params;
  return { title: entryById.get(id)?.mk ?? "Word" };
}

export default async function WordPage({ params }: { params: Params }) {
  const { id } = await params;
  const entry = entryById.get(id);
  if (!entry) notFound();
  return <WordDetail entry={entry} />;
}
