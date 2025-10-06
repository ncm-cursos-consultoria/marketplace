import { ModalCreateJob } from "@/components/enterprise/modal-create-jobs";
import { StatusBadge } from "@/components/enterprise/status.badge";
import { Modal } from "@/components/modal";
import { enterpriseJobs } from "@/utils/jobs-simulate";
import {
  ChevronRight,
  Clock,
  DollarSign,
  Eye,
  MapPin,
  Plus,
} from "lucide-react";
import Link from "next/link";
import { useMemo } from "react";

export function PostedJobs() {
  const salaryFmt = useMemo(
    () =>
      new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
        maximumFractionDigits: 0,
      }),
    []
  );

  return (
    <section className="mb-10">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-xl font-semibold">Vagas publicadas</h2>
        <ModalCreateJob />
      </div>

      <div className="space-y-3">
        {enterpriseJobs.map((v) => (
          <Link
            key={v.id}
            href={`#/vaga/${v.id}`}
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
                      <MapPin className="h-4 w-4" /> {v.city} - {v.uf}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <DollarSign className="h-4 w-4" />{" "}
                      {salaryFmt.format(v.salary)}
                    </span>
                    <StatusBadge value={v.status} />
                    <span className="inline-flex items-center gap-1">
                      <Eye className="h-4 w-4" /> {v.views} views
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <Clock className="h-4 w-4" /> {v.updatedAt}
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
