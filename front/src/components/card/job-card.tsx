"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Briefcase, Clock, Eye } from "lucide-react";
import { toast } from "sonner";

type ApiCurrency = {
  code: string;
  symbol: string;
  displayName: string;
};

type ApiJob = {
  id: string;
  createdAt: string;
  updatedAt: string;
  title: string;
  salary: number;
  currency: ApiCurrency;
  description: string;
  status: "ACTIVE" | "PAUSED" | "CLOSED" | string;
  country: string;
  state: string;
  city: string;
  workModel: "ON_SITE" | "HYBRID" | "REMOTE" | string;
  views: number;
  enterpriseId: string;
};

interface JobCardListProps {
  jobs?: ApiJob[];
  onApply?: (job: ApiJob) => void;
}

export function JobCardList({ jobs = [], onApply }: JobCardListProps) {
  if (!Array.isArray(jobs) || jobs.length === 0) {
    return (
      <div className="rounded-xl border bg-white p-8 text-center text-sm text-muted-foreground">
        Nenhuma vaga encontrada.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
      {jobs.map((job) => (
        <JobCardItem key={job.id} job={job} onApply={onApply} />
      ))}
    </div>
  );
}

function JobCardItem({
  job,
  onApply,
}: {
  job: ApiJob;
  onApply?: (job: ApiJob) => void;
}) {
  const money = formatMoney(job.salary, job.currency);
  const workLabel = workModelLabel(job.workModel);
  const statusBadge = statusBadgeView(job.status);

  const updatedAt = safeFormatDate(job.updatedAt);

  const handleApply = () => {
    if (onApply) {
      onApply(job);
    } else {
      toast.success("Candidatura enviada!", { description: job.title });
    }
  };

  return (
    <div className="flex flex-col rounded-xl border bg-white p-5 shadow transition hover:shadow-md">
      <div className="mb-3 flex items-center justify-between gap-2">
        <h2 className="line-clamp-1 text-xl font-semibold">{job.title}</h2>
        {statusBadge}
      </div>

      <div className="mb-3 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
        <span className="inline-flex items-center gap-1">
          <MapPin className="h-4 w-4" />
          {job.city} - {job.state} {job.country ? `(${job.country})` : ""}
        </span>
        <span className="inline-flex items-center gap-1">
          <Briefcase className="h-4 w-4" />
          {workLabel}
        </span>
        <span className="inline-flex items-center gap-1">
          <Clock className="h-4 w-4" />
          {updatedAt}
        </span>
      </div>

      <p className="mb-4 line-clamp-3 text-sm text-muted-foreground">
        {job.description}
      </p>

      <div className="mt-auto flex items-center justify-between">
        <div className="text-sm">
          <span className="text-muted-foreground">Salário</span>{" "}
          <span className="font-semibold">{money}</span>
        </div>

        <Button onClick={handleApply} className="cursor-pointer">
          Candidatar-se
        </Button>
      </div>
    </div>
  );
}

function formatMoney(amount?: number, currency?: ApiCurrency) {
  if (typeof amount !== "number" || !currency?.code) return "—";
  try {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: currency.code,
      currencyDisplay: "symbol",
      minimumFractionDigits: 2,
    }).format(amount);
  } catch {
    return `${currency?.symbol ?? ""} ${amount.toFixed(2)}`;
  }
}

function workModelLabel(w: ApiJob["workModel"]) {
  switch (w) {
    case "ON_SITE":
      return "Presencial";
    case "HYBRID":
      return "Híbrido";
    case "REMOTE":
      return "Remoto";
    default:
      return "—";
  }
}

function statusBadgeView(status: ApiJob["status"]) {
  const cls = (() => {
    switch (status) {
      case "ACTIVE":
        return "bg-emerald-100 text-emerald-700 border-emerald-200";
      case "PAUSED":
        return "bg-amber-100 text-amber-800 border-amber-200";
      case "CLOSED":
        return "bg-rose-100 text-rose-800 border-rose-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  })();

  return (
    <Badge variant="secondary" className={`border ${cls}`}>
      {status}
    </Badge>
  );
}

function safeFormatDate(iso?: string) {
  if (!iso) return "—";
  const d = new Date(iso);
  if (isNaN(d.getTime())) return "—";
  return d.toLocaleString("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  });
}
