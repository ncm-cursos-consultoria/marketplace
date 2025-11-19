"use client";

import { ModuleCard } from "@/components/card/module-card";
import { ApiModule, getAllModules, ModuleParams } from "@/service/module/get-all-modules";
import { useQuery } from "@tanstack/react-query";
import ncm from "@/assets/logo-ncm-horizontal.svg";
import Link from "next/link";
import { UseUserCandidate } from "@/context/user-candidate.context";

export default function CoursesPage() {
  const userCandidate = UseUserCandidate();
  const canViewCourses = userCandidate?.userCandidate?.canViewCourses || false;
  const { data, isLoading } = useQuery<ApiModule[]>({
    queryKey: [],
    queryFn: () => getAllModules(),
  });

  return (
    <div className="flex min-h-screen">
      <main className="flex-1 bg-gray-100 p-8 space-y-16">
        <h1 className="text-3xl font-bold mb-4">Cursos Disponíveis</h1>
        <p className="text-gray-700 text-lg mb-10">
          Explore os cursos por tema e escolha o que mais combina com seus
          objetivos.
        </p>
        <section>
          <h2 className="text-2xl font-semibold mb-6">
            Cursos Marketplace das Oportunidades
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {Array.isArray(data) &&
              data.map((module: ApiModule) => {

                // 2. CALCULA O BLOQUEIO AQUI (Se não é permitido E o curso não é free)
                const isAccessBlocked = !canViewCourses && !module.freePlan;
                const moduleHref = `/br/candidato/oportunidades/curso/${module.id}`;

                const card = (
                  <ModuleCard
                    key={module.id}
                    module={module}
                    isUserPermitted={canViewCourses}
                  />
                );

                // 3. RENDERIZAÇÃO CONDICIONAL DO LINK
                if (isAccessBlocked) {
                  // Se bloqueado, renderiza apenas uma DIV com cursor desabilitado
                  return (
                    <div
                      key={module.id}
                      className="cursor-not-allowed" // Desabilita o cursor
                    >
                      {card}
                    </div>
                  );
                }

                // Se permitido (ou se o curso for gratuito), renderiza o LINK
                return (
                  <Link key={module.id} href={moduleHref}>
                    {card}
                  </Link>
                );
              })}
          </div>
        </section>
        <footer className="text-center text-gray-500 text-sm pt-6 border-t mt-10">
          &copy; {new Date().getFullYear()} Marketplace das Oportunidades. Todos
          os direitos reservados.
        </footer>
      </main>
    </div>
  );
}