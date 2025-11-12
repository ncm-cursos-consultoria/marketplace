import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Layers } from "lucide-react";
import Image from "next/image";
import { Module } from "./module-components";

export function ModuleHero({ module }: { module: Module }) {
  return (
    <div className="overflow-hidden rounded-2xl border bg-white shadow-sm">
      <div className="relative h-44 w-full bg-muted">
        {module.coverUrl ? (
          <Image
            src={module.coverUrl}
            alt={module.title}
            fill
            className="object-cover"
            sizes="100vw"
          />
        ) : (
          <div className="absolute inset-0 grid place-items-center text-muted-foreground">
            <Layers className="h-10 w-10 opacity-60" />
          </div>
        )}
      </div>
      <div className="grid gap-3 p-5 sm:grid-cols-[1fr_auto] sm:items-center">
        <div>
          <h2 className="text-xl font-semibold leading-tight">{module.title}</h2>
          {module.description && (
            <p className="mt-1 max-w-3xl text-sm text-muted-foreground">{module.description}</p>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary">{module.coursesCount ?? 0} aula(s)</Badge>
          <Button variant="outline" size="sm" onClick={() => {}}>
            Editar módulo
          </Button>
        </div>
      </div>
    </div>
  )
}