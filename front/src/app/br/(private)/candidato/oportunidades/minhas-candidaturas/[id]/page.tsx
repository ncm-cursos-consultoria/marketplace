"use client";

import Link from "next/link";
import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, ChevronRight, Zap } from "lucide-react";
import { UseUserCandidate } from "@/context/user-candidate.context";
import { affinityClass } from "@/utils/affinity-class";
import { ApiJob, getAllJobs, getApplicationStatusStyle, JobOpeningUserCandidateStatus } from "@/service/job/get-all-jobs";

type Currency = {
  code: string;
  symbol: string;
  displayName: string;
};

// --- FUNÇÕES HELPER (Colocadas aqui para o código ser completo) ---

const statusStyle: Record<string, string> = {
  ACTIVE: "bg-emerald-100 text-emerald-700",
  PAUSED: "bg-amber-100 text-amber-700",
  CLOSED: "bg-rose-100 text-rose-700",
};

const workModelLabel: Record<string, string> = {
  ON_SITE: "Presencial",
  HYBRID: "Híbrido",
  REMOTE: "Remoto",
};

function moneyFmt(curr?: Currency, value?: number) {
  if (value == null) return "—";
  try {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: curr?.code || "BRL",
      maximumFractionDigits: 0,
    }).format(value);
  } catch {
    return `${curr?.symbol ?? "R$"} ${value.toLocaleString("pt-BR")}`;
  }
}

function dateTimePtBr(iso: string) {
  const d = new Date(iso);
  return new Intl.DateTimeFormat("pt-BR", {
    timeZone: "America/Sao_Paulo",
    dateStyle: "short",
    timeStyle: "short",
    hour12: false,
  }).format(d);
}

// 5. Ordem desejada das seções
const statusOrder: JobOpeningUserCandidateStatus[] = [
  "APPROVED",
  "SELECTED",
  "UNDER_REVIEW",
  "NOT_SELECTED",
  "REJECTED"
];

// --- COMPONENTE PRINCIPAL ---

export default function MinhasVagasPage() {
  const { userCandidate } = UseUserCandidate();
  const userId = userCandidate?.id;

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["job-openings-by-user", userId],
    enabled: !!userId,
    queryFn: async () => {
      const usersParam = Array.isArray(userId) ? userId.join(",") : userId!;

      // 3. CORREÇÃO DO ERRO 1: Chame 'getAllJobs' e retorne o resultado diretamente.
      const jobsData = await getAllJobs({ // <-- Renomeado para 'jobsData'
        userIds: [usersParam],
        affinity: true,
      });

      return jobsData; // <-- Retorna a lista
    },
    // staleTime: 1000 * 60 * 1,
  });

  // 7. AGRUPAR OS RESULTADOS POR STATUS
  const groupedJobs = useMemo(() => {
    if (!Array.isArray(data)) {
      return new Map<JobOpeningUserCandidateStatus, ApiJob[]>();
    }

    // Agrupa todas as vagas pelo status da aplicação
    const groups = new Map<JobOpeningUserCandidateStatus, ApiJob[]>();
    for (const job of data) {
      // Usa 'OUTROS' se o status for nulo/desconhecido
      const status = job.myApplicationStatus || "UNDER_REVIEW";
      if (!groups.has(status)) {
        groups.set(status, []);
      }
      groups.get(status)!.push(job);
    }
    return groups;
  }, [data]);

  // 8. Criar a lista de seções para renderizar, NA ORDEM CORRETA
  const sectionsToRender = statusOrder
    .map(status => {
      const jobsInGroup = groupedJobs.get(status);
      if (jobsInGroup && jobsInGroup.length > 0) {
        // Pega o nome e cor do 'util'
        const statusInfo = getApplicationStatusStyle(status);
        return {
          status: status,
          title: statusInfo.text,
          className: statusInfo.className,
          jobs: jobsInGroup,
        };
      }
      return null;
    })
    .filter(Boolean) as { // Filtra os grupos nulos
      status: string;
      title: string;
      className: string;
      jobs: ApiJob[];
    }[];

  // --- RENDERIZAÇÃO DE LOADING / ERRO ---

  if (!userId) {
    return (
      <div className="mx-auto max-w-5xl p-6">
        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <p className="text-neutral-700">
            Não foi possível identificar o usuário logado.
          </p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="mx-auto max-w-5xl p-6 space-y-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-24 rounded-xl border bg-slate-100 animate-pulse" />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="mx-auto max-w-5xl p-6">
        <div className="rounded-xl border border-rose-200 bg-rose-50 p-6">
          <p className="text-rose-700 font-medium">
            Não foi possível carregar suas vagas.
          </p>
          <Button className="mt-3" variant="secondary" onClick={() => refetch()}>
            Tentar novamente
          </Button>
        </div>
      </div>
    );
  }

  // --- RENDERIZAÇÃO PRINCIPAL ---

  return (
    <section className="mx-auto max-w-5xl p-6">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-xl font-semibold">Minhas vagas</h1>
      </div>

      {!isLoading && sectionsToRender.length === 0 ? (
        <div className="rounded-xl border bg-white p-8 text-center shadow-sm">
          <p className="text-neutral-700">
            Você ainda não se candidatou a nenhuma vaga.
          </p>
        </div>
      ) : (
        // Renderiza cada seção
        <div className="space-y-8">
          {sectionsToRender.map((section) => (
            <section key={section.status}>
              {/* Título da Seção (Ex: "Aprovado", "Em Análise") */}
              <Badge
                variant="secondary"
                // Adicionei padding e tamanho de fonte para destacar
                className={`text-md font-semibold mb-3 border px-4 py-1 ${section.className}`}
              >
                {section.title}
              </Badge>
              <div className="space-y-3">
                {section.jobs.map((v) => {
                  // Pega a cor da afinidade
                  const affinityColors = affinityClass(v.affinity);

                  return (
                    <Link
                      key={v.id}
                      href={`/br/candidato/oportunidades/vaga/${v.id}`}
                      className="group block rounded-xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
                    >
                      <div className="p-4 md:p-5">
                        <div className="flex items-start justify-between gap-4">
                          <div className="min-w-0">

                            {/* Grupo de Título e Afinidade */}
                            <div className="flex items-center gap-3 flex-wrap mb-1">
                              <h3 className="font-semibold text-gray-900 truncate">
                                {v.title}
                              </h3>
                              {v.affinity > 0 && (
                                <span
                                  className={`flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium ${affinityColors}`}
                                >
                                  <Zap className="h-3 w-3" />
                                  {v.affinity}% Afinidade
                                </span>
                              )}
                            </div>

                            {/* Detalhes (Local, Salário, Status da VAGA) */}
                            <div className="mt-1 flex flex-wrap items-center gap-3 text-sm text-gray-600">
                              <span className="inline-flex items-center gap-1">
                                <MapPin className="h-4 w-4" />
                                {v.city} - {v.state}
                              </span>
                              <span className="inline-flex items-center gap-1">
                                {moneyFmt(v.currency, v.salary)}
                              </span>

                              {/* Badge do Status da VAGA (Ex: ATIVA, PAUSADA) */}
                              <Badge
                                variant="secondary"
                                className={`
                                  ${statusStyle[(v.status || "").toUpperCase()] ?? "bg-slate-100 text-slate-700"}
                                `}
                              >
                                {v.status === "ACTIVE" ? "Ativa" : v.status}
                              </Badge>

                              {v.workModel && (
                                <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-700">
                                  {workModelLabel[v.workModel] ?? v.workModel}
                                </span>
                              )}
                            </div>
                          </div>

                          <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-gray-600" />
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </section>
          ))}
        </div>
      )}
    </section>
  );
}