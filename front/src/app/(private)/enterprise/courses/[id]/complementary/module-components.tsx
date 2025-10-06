import { Badge } from "@/components/ui/badge"
import { BookOpen, Layers, PlayCircle } from "lucide-react"
import Image from "next/image"

export type Module = {
  id: string
  title: string
  description?: string
  coverUrl?: string
  coursesCount?: number
}

export function ModuleCard({ module, onOpen }: { module: Module; onOpen: () => void }) {
  return (
    <button
      onClick={onOpen}
      className="group flex w-full flex-col overflow-hidden rounded-2xl border bg-white text-left shadow-sm transition hover:shadow-md focus:outline-none"
    >
      <div className="relative h-40 w-full bg-muted">
        {module.coverUrl ? (
          <Image
            src={module.coverUrl}
            alt={module.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
        ) : (
          <div className="absolute inset-0 grid place-items-center text-muted-foreground">
            <Layers className="h-10 w-10 opacity-60" />
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-2 p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="line-clamp-1 text-base font-semibold">{module.title}</h3>
          <Badge variant="secondary" className="whitespace-nowrap">
            {module.coursesCount ?? 0} curso(s)
          </Badge>
        </div>
        {module.description ? (
          <p className="line-clamp-2 text-sm text-muted-foreground">{module.description}</p>
        ) : (
          <p className="text-sm text-muted-foreground">&nbsp;</p>
        )}

        <div className="mt-auto flex items-center justify-between pt-2 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1">
            <BookOpen className="h-4 w-4" />
            Ver cursos
          </span>
          <span className="inline-flex items-center gap-1 opacity-0 transition group-hover:opacity-100">
            <PlayCircle className="h-4 w-4" /> Abrir
          </span>
        </div>
      </div>
    </button>
  )
}