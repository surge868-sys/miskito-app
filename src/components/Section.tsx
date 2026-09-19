export function Eyebrow({ children }: { children: React.ReactNode }) {
  return <div className="eyebrow">{children}</div>;
}

export function PageTitle({ eyebrow, title, subtitle }: { eyebrow: string; title: string; subtitle?: string }) {
  return (
    <section className="mt-9">
      <Eyebrow>{eyebrow}</Eyebrow>
      <h1 className="display mt-4">{title}</h1>
      {subtitle && <p className="mt-4 text-[20px] leading-snug text-ink-2">{subtitle}</p>}
    </section>
  );
}
