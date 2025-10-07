export function StatCard({
  title,
  value,
  icon,
  helper,
  progressPercent,
}: {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  helper?: string;
  progressPercent?: number; // 0-100
}) {
  const pct =
    typeof progressPercent === "number"
      ? Math.max(0, Math.min(100, Math.round(progressPercent)))
      : undefined;

  return (
    <div className="flex w-full flex-col gap-3 rounded-2xl border bg-white p-4 shadow-sm transition hover:shadow-md">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-neutral-600">{title}</span>
        <div className="grid h-9 w-9 place-items-center rounded-xl bg-neutral-100">
          {icon}
        </div>
      </div>

      <div className="text-3xl font-semibold tracking-tight">{value}</div>

      {helper ? <p className="text-xs text-neutral-500">{helper}</p> : null}

      {typeof pct === "number" ? (
        <div>
          <div className="h-2 w-full rounded-full bg-neutral-200">
            <div
              className="h-2 rounded-full bg-blue-600"
              style={{ width: `${pct}%` }}
              role="progressbar"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={pct}
            />
          </div>
          <div className="mt-1 text-xs text-neutral-600">{pct}%</div>
        </div>
      ) : null}
    </div>
  );
}
