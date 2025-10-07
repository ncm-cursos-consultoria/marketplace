"use client";

import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import DOMPurify from "isomorphic-dompurify";
import {
  ArrowLeft,
  MapPin,
  Briefcase,
  Eye,
  CalendarClock,
  Building2,
  Globe2,
  Share2,
} from "lucide-react";
import { getUniqueJob } from "@/service/job/get-unique-job";
import { formatDate } from "@/utils/form-date";
import { countryName } from "@/utils/country-name";
import { UseUserCandidate } from "@/context/user-candidate.context";
import Link from "next/link";

type Job = {
  id: string;
  createdAt: string;
  updatedAt: string;
  title: string;
  currency?: {
    code: string;
    symbol: string;
    displayName: string;
  };
  description?: string; 
  status: "ACTIVE" | "INACTIVE" | "CLOSED" | string;
  country?: string; 
  state?: string;   
  city?: string;    
  workModel?: "REMOTE" | "HYBRID" | "ON_SITE" | string;
  views?: number;
  enterpriseId?: string;
  thirdParty?: boolean;
};

const WORK_MODEL_LABEL: Record<string, string> = {
  REMOTE: "Remoto",
  HYBRID: "Híbrido",
  ON_SITE: "Presencial",
};

const STATUS_STYLE: Record<string, string> = {
  ACTIVE: "bg-emerald-100 text-emerald-700 ring-1 ring-emerald-300",
  INACTIVE: "bg-gray-100 text-gray-700 ring-1 ring-gray-300",
  CLOSED: "bg-rose-100 text-rose-700 ring-1 ring-rose-300",
};


export default function JobUniquePage() {
  const {userCandidate} = UseUserCandidate()
  const params = useParams<{ id: string }>();
  const id = params?.id;

  const {
    data: job,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery<Job>({
    queryKey: ["job", id],
    queryFn: () => getUniqueJob(id as string),
    enabled: !!id,
    staleTime: 1000 * 60 * 2,
  });

  console.log(job);
  

  if (isLoading) {
    return (
      <div className="mx-auto max-w-5xl px-5 py-8">
        <div className="mb-6">
          <div className="h-5 w-32 rounded bg-neutral-200 animate-pulse" />
        </div>
        <div className="rounded-2xl border bg-white p-6 shadow-sm">
          <div className="h-7 w-72 rounded bg-neutral-200 animate-pulse mb-4" />
          <div className="flex gap-2 mb-6">
            <div className="h-6 w-24 rounded bg-neutral-200 animate-pulse" />
            <div className="h-6 w-20 rounded bg-neutral-200 animate-pulse" />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-3">
              <div className="h-5 w-full rounded bg-neutral-200 animate-pulse" />
              <div className="h-5 w-5/6 rounded bg-neutral-200 animate-pulse" />
              <div className="h-5 w-4/6 rounded bg-neutral-200 animate-pulse" />
            </div>
            <div className="space-y-2">
              <div className="h-28 w-full rounded-xl bg-neutral-200 animate-pulse" />
              <div className="h-10 w-full rounded-lg bg-neutral-200 animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="mx-auto max-w-3xl px-5 py-10">
        <div className="mb-4">
          <Link href="/oportunidades" className="inline-flex items-center gap-2 text-sm text-neutral-600 hover:text-black">
            <ArrowLeft className="h-4 w-4" />
            Voltar
          </Link>
        </div>
        <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
          <p className="font-medium text-red-700">Não foi possível carregar a vaga.</p>
          <p className="text-sm text-red-600 mt-1">
            {(error as Error)?.message ?? "Tente novamente em instantes."}
          </p>
          <button
            onClick={() => refetch()}
            className="mt-4 inline-flex items-center rounded-lg border px-3 py-1.5 text-sm hover:bg-white"
          >
            Tentar novamente
          </button>
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="mx-auto max-w-3xl px-5 py-10">
        <div className="mb-4">
          <Link href="/oportunidades" className="inline-flex items-center gap-2 text-sm text-neutral-600 hover:text-black">
            <ArrowLeft className="h-4 w-4" />
            Voltar
          </Link>
        </div>
        <div className="rounded-2xl border bg-white p-6 shadow-sm">
          <p className="font-medium">Vaga não encontrada.</p>
        </div>
      </div>
    );
  }

  
  const {
    title,
    description,
    status,
    city,
    state,
    country,
    workModel,
    currency,
    views,
    createdAt,
    updatedAt,
    thirdParty,
    enterpriseId,
  } = job;


  const safeHtml = DOMPurify.sanitize(description ?? "", {
    USE_PROFILES: { html: true },
  });

  const statusClass =
    STATUS_STYLE[status] ?? "bg-neutral-100 text-neutral-700 ring-1 ring-neutral-300";

  const locationStr = [city, state, countryName(country)].filter(Boolean).join(" • ");

  const handleShare = async () => {
    const url = typeof window !== "undefined" ? window.location.href : "";
    const shareData = {
      title: title,
      text: title,
      url,
    };
    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch {
      }
    } else if (navigator.clipboard) {
      await navigator.clipboard.writeText(url);
      alert("Link copiado para a área de transferência!");
    }
  };

  return (
    <div className="mx-auto max-w-5xl px-5 py-8">
      <div className="mb-6">
        <Link href={`/candidato/oportunidades/home/${userCandidate?.id}`} className="inline-flex items-center gap-2 text-sm text-neutral-600 hover:text-black">
          <ArrowLeft className="h-4 w-4" />
          Voltar
        </Link>
      </div>
      <div className="rounded-2xl border bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold leading-tight">{title}</h1>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${statusClass}`}>
                {status === "ACTIVE" ? "Ativa" : status === "CLOSED" ? "Encerrada" : "Inativa"}
              </span>
              {workModel ? (
                <span className="inline-flex items-center gap-1 rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-medium text-indigo-700 ring-1 ring-indigo-200">
                  <Briefcase className="h-3.5 w-3.5" />
                  {WORK_MODEL_LABEL[workModel] ?? workModel}
                </span>
              ) : null}
              {thirdParty ? (
                <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-700 ring-1 ring-amber-200">
                  <Globe2 className="h-3.5 w-3.5" />
                  Vaga de terceiro
                </span>
              ) : null}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-sm hover:bg-neutral-50"
              title="Compartilhar"
            >
              <Share2 className="h-4 w-4" />
              Compartilhar
            </button>
            <button className="inline-flex items-center rounded-xl bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
              Candidatar-se
            </button>
          </div>
        </div>

        {/* Metas */}
        <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <MetaItem
            icon={<MapPin className="h-4 w-4" />}
            label="Local"
            value={locationStr || "—"}
          />
          <MetaItem
            icon={<CalendarClock className="h-4 w-4" />}
            label="Publicado em"
            value={formatDate(createdAt)}
          />
          <MetaItem
            icon={<CalendarClock className="h-4 w-4" />}
            label="Atualizado em"
            value={formatDate(updatedAt)}
          />
          <MetaItem icon={<Eye className="h-4 w-4" />} label="Visualizações" value={String(views ?? 0)} />
        </div>

        {/* Layout principal */}
        <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Descrição */}
          <section className="prose prose-neutral max-w-none lg:col-span-2">
            <h2 className="text-lg font-semibold mb-3">Descrição da Vaga</h2>
            <div
              className="prose-sm sm:prose-base"
              dangerouslySetInnerHTML={{ __html: safeHtml || "<p>Sem descrição.</p>" }}
            />
          </section>

          {/* Sidebar de detalhes */}
          <aside className="space-y-4">
            <div className="rounded-2xl border bg-white p-4">
              <h3 className="mb-3 text-sm font-semibold text-neutral-700">Detalhes</h3>
              <dl className="space-y-3 text-sm">
                <Detail
                  icon={<Building2 className="h-4 w-4" />}
                  label="Empresa"
                  value={enterpriseId ? `ID ${enterpriseId}` : "—"}
                />
                <Detail
                  icon={<MapPin className="h-4 w-4" />}
                  label="Local"
                  value={locationStr || "—"}
                />
                <Detail
                  icon={<Briefcase className="h-4 w-4" />}
                  label="Modelo de trabalho"
                  value={workModel ? WORK_MODEL_LABEL[workModel] ?? workModel : "—"}
                />
                <Detail
                  icon={<Globe2 className="h-4 w-4" />}
                  label="Moeda"
                  value={
                    currency
                      ? `${currency.symbol} • ${currency.displayName} (${currency.code})`
                      : "—"
                  }
                />
                <Detail
                  icon={<Eye className="h-4 w-4" />}
                  label="Visualizações"
                  value={String(views ?? 0)}
                />
              </dl>
            </div>
            <Link
              href={`/candidato/oportunidades/jobs/${userCandidate?.id}`}
              className="block rounded-xl border bg-white px-4 py-2 text-center text-sm hover:bg-neutral-50"
            >
              Ver outras vagas
            </Link>
          </aside>
        </div>
      </div>
    </div>
  );
}

/** Componentes auxiliares */

function MetaItem({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3 rounded-xl border bg-neutral-50 px-3 py-3">
      <div className="rounded-lg bg-white p-2 ring-1 ring-neutral-200">{icon}</div>
      <div>
        <p className="text-[12px] text-neutral-500">{label}</p>
        <p className="text-sm font-medium text-neutral-900">{value}</p>
      </div>
    </div>
  );
}

function Detail({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-start gap-3">
      <div className="mt-0.5 text-neutral-500">{icon}</div>
      <div className="flex-1">
        <dt className="text-[12px] text-neutral-500">{label}</dt>
        <dd className="font-medium text-neutral-900">{value}</dd>
      </div>
    </div>
  );
}
