import { ModalCreateJob } from "@/components/enterprise/modal-create-jobs";
import { StatusBadge } from "@/components/enterprise/status.badge";
import { UseUserEnteprise } from "@/context/user-enterprise.context";
import { getJobByEnterprise } from "@/service/job/get-job-by-enterprise";
import { JobFull } from "@/service/job/get-job-details";
import { formatMoney } from "@/utils/format-money";
import { useQuery } from "@tanstack/react-query";
import { ChevronRight, Clock, MapPin } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useMemo } from "react";

export function PostedJobs() {
  const { userEnterprise } = UseUserEnteprise();
  const enterpriseId = userEnterprise?.enterpriseId ?? null;

  const { data, isLoading } = useQuery({
    queryKey: ["job", enterpriseId],
    queryFn: () => getJobByEnterprise(enterpriseId!),
    enabled: !!enterpriseId,
  });

  function formatSalary(job: JobFull): string {
    const { salary, salaryRangeStart, salaryRangeEnd, currency } = job;

    // Verificamos se os valores são números válidos (>= 0)
    const startIsValid = salaryRangeStart != null && salaryRangeStart >= 0;
    const endIsValid = salaryRangeEnd != null && salaryRangeEnd > 0;
    const fixedIsValid = salary != null && salary > 0;

    // 1. Tenta a Faixa Completa (Ex: R$ 0 - R$ 13.000)
    if (startIsValid && endIsValid && salaryRangeEnd > salaryRangeStart) {
      return `${formatMoney(salaryRangeStart, currency)} - ${formatMoney(salaryRangeEnd, currency)}`;
    }

    // 2. Tenta "A partir de" (Ex: A partir de R$ 11.000)
    if (startIsValid) {
      return `A partir de ${formatMoney(salaryRangeStart, currency)}`;
    }

    // 3. Tenta Salário Fixo (Ex: R$ 13.000)
    if (fixedIsValid) {
      return formatMoney(salary, currency);
    }

    // 4. Fallback
    return "A combinar";
  }

  // 7. FUNÇÃO DE DATA CORRIGIDA
  function formatPtBr(iso?: string) { // <-- Marcar como opcional
    if (!iso) return "—"; // Fallback se 'updatedAt' for nulo
    const d = new Date(iso);
    return new Intl.DateTimeFormat("pt-BR", {
      timeZone: "America/Sao_Paulo",
      dateStyle: "short",
      // timeStyle: "short", // Removido para mostrar só a data
      hour12: false,
    }).format(d);
  }

  if (data <= 0) {
    return (
      <div className="flex flex-col justify-between mb-3 gap-10">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Vagas publicadas</h2>
          <ModalCreateJob />
        </div>
        <div>
          <p className="text-[14px] text-neutral-600">Não há vagas postadas até o momento</p>
        </div>
      </div>
    );
  }

  return (
    <section className="mb-10">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-xl font-semibold">Vagas publicadas</h2>
        <ModalCreateJob />
      </div>
      <div className="space-y-3">
        {Array.isArray(data) &&
          data.map((v: any) => (
            <Link
              key={v.id}
              href={`/br/enterprise/vaga/${v.id}`}
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
                        <MapPin className="h-4 w-4" /> {v.city} - {v.state}
                      </span>
                      <span className="inline-flex items-center gap-1 font-medium text-gray-700">
                        {formatSalary(v)} 
                      </span>
                      <StatusBadge value={v.status} />
                      <div>
                        <div>
                          {v.workModel === "HYBRID" && <span>Híbrido</span>}
                        </div>
                      </div>
                      <span className="inline-flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <time dateTime={v.updatedAt}>
                          {formatPtBr(v.updatedAt)}
                        </time>
                      </span>
                    </div>
                  </div>
                  <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-gray-600" />
                </div>
              </div>
            </Link>
          ))}
      </div>
    </section>
  );
}
