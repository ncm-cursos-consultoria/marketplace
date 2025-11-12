"use client";

import Link from "next/link";
import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/service/api";
import { UseUserEnteprise } from "@/context/user-enterprise.context";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Clock, ChevronRight, Plus } from "lucide-react";
import { UseUserCandidate } from "@/context/user-candidate.context";
// opcional: seu modal de criar vaga
// import { ModalCreateJob } from "@/components/enterprise/modal-create-jobs";

type Currency = {
  code: string;
  symbol: string;
  displayName: string;
};

type JobOpening = {
  id: string;
  createdAt: string;
  updatedAt: string;
  title: string;
  salary: number;
  currency: Currency;
  status: "ACTIVE" | "PAUSED" | "CLOSED" | string;
  country: string;
  state: string;
  city: string;
  workModel?: "ON_SITE" | "HYBRID" | "REMOTE" | string;
  views?: number;
};

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

export default function MinhasVagasPage() {
  
  const { userCandidate } = UseUserCandidate();
  const userId = userCandidate?.id; // <- ajuste se seu contexto expõe outro campo

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["job-openings-by-user", userId],
    enabled: !!userId,
    queryFn: async () => {
      // suporta um ou vários ids (ex.: [id1, id2])
      const usersParam = Array.isArray(userId) ? userId.join(",") : userId!;
      const { data } = await api.get<JobOpening[]>(`/job-opening?userIds=${userId}`);
      return data;
    },
    staleTime: 1000 * 60 * 5,
  });


  const salaryFmt = useMemo(
    () =>
      new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
        maximumFractionDigits: 0,
      }),
    []
  );

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

  const jobs = Array.isArray(data) ? data : [];

  return (
    <section className="mx-auto max-w-5xl p-6">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-xl font-semibold">Minhas vagas</h1>
      </div>

      {jobs.length === 0 ? (
        <div className="rounded-xl border bg-white p-8 text-center shadow-sm">
          <p className="text-neutral-700">
            Você ainda não se candidatou a nenhuma vaga.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {jobs.map((v) => (
            <Link
              key={v.id}
              href={`/br/candidato/oportunidades/vaga/${v.id}`}
              className="group block rounded-xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="p-4 md:p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <h3 className="font-semibold text-gray-900 truncate">
                      {v.title}
                    </h3>

                    <div className="mt-1 flex flex-wrap items-center gap-3 text-sm text-gray-600">
                      <span className="inline-flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        {v.city} - {v.state}
                      </span>

                      <span className="inline-flex items-center gap-1">
                        {moneyFmt(v.currency, v.salary)}
                      </span>

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

                      <span className="inline-flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <time dateTime={v.updatedAt}>{dateTimePtBr(v.updatedAt)}</time>
                      </span>
                    </div>
                  </div>

                  <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-gray-600" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
