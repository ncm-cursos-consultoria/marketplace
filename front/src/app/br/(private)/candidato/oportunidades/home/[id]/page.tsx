"use client";

import { ModuleCard } from "@/components/card/module-card";
import { UseUserCandidate } from "@/context/user-candidate.context";
import { ApiJob, getAllJobs, JobFilters } from "@/service/job/get-all-jobs";
import { formatLocation } from "@/utils/format-location";
import { formatMoney } from "@/utils/format-money";
import { statusClass } from "@/utils/status-class";
import { workModelLabel } from "@/utils/work-model-label";
import { useQuery } from "@tanstack/react-query";
import { Briefcase, MapPin, Zap } from "lucide-react";
import { ModuleSection } from "./complementary/module-section";
import { htmlToText } from "@/utils/htmlformat";
import Link from "next/link";
import { affinityClass } from "@/utils/affinity-class";

export default function Home() {
  const { userCandidate } = UseUserCandidate();
  const params: JobFilters = {
    affinity: true,
  };

  const { data: jobs, isLoading } = useQuery({
    queryKey: ["job"],
    queryFn: () => getAllJobs(params),
  });

  return (
    <div className="flex min-h-screen">
      <main className="flex-1 bg-gray-100 p-8 space-y-16">
        <section>
          <h1 className="text-2xl font-bold">
            Olá {userCandidate?.firstName} {userCandidate?.lastName}
          </h1>
          <h2 className="text-3xl font-bold mb-4">
            Bem-vindo ao Marketplace das Oportunidades
          </h2>
          <p className="text-gray-700 text-lg">
            Encontre cursos, vagas e informações para transformar sua vida
            profissional.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-6">Vagas de emprego</h2>
          <ul className="space-y-4">
            {Array.isArray(jobs) &&
              jobs
                // 1. Filtra PRIMEIRO: Mostra apenas vagas sem status de aplicação
                .filter((job) => !job.myApplicationStatus)
                // 2. Fatia DEPOIS: Pega as 3 primeiras vagas *filtradas*
                .slice(0, 3)
                // 3. Mapeia para renderizar
                .map((job: ApiJob) => {
                  const affinityColors = affinityClass(job.affinity);

                  return (
                    <li
                      key={job.id}
                      className="rounded-xl border bg-white p-5 shadow-sm hover:shadow-md transition"
                    >
                      <Link href={`/br/candidato/oportunidades/vaga/${job.id}`}>
                        <div className="flex items-center gap-3 flex-wrap">
                          <h3 className="font-semibold text-lg">{job.title}</h3>

                          {/* 9. O BADGE DE AFINIDADE (SÓ APARECE SE affinity > 0) */}
                          {job.affinity > 0 && (
                            <span
                              className={`flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium ${affinityColors}`}
                            >
                              <Zap className="h-3 w-3" />
                              {job.affinity}% Afinidade
                            </span>
                          )}
                        </div>

                        <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                          <span className="inline-flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            {formatLocation(job)}
                          </span>
                          <span className="inline-flex items-center gap-1">
                            <Briefcase className="h-4 w-4" />
                            {workModelLabel(job.workModel)}
                          </span>
                        </div>

                        {job.description && (
                          <p className="mt-2 line-clamp-2 text-sm text-gray-600">
                            {htmlToText(job.description)}
                          </p>
                        )}

                        <div className="mt-3 flex items-center justify-between">
                          <p className="text-sm">
                            <span className="text-gray-500">Salário</span>{" "}
                            <span className="font-semibold">
                              {Number.isFinite(job?.salary) && job.salary && job.salary > 0
                                ? formatMoney(job.salary, job.currency)
                                : "A combinar"}
                            </span>
                          </p>
                        </div>
                      </Link>
                    </li>
                  );
                })}
          </ul>
        </section>
        <ModuleSection />
        <section className="bg-white p-6 rounded shadow">
          <h2 className="text-xl font-semibold mb-2">
            Informações importantes
          </h2>
          <p className="text-gray-700">
            Nosso sistema conecta talentos com oportunidades reais. Aproveite
            todos os recursos disponíveis: capacitação, apoio e muito mais.
          </p>
        </section>

        {/* Footer */}
        <footer className="text-center text-gray-500 text-sm pt-6 border-t mt-10">
          &copy; {new Date().getFullYear()} Marketplace das Oportunidades. Todos
          os direitos reservados.
        </footer>
      </main>
    </div>
  );
}
