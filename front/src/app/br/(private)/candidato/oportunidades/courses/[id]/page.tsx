"use client";

import { ModuleCard } from "@/components/card/module-card";
import { ApiModule, getAllModules } from "@/service/module/get-all-modules";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { UseUserCandidate } from "@/context/user-candidate.context";
import { useMemo } from "react";
import { BookOpen } from "lucide-react";

export default function CoursesPage() {
  const { userCandidate } = UseUserCandidate();
  const canViewCourses = userCandidate?.canViewCourses || false;

  const { data, isLoading } = useQuery<ApiModule[]>({
    queryKey: ["all-modules-candidate"],
    queryFn: () => getAllModules(),
  });

  const sortedList = useMemo(() => {
    if (!data) return [];
    return [...data].sort((a, b) => {
      const dateA = new Date(a.createdAt || 0).getTime();
      const dateB = new Date(b.createdAt || 0).getTime();
      if (canViewCourses) return dateB - dateA;
      const isFreeA = !!a.freePlan;
      const isFreeB = !!b.freePlan;
      if (isFreeA !== isFreeB) return isFreeA ? -1 : 1;
      return dateB - dateA;
    });
  }, [data, canViewCourses]);

  if (isLoading) return <div className="p-10 animate-pulse text-gray-400">Carregando catálogo...</div>;

  return (
    // md:ml-72 alinha o conteúdo com o Aside fixo que configuramos anteriormente
    <div className="w-full flex flex-col items-center">
      <main className="w-full max-w-[1400px] p-6 lg:p-10 space-y-8">

        <header className="space-y-2 border-b border-gray-200 pb-6">
          <h1 className="text-2xl font-bold tracking-tight inline-flex items-center gap-2 text-gray-900">
            <BookOpen className="h-6 w-6 text-blue-900" /> Catálogo de Cursos
          </h1>
          <p className="text-sm text-muted-foreground">
            Explore nossa biblioteca de módulos e escolha um tema para iniciar sua jornada.
          </p>
        </header>

        <section className="w-full">
          {/* grid-rows-1 junto com items-stretch no card garante tamanhos iguais por linha */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {sortedList.map((module) => {
              // 1. Definimos a URL de destino
              const moduleHref = `/br/candidato/oportunidades/curso/${module.id}`;

              // 2. Verificamos se o acesso está bloqueado para este módulo específico
              const isAccessBlocked = !canViewCourses && !module.freePlan;

              // 3. O card em si
              const cardContent = (
                <div className="flex h-full w-full">
                  <ModuleCard
                    module={module}
                    isUserPermitted={canViewCourses}
                    userId={userCandidate?.id || ""}
                  />
                </div>
              );

              // 4. Se estiver bloqueado, renderizamos apenas o card (o modal de upgrade abre dentro dele)
              if (isAccessBlocked) {
                return <div key={module.id}>{cardContent}</div>;
              }

              // 5. Se tiver acesso, envolvemos o card com o Link de navegação
              return (
                <Link key={module.id} href={moduleHref} className="flex h-full w-full transition-transform hover:scale-[1.01]">
                  {cardContent}
                </Link>
              );
            })}
          </div>
        </section>

        <footer className="pt-10 border-t border-gray-200 text-center text-xs text-gray-400">
          &copy; {new Date().getFullYear()} Marketplace das Oportunidades &bull; NCM Consultoria.
        </footer>
      </main>
    </div>
  );
}