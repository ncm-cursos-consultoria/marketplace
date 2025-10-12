"use client";

import { useMemo } from "react";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/service/api";
import { MapPin, Building2, Briefcase, Eye, CalendarClock, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
// import { Button } from "@/components/ui/button"; // se quiser CTA
// import { UseUserCandidate } from "@/context/user-candidate.context"; // somente para candidato
// import { useMutation, useQueryClient } from "@tanstack/react-query"; // somente para CTA

// ===== Tipos alinhados ao payload que você enviou =====
type Currency = {
  code: string;      // "BRL"
  symbol: string;    // "R$"
  displayName: string;
};

type JobOpening = {
  id: string;
  createdAt: string;  // ISO
  updatedAt: string;  // ISO
  title: string;
  salary: number;
  currency: Currency;
  status: "ACTIVE" | "PAUSED" | "CLOSED" | string;
  country: string;    // "BR"
  state: string;      // "SP"
  city: string;       // "São Paulo"
  workModel?: "ON_SITE" | "HYBRID" | "REMOTE" | string;
  views?: number;
  enterpriseId?: string;
  enterpriseLegalName?: string;
  thirdParty?: boolean;
  // Campos opcionais que podem não vir (mantidos por compatibilidade)
  description?: string;
  workPeriod?: "FULL_TIME" | "PART_TIME" | string;
  contractType?: "CLT" | "PJ" | string;
  workStartTime?: string;
  workEndTime?: string;
  myApplicationStatus?: string;
};

// ===== Helpers de UI =====
const statusStyle: Record<string, string> = {
  ACTIVE: "bg-emerald-100 text-emerald-700",
  PAUSED: "bg-amber-100 text-amber-700",
  CLOSED: "bg-rose-100 text-rose-700",
};

const labelWorkModel: Record<string, string> = {
  REMOTE: "Remoto",
  ON_SITE: "Presencial",
  HYBRID: "Híbrido",
};

const labelWorkPeriod: Record<string, string> = {
  FULL_TIME: "Tempo integral",
  PART_TIME: "Meio período",
};

const labelContract: Record<string, string> = {
  CLT: "CLT",
  PJ: "PJ",
};

// usa código da moeda quando existir; fallback para símbolo
function moneyFmt(curr?: Currency, value?: number) {
  if (value == null) return "—";
  try {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: curr?.code || "BRL",
      maximumFractionDigits: 2,
    }).format(value);
  } catch {
    return `${curr?.symbol ?? "R$"} ${value.toLocaleString("pt-BR")}`;
  }
}

function dateFmt(iso?: string) {
  if (!iso) return "—";
  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
    hour12: false,
    timeZone: "America/Sao_Paulo",
  }).format(new Date(iso));
}

export default function EnterpriseJobPage() {
  const { id } = useParams<{ id: string }>();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["enterprise-job-opening", id],
    queryFn: async () => {
      const { data } = await api.get<JobOpening>(`/job-opening/${id}`);
      return data;
    },
    enabled: !!id,
  });

  const statusClass = useMemo(() => {
    const k = (data?.status ?? "").toUpperCase();
    return statusStyle[k] || "bg-slate-100 text-slate-700";
  }, [data?.status]);

  if (isLoading) {
    return (
      <div className="max-w-5xl mx-auto p-4 md:p-6">
        <div className="h-8 w-2/3 bg-slate-200 rounded animate-pulse mb-4" />
        <div className="h-5 w-1/3 bg-slate-200 rounded animate-pulse mb-6" />
        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-2 h-64 bg-slate-100 rounded-xl animate-pulse" />
          <div className="h-64 bg-slate-100 rounded-xl animate-pulse" />
        </div>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="max-w-5xl mx-auto p-6">
        <div className="rounded-xl border border-rose-200 bg-rose-50 p-6">
          <p className="text-rose-700 font-medium">Não foi possível carregar a vaga.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-6">
      {/* Header */}
      <div className="rounded-xl bg-white border border-gray-100 shadow-sm p-5 md:p-6">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
          <div className="min-w-0">
            <h1 className="text-xl md:text-2xl font-semibold text-gray-900">
              {data.title}
            </h1>

            <div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-gray-700">
              <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${statusClass}`}>
                {data.status === "ACTIVE" ? "Ativa" : data.status}
              </span>

              {data.workModel && (
                <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-700">
                  {labelWorkModel[data.workModel] ?? data.workModel}
                </span>
              )}
            </div>

            <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-gray-600">
              <span className="inline-flex items-center gap-1.5">
                <MapPin className="h-4 w-4" />
                {data.city} - {data.state}
              </span>

              <span className="inline-flex items-center gap-1.5">
                <Briefcase className="h-4 w-4" />
                {moneyFmt(data.currency, data.salary)}
              </span>

              <span className="inline-flex items-center gap-1.5">
                <Eye className="h-4 w-4" />
                {data.views ?? 0} visualizações
              </span>

              <span className="inline-flex items-center gap-1.5">
                <CalendarClock className="h-4 w-4" />
                Atualizada em {dateFmt(data.updatedAt)}
              </span>
            </div>
          </div>

          {/* Área de ações da EMPRESA (ex.: editar / ver inscritos)
              Para candidato, subistitua por um CTA de candidatura */}
          {/* <div className="flex gap-2 shrink-0">
            <Button variant="secondary">Editar vaga</Button>
            <Button>Ver inscritos</Button>
          </div> */}
        </div>
      </div>

      {/* Conteúdo */}
      <div className="mt-6 grid md:grid-cols-3 gap-6">
        {/* Descrição */}
        <div className="md:col-span-2 rounded-xl bg-white border border-gray-100 shadow-sm p-5 md:p-6">
          <h2 className="text-base font-semibold text-gray-900 mb-3">
            Descrição da vaga
          </h2>
          {data.description ? (
            <div className="prose prose-slate max-w-none">
              <p className="whitespace-pre-line">{data.description}</p>
            </div>
          ) : (
            <p className="text-sm text-gray-600">Sem descrição informada.</p>
          )}
        </div>

        {/* Lateral com detalhes */}
        <div className="rounded-xl bg-white border border-gray-100 shadow-sm p-5 md:p-6 space-y-5">
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-2">Empresa</h3>
            <div className="flex items-center gap-2 text-sm text-gray-700">
              <Building2 className="h-4 w-4" />
              <span>{data.enterpriseLegalName ?? "—"}</span>
            </div>
            {data.thirdParty && (
              <p className="text-xs text-gray-500 mt-1">Vaga terceirizada</p>
            )}
          </div>

          <div className="h-px bg-gray-100" />

          <div className="space-y-2 text-sm text-gray-700">
            <div className="flex justify-between">
              <span className="text-gray-500">Modelo de trabalho</span>
              <span className="font-medium">
                {data.workModel ? (labelWorkModel[data.workModel] ?? data.workModel) : "—"}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-500">Período</span>
              <span className="font-medium">
                {data.workPeriod ? (labelWorkPeriod[data.workPeriod] ?? data.workPeriod) : "—"}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-500">Contrato</span>
              <span className="font-medium">
                {data.contractType ? (labelContract[data.contractType] ?? data.contractType) : "—"}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-500">Horário</span>
              <span className="font-medium inline-flex items-center gap-1.5">
                <Clock className="h-4 w-4" />
                {data.workStartTime && data.workEndTime
                  ? `${data.workStartTime} - ${data.workEndTime}`
                  : "—"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
