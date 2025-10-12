"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { getModules } from "@/service/module/get-modules-enterprise";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Layers, PlayCircle } from "lucide-react";
import { EmptyState } from "./complementary/empty-state";

type Module = {
  id: string;
  title: string;
  description?: string;
  coursesCount?: number;
  // coverUrl?: string; // se tiver
  // enterprise?: string; // se vier da API
};

export default function ModulesPage() {
  const { id: enterpriseId } = useParams<{ id: string }>();

  const {
    data: modules = [],
    isLoading,
    isError,
  } = useQuery<Module[]>({
    queryKey: ["modules", enterpriseId],
    queryFn: () => getModules(enterpriseId),
    enabled: !!enterpriseId,
    staleTime: 1000 * 60 * 5,
  });
  

  if (isLoading) {
    return (
      <div className="w-full max-w-[1200px] pr-4 lg:pr-0">
        <Header />
        <p className="mb-4 text-sm text-muted-foreground">
          Organize seus cursos por módulos e facilite a navegação dos alunos.
        </p>
        <SkeletonGrid />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="w-full max-w-[1200px] pr-4 lg:pr-0">
        <Header />
        <p className="mb-4 text-sm text-muted-foreground">
          Organize seus cursos por módulos e facilite a navegação dos alunos.
        </p>
        <EmptyState
          title="Não foi possível carregar os módulos"
          subtitle="Tente novamente em alguns instantes."
        />
      </div>
    );
  }

  return (
    <div className="w-full max-w-[1200px] pr-4 lg:pr-0 p-10">
      <Header />
      <p className="mb-4 text-sm text-muted-foreground">
        Organize seus cursos por módulos e facilite a navegação dos alunos.
      </p>

      {modules.length > 0 ? (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {modules.map((m) => (
            <ModuleCard key={m.id} module={m} enterpriseId={enterpriseId!} />
          ))}
        </div>
      ) : (
        <EmptyState
          title="Nenhum módulo ainda"
          subtitle="Crie o primeiro módulo e adicione cursos."
        />
      )}
    </div>
  );
}
function Header() {
  return (
    <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
      <h1 className="text-2xl font-bold tracking-tight inline-flex items-center gap-2">
        <Layers className="h-6 w-6" /> Módulos
      </h1>
    </div>
  );
}
function ModuleCard({
  module,
  enterpriseId,
}: {
  module: Module;
  enterpriseId: string;
}) {
  return (
    <Link
      href={`/enterprise/courses/${enterpriseId}`}
      className="group flex w-full flex-col overflow-hidden rounded-2xl border bg-white text-left shadow-sm transition hover:shadow-md focus:outline-none"
    >
      <div className="relative h-40 w-full bg-muted">
        <div className="absolute inset-0 grid place-items-center text-muted-foreground">
          <Layers className="h-10 w-10 opacity-60" />
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-2 p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="line-clamp-1 text-base font-semibold">
            {module.title}
          </h3>
          <Badge variant="secondary" className="whitespace-nowrap">
            {module.coursesCount ?? 0} curso(s)
          </Badge>
        </div>

        <p className="line-clamp-2 text-sm text-muted-foreground">
          {module.description ?? "\u00A0"}
        </p>

        <div className="mt-auto flex items-center justify-between pt-2 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1">
            <BookOpen className="h-4 w-4" /> Ver cursos
          </span>
          <span className="inline-flex items-center gap-1 opacity-0 transition group-hover:opacity-100">
            <PlayCircle className="h-4 w-4" /> Abrir
          </span>
        </div>
      </div>
    </Link>
  );
}

function SkeletonGrid() {
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="h-[260px] animate-pulse rounded-2xl border bg-muted/30" />
      ))}
    </div>
  );
}
