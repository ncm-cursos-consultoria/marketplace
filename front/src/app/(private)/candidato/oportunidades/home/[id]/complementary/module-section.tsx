import { getAllModules } from "@/service/module/get-all-modules";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import { Layers, BookOpen, PlayCircle } from "lucide-react";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import ncm from "@/assets/logo-ncm-horizontal.svg"

type Module = {
  id: string;
  title: string;
  description?: string | null;
  coverUrl?: string | null;      // URL da thumb/capa (opcional)
  coursesCount?: number | null;  // Quantidade de aulas/cursos dentro do módulo (opcional)
  level?: "Básico" | "Intermediário" | "Avançado" | string | null; // opcional
};

function ModuleCard({ mod }: { mod: Module }) {
  return (
    <Card className="overflow-hidden rounded-2xl shadow-sm hover:shadow-md transition">
      <div className="relative h-36 w-full bg-muted p-10">
          <Image
            src={ncm}
            alt={mod.title}
            fill
            className=""
            sizes="(max-width: 768px) 100vw, 33vw"
            priority={false}
          />
      </div>

      <CardHeader className="pb-2">
        <h3 className="text-base font-semibold line-clamp-2">{mod.title}</h3>
        {mod.level ? <Badge variant="secondary" className="w-fit">{mod.level}</Badge> : null}
      </CardHeader>

      <CardContent className="pt-0">
        {mod.description ? (
          <p className="text-sm text-muted-foreground line-clamp-3">{mod.description}</p>
        ) : (
          <p className="text-sm text-muted-foreground italic">Sem descrição.</p>
        )}
      </CardContent>

      <CardFooter className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-3 text-sm text-muted-foreground">
          <span className="inline-flex items-center gap-1">
            <Layers className="h-4 w-4" />
            Módulo
          </span>
          {typeof mod.coursesCount === "number" && (
            <span className="inline-flex items-center gap-1">
              <BookOpen className="h-4 w-4" />
              {mod.coursesCount} aulas
            </span>
          )}
        </div>

        <Button asChild size="sm">
          {/* Ajuste a rota conforme sua app (ex.: /modules/[id] ou /enterprise/modules/[id]) */}
          <Link href={`/candidato/oportunidades/modulo/${mod.id}`}>Ver conteúdo</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}

function ModuleSkeletonCard() {
  return (
    <Card className="overflow-hidden rounded-2xl">
      <div className="relative h-36 w-full">
        <Skeleton className="h-full w-full" />
      </div>
      <CardHeader className="pb-2">
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-6 w-20 mt-2" />
      </CardHeader>
      <CardContent className="pt-0">
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-5/6 mb-2" />
        <Skeleton className="h-4 w-3/4" />
      </CardContent>
      <CardFooter className="flex items-center justify-between">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-9 w-24" />
      </CardFooter>
    </Card>
  );
}

export function ModuleSection() {
  const { data: modules, isPending, isError } = useQuery<Module[]>({
    queryKey: ["module"],
    queryFn: () => getAllModules(),
    staleTime: 1000 * 60 * 5,
  });

  return (
    <section>
      <h2 className="text-2xl font-semibold mb-6">Cursos disponíveis</h2>

      {isError && (
        <div className="rounded-lg border p-4 text-sm text-red-600 bg-red-50">
          Oops! Não foi possível carregar os módulos agora.
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {isPending &&
          Array.from({ length: 6 }).map((_, i) => <ModuleSkeletonCard key={i} />)}

        {!isPending && Array.isArray(modules) && modules.length > 0 && (
          modules.map((m) => <ModuleCard key={m.id} mod={m} />)
        )}

        {!isPending && (!modules || modules.length === 0) && (
          <div className="col-span-full text-sm text-muted-foreground">
            Nenhum módulo disponível no momento.
          </div>
        )}
      </div>
    </section>
  );
}
