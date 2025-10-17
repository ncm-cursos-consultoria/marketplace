export function Section({
  title,
  children,
  badge,
}: {
  title: string;
  children: React.ReactNode;
  badge?: string;
}) {
  return (
    <section className="space-y-4">
      <h2 className="text-xl font-semibold">{title}</h2>
      <article className="rounded-2xl border bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between">
          <div />
          {badge ? (
            <span className="text-[10px] leading-5 rounded-full border px-2 py-0.5 text-blue-700 bg-blue-50">{badge}</span>
          ) : null}
        </div>
        <div className="mt-2 space-y-2">{children}</div>
      </article>
    </section>
  );
}