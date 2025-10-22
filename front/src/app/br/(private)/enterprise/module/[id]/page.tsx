"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Layers, PlayCircle } from "lucide-react";
import { EmptyState } from "./complementary/empty-state";
import { getAllModules } from "@/service/module/get-all-modules";
import Image from "next/image";
import ncm from "@/assets/logo-ncm-horizontal.svg";

type Module = {
  id: string;
  title: string;
  description?: string;
  courseCount?: number;
  coverUrl?: string;
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
    queryFn: () => getAllModules(),
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
        <Layers className="h-6 w-6" /> Cursos
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
  const courseLessonsUrl = `/br/enterprise/courses/${module.id}`;
  const imageUrl = module.coverUrl || ncm;

  return (
    <Link
      href={courseLessonsUrl}
      className="group flex w-full flex-col overflow-hidden rounded-2xl border bg-white text-left shadow-sm transition hover:shadow-md focus:outline-none"
    >
      <div className="relative aspect-video w-full bg-gray-100 overflow-hidden">
        {/* Renderiza sempre o Image, usando a imageUrl definida acima */}
        <Image
          src={imageUrl}
          alt={`Capa do curso ${module.title}`}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
          // Se for a imagem default (ncm), usa object-contain para não cortar o logo
          // Se for a coverUrl, usa object-cover para preencher
          className={`${imageUrl === ncm ? 'object-contain p-8' : 'object-cover'} transition-transform duration-300 group-hover:scale-105`}
        />
        {/* Adiciona um overlay sutil se for a imagem de capa real */}
        {imageUrl !== ncm && <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"></div>}
      </div>

      <div className="flex flex-1 flex-col gap-2 p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="line-clamp-1 text-base font-semibold">
            {module.title}
          </h3>
          <Badge variant="secondary" className="whitespace-nowrap">
            {module.courseCount ?? 0} aula(s)
          </Badge>
        </div>

        <p className="line-clamp-2 text-sm text-muted-foreground">
          {module.description ?? "\u00A0"}
        </p>

        <div className="mt-auto flex items-center justify-between pt-2 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1">
            <BookOpen className="h-4 w-4" /> Ver aulas
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
