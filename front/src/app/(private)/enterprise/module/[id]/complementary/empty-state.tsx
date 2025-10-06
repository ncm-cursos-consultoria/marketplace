import { Layers } from "lucide-react";

export function EmptyState({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="w-full rounded-2xl border bg-white/50 p-10 text-center">
      <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full border">
        <Layers className="h-5 w-5" />
      </div>
      <h3 className="text-lg font-semibold">{title}</h3>
      {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
    </div>
  )
}