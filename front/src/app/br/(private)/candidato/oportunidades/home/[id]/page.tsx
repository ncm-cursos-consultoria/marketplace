"use client";

import { CourseCard } from "@/components/card/course-card";
import { UseUserCandidate } from "@/context/user-candidate.context";
import { getAllJobs } from "@/service/job/get-all-jobs";
import { formatLocation } from "@/utils/format-location";
import { formatMoney } from "@/utils/format-money";
import { statusClass } from "@/utils/status-class";
import { workModelLabel } from "@/utils/work-model-label";
import { useQuery } from "@tanstack/react-query";
import { Briefcase, MapPin } from "lucide-react";
import { ModuleSection } from "./complementary/module-section";
import { htmlToText } from "@/utils/htmlformat";
import Link from "next/link";

export default function Home() {
  const { userCandidate } = UseUserCandidate();

  const { data: jobs, isLoading } = useQuery({
    queryKey: ["job"],
    queryFn: () => getAllJobs(),
  });

  console.log(userCandidate);

  console.log(jobs);

  return (
    <div className="flex min-h-screen">
      <main className="flex-1 bg-gray-100 p-8 space-y-16">
        <section>
          <h1 className="text-3xl font-bold mb-4">
            Bem-vindo ao Marketplace das Oportunidades
          </h1>
          <p className="text-gray-700 text-lg">
            Encontre cursos, vagas e informações para transformar sua vida
            profissional.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-6">Vagas de emprego</h2>
          <ul className="space-y-4">
            {Array.isArray(jobs) &&
              jobs.slice(0, 3).map((job: any) => (
                <li
                  key={job.id}
                  className="rounded-xl border bg-white p-5 shadow-sm hover:shadow-md transition"
                >
                  <Link href={`/candidato/oportunidades/vaga/${job.id}`}>
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="font-semibold text-lg">{job.title}</h3>
                      <span
                        className={`rounded-full border px-2.5 py-1 text-xs font-medium ${statusClass(
                          job.status
                        )}`}
                      >
                        {job.status ?? "—"}
                      </span>
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
                          {formatMoney(job.salary, job.currency)}
                        </span>
                      </p>
                    </div>
                  </Link>
                </li>
              ))}
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
