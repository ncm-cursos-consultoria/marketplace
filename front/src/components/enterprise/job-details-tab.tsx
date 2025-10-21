// src/components/enterprise/job-details-tab.tsx

"use client";

import type { JobFull } from "@/service/job/get-job-details";
import {
  Briefcase,
  Calendar,
  Clock,
  DollarSign,
  ExternalLink,
  Eye,
  FileText,
  Globe,
  MapPin,
  Tag,
} from "lucide-react";
import {
  contractTypeTranslations,
  formatValue,
  workModelTranslations,
  workPeriodTranslations,
} from "@/utils/translations"; // Importe o arquivo que criamos
import Link from "next/link";

interface JobDetailsTabProps {
  job: JobFull;
}

/**
 * Componente "filho" para criar um item de detalhe harmônico
 */
function DetailItem({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-3 rounded-lg bg-gray-50 p-4">
      <Icon className="h-5 w-5 flex-shrink-0 text-gray-500" />
      <div>
        <dt className="text-sm font-semibold text-gray-800">{label}</dt>
        <dd className="mt-0.5 text-sm text-gray-600">{value}</dd>
      </div>
    </div>
  );
}

/**
 * Função auxiliar para formatar o Salário
 * Aplica a Regra 1: "se o salario for 0 ou null, deve aparecer a combinar"
 */
function formatSalary(job: JobFull): string {
  if (!job.salary) {
    return "A combinar";
  }
  
  // Usa a API Intl para formatar a moeda corretamente (Ex: R$ 5.000,00)
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: job.currency.code || "BRL", // Usa BRL como fallback
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(job.salary);
}

/**
 * Função auxiliar para formatar o Horário
 */
function formatWorkHours(job: JobFull): string {
  if (job.workStartTime && job.workEndTime) {
    return `${job.workStartTime} - ${job.workEndTime}`;
  }
  if (job.workStartTime) {
    return `A partir de ${job.workStartTime}`;
  }
  return "Não informado";
}

/**
 * Função auxiliar para formatar data (ex: "21 de outubro de 2025")
 */
function formatPublicationDate(dateString: string): string {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    timeZone: 'UTC', // Importante para 'Instant'
  }).format(new Date(dateString));
}


// --- O COMPONENTE PRINCIPAL DA ABA ---
export function JobDetailsTab({ job }: JobDetailsTabProps) {
  return (
    <div className="space-y-8">
      
      {/* SEÇÃO 1: DESCRIÇÃO */}
      <section className="bg-white p-6 border rounded-lg shadow-sm">
        <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2 mb-4">
          <FileText className="h-5 w-5" />
          Descrição da Vaga
        </h2>
        {/* Usamos 'prose' do Tailwind para formatar o HTML da descrição */}
        <div
          className="prose prose-sm lg:prose-base max-w-none text-gray-700"
          dangerouslySetInnerHTML={{ __html: formatValue(job.description, undefined, "Nenhuma descrição fornecida.") }}
        />
      </section>

      {/* SEÇÃO 2: DETALHES DA POSIÇÃO */}
      <section>
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Detalhes da Posição
        </h2>
        <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <DetailItem
            icon={DollarSign}
            label="Remuneração"
            value={formatSalary(job)}
          />
          <DetailItem
            icon={Briefcase}
            label="Tipo de Contrato"
            value={formatValue(job.contractType, contractTypeTranslations)}
          />
          <DetailItem
            icon={Calendar}
            label="Período de Trabalho"
            value={formatValue(job.workPeriod, workPeriodTranslations)}
          />
          <DetailItem
            icon={Clock}
            label="Horário"
            value={formatWorkHours(job)}
          />
        </dl>
      </section>
      
      {/* SEÇÃO 3: LOCALIZAÇÃO */}
      <section>
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Localização
        </h2>
        <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <DetailItem
            icon={MapPin}
            label="Modelo de Trabalho"
            value={formatValue(job.workModel, workModelTranslations)}
          />
          <DetailItem
            icon={Globe}
            label="Local"
            value={`${job.city} - ${job.state}, ${job.country}`}
          />
        </dl>
      </section>

      {/* SEÇÃO 4: HABILIDADES (TAGS) */}
      {job.tags && job.tags.length > 0 && (
        <section>
          <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <Tag className="h-5 w-5" />
            Habilidades Exigidas
          </h2>
          <div className="flex flex-wrap gap-2">
            {job.tags.map((tag) => (
              <span
                key={tag.id}
                className="inline-flex items-center rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-700"
              >
                {tag.name || tag.title || "Tag"}
              </span>
            ))}
          </div>
        </section>
      )}
      
      {/* SEÇÃO 5: INFORMAÇÕES ADICIONAIS */}
      <section>
         <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Informações Adicionais
        </h2>
         <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
           {/* Regra 4: 'url' só aparece se 'thirdParty' for true */}
           {job.thirdParty && job.url && (
             <DetailItem
               icon={ExternalLink}
               label="Link da Vaga (Externa)"
               value={
                 <Link href={job.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline break-all">
                   {job.url}
                 </Link>
               }
             />
           )}
           <DetailItem
             icon={Eye}
             label="Visualizações"
             value={job.views}
           />
           <DetailItem
             icon={Calendar}
             label="Data da Publicação"
             value={formatPublicationDate(job.createdAt)}
           />
           {job.enterpriseLegalName && (
             <DetailItem
                icon={Briefcase}
                label="Publicado por"
                value={job.enterpriseLegalName}
             />
           )}
         </dl>
      </section>

    </div>
  );
}