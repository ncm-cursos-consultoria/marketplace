"use client";

import { ModalCandidate } from "@/app/br/(private)/candidato/oportunidades/modal-candidate";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getApplicationStatusStyle, type ApiJob } from "@/service/job/get-all-jobs";
import { affinityClass } from "@/utils/affinity-class";
import { formatMoney } from "@/utils/format-money";
import { htmlToText } from "@/utils/htmlformat";
import { MapPin, Briefcase, Clock, Zap } from "lucide-react";
import Link from "next/link";
import { useMemo } from "react";
import { toast } from "sonner";

type ApiCurrency = {
  code: string;
  symbol: string;
  displayName: string;
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
  const salaryLabel = useMemo(() => {
    const { salary, salaryRangeStart, salaryRangeEnd, currency } = job;
    
    // Verificamos se os valores são números válidos (>= 0)
    // Usamos '!= null' para permitir o valor '0'
    const startIsValid = salaryRangeStart != null && salaryRangeStart >= 0;
    const endIsValid = salaryRangeEnd != null && salaryRangeEnd > 0;
    const fixedIsValid = salary != null && salary > 0;

    // 1. Tenta a Faixa Completa (Ex: R$ 0 - R$ 13.000)
    //    Verifica se o 'end' é maior que o 'start'
    if (startIsValid && endIsValid && salaryRangeEnd > salaryRangeStart) {
      return `${formatMoney(salaryRangeStart, currency)} - ${formatMoney(salaryRangeEnd, currency)}`;
    }
    
    // 2. Tenta "A partir de" (Ex: A partir de R$ 11.000)
    //    (Também trata o caso de 'A partir de R$ 0')
    if (startIsValid) {
      return `A partir de ${formatMoney(salaryRangeStart, currency)}`;
    }
    
    // 3. Tenta Salário Fixo (Ex: R$ 13.000)
    if (fixedIsValid) {
      return formatMoney(salary, currency);
    }

    // 4. Fallback
    return "a combinar";
  }, [job.salary, job.salaryRangeStart, job.salaryRangeEnd, job.currency]);
  const workLabel = workModelLabel(job.workModel);
  const statusBadge = statusBadgeView(job.status);
  const updatedAt = safeFormatDate(job.updatedAt);
  const affinityColors = affinityClass(job.affinity);
  const applicationStatus = job.myApplicationStatus
    ? getApplicationStatusStyle(job.myApplicationStatus)
    : null;

  const handleApply = () => {
    if (onApply) {
      onApply(job);
    } else {
      toast.success("Candidatura enviada!", { description: job.title });
    }
  };

  return (
    <Link
      href={`/br/candidato/oportunidades/vaga/${job.id}`}
      className="flex flex-col rounded-xl border bg-white p-5 shadow transition hover:shadow-md"
    >
      <div className="mb-3 flex items-start justify-between gap-2">
        {/* Coluna da Esquerda: Título e Afinidade */}
        <div className="flex flex-col gap-2 min-w-0">
          <h2 className="line-clamp-2 text-xl font-semibold">{job.title}</h2>

          <div className="flex items-center gap-2">
            {/* Badge de Afinidade */}
            {job.affinity > 0 && (
              <Badge
                variant="secondary"
                className={`flex items-center gap-1 border ${affinityColors}`}
              >
                <Zap className="h-3 w-3" />
                {job.affinity}% Afinidade
              </Badge>
            )}
          </div>
        </div>

        {/* Coluna da Direita: Status da Candidatura */}
        {applicationStatus && (
          <Badge
            variant="secondary"
            className={`border flex-shrink-0 ${applicationStatus.className}`}
          >
            {applicationStatus.text}
          </Badge>
        )}
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
        {htmlToText(job.description ?? "")}
      </p>

      <div className="mt-auto flex items-center justify-between">
        <div className="text-sm">
          <span className="text-muted-foreground">Salário</span>{" "}
          <span className="font-semibold">{salaryLabel}</span>
        </div>

        <Button className="bg-blue-600 cursor-pointer hover:bg-blue-700">Saiba mais</Button>
      </div>
    </Link>
  );
}

// function formatMoney(
//   amount?: number,
//   currency?: ApiCurrency
// ): string | undefined {
//   // Sem salário (null/undefined/NaN) ou sem moeda -> sem valor
//   if (amount == null || Number.isNaN(Number(amount)) || !currency?.code) {
//     return undefined;
//   }

//   // Se quiser tratar 0 ou negativo como "sem salário", descomente:
//   // if (amount <= 0) return undefined;

//   try {
//     return new Intl.NumberFormat("pt-BR", {
//       style: "currency",
//       currency: currency.code,
//       currencyDisplay: "symbol",
//       minimumFractionDigits: 2,
//     }).format(amount);
//   } catch {
//     // Fallback simples; se não tiver símbolo, considera "sem salário"
//     return currency?.symbol
//       ? `${currency.symbol} ${Number(amount).toFixed(2)}`
//       : undefined;
//   }
// }

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

// CÓDIGO CORRIGIDO
function safeFormatDate(iso?: string) {
  if (!iso) return "—";
  const d = new Date(iso);
  if (isNaN(d.getTime())) return "—";

  // Use toLocaleDateString(), que formata APENAS a data.
  return d.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    timeZone: "UTC" // Garante que a data não mude por causa do fuso horário
  });
}
