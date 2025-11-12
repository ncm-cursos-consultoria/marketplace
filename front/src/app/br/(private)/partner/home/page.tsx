"use client";

import {
  Building2,
  Briefcase,
  CheckCircle2,
  Users,
  UserCheck2,
  TrendingUp,
} from "lucide-react";
import { StatCard } from "../complementary/stat-card";
import { UseUserPartner } from "@/context/user-partner.context";

function ProgressRow({ label, percent }: { label: string; percent: number }) {
  const pct = Math.max(0, Math.min(100, Math.round(percent)));
  return (
    <div className="mb-3">
      <div className="mb-1 flex items-center justify-between text-xs">
        <span className="text-neutral-700">{label}</span>
        <span className="font-medium text-neutral-700">{pct}%</span>
      </div>
      <div className="h-2 w-full rounded-full bg-neutral-200">
        <div
          className="h-2 rounded-full bg-blue-600"
          style={{ width: `${pct}%` }}
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={pct}
        />
      </div>
    </div>
  );
}


export default function PartnerPanel() {
  const { userPartner } = UseUserPartner()



  const totalJobOpening = 42;
  const totalJobOpeningFilled = 27;
  const totalEnterprise = 18;
  const totalUserCandidate = 613;
  const totalUserCandidateSelected = 512;

  const fillRate =
    totalJobOpening > 0
      ? Math.round((totalJobOpeningFilled / totalJobOpening) * 100)
      : 0;

  const hireRate =
    totalUserCandidate > 0
      ? Math.round((totalUserCandidateSelected / totalUserCandidate) * 100)
      : 0;

  return (
    <div className="px-6 py-6 w-[80vw]">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">
            PAINEL DE CONTROLE PREFEITURA
          </h1>
          <p className="text-sm text-neutral-600">
            Acompanhe as contratações, vagas e cadastros em um só lugar.
          </p>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
        <StatCard
          title="Empresas ativas"
          value={totalEnterprise}
          icon={<Building2 className="h-5 w-5 text-neutral-700" />}
          helper="Total de empresas participantes"
        />

        <StatCard
          title="Vagas abertas"
          value={totalJobOpening}
          icon={<Briefcase className="h-5 w-5 text-neutral-700" />}
          helper="Posições disponibilizadas"
        />

        <StatCard
          title="Vagas preenchidas"
          value={totalJobOpeningFilled}
          icon={<CheckCircle2 className="h-5 w-5 text-neutral-700" />}
          helper="Contratações concluídas"
          progressPercent={fillRate}
        />

        <StatCard
          title="Candidatos cadastrados"
          value={totalUserCandidate}
          icon={<Users className="h-5 w-5 text-neutral-700" />}
          helper="Base de talentos"
        />

        <StatCard
          title="Candidatos contratados"
          value={totalUserCandidateSelected}
          icon={<UserCheck2 className="h-5 w-5 text-neutral-700" />}
          helper="Total de contratações"
          progressPercent={hireRate}
        />

        <StatCard
          title="Índice empregabilidade do marketplace"
          value={`${hireRate}%`}
          icon={<TrendingUp className="h-5 w-5 text-neutral-700" />}
          helper="(Contratados / Cadastrados)"
        />
      </div>

      <section className="mt-10">
        <div className="mb-4">
          <h2 className="text-lg font-semibold">
            Informações profissionais relevantes
          </h2>
          <p className="text-sm text-neutral-600">
            Indicadores de mercado e perfil dos candidatos (exemplo
            ilustrativo).
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
          {/* Resumo */}
          <div className="rounded-2xl border bg-white p-4 shadow-sm">
            <h3 className="mb-3 text-sm font-medium text-neutral-700">
              Resumo
            </h3>

            <div className="mb-3 flex items-center justify-between rounded-xl border bg-neutral-50 px-3 py-2">
              <div>
                <p className="text-xs font-medium text-neutral-600">
                  Tempo médio até contratação
                </p>
                <p className="text-[11px] text-neutral-500">
                  Da candidatura à admissão
                </p>
              </div>
              <span className="text-sm font-semibold text-neutral-800">
                16 dias
              </span>
            </div>

            <div className="mb-3 flex items-center justify-between rounded-xl border bg-neutral-50 px-3 py-2">
              <div>
                <p className="text-xs font-medium text-neutral-600">
                  Faixa salarial média
                </p>
                <p className="text-[11px] text-neutral-500">
                  Predominante em nível Pleno
                </p>
              </div>
              <span className="text-sm font-semibold text-neutral-800">
                R$ 5.800
              </span>
            </div>

            <div className="flex items-center justify-between rounded-xl border bg-neutral-50 px-3 py-2">
              <div>
                <p className="text-xs font-medium text-neutral-600">
                  Senioridade predominante
                </p>
                <p className="text-[11px] text-neutral-500">
                  Júnior 28% · Sênior 17%
                </p>
              </div>
              <span className="text-sm font-semibold text-neutral-800">
                Pleno (55%)
              </span>
            </div>
          </div>

          {/* Modelo de trabalho */}
          <div className="rounded-2xl border bg-white p-4 shadow-sm">
            <h3 className="mb-3 text-sm font-medium text-neutral-700">
              Modelo de trabalho
            </h3>
            <ProgressRow label="Híbrido" percent={48} />
            <ProgressRow label="Presencial" percent={32} />
            <ProgressRow label="Remoto" percent={20} />
          </div>

          {/* Setores */}
          <div className="rounded-2xl border bg-white p-4 shadow-sm">
            <h3 className="mb-3 text-sm font-medium text-neutral-700">
              Setores com mais contratações
            </h3>
            <ProgressRow label="Tecnologia" percent={38} />
            <ProgressRow label="Administração" percent={22} />
            <ProgressRow label="Saúde" percent={14} />
          </div>

          {/* Habilidades */}
          <div className="rounded-2xl border bg-white p-4 shadow-sm lg:col-span-3">
            <h3 className="mb-3 text-sm font-medium text-neutral-700">
              Habilidades mais demandadas
            </h3>
            <div className="flex flex-wrap gap-2">
              <span className="rounded-full bg-neutral-100 px-3 py-1 text-xs font-medium text-neutral-700">
                TypeScript
              </span>
              <span className="rounded-full bg-neutral-100 px-3 py-1 text-xs font-medium text-neutral-700">
                React
              </span>
              <span className="rounded-full bg-neutral-100 px-3 py-1 text-xs font-medium text-neutral-700">
                Node.js
              </span>
              <span className="rounded-full bg-neutral-100 px-3 py-1 text-xs font-medium text-neutral-700">
                SQL
              </span>
              <span className="rounded-full bg-neutral-100 px-3 py-1 text-xs font-medium text-neutral-700">
                Gestão de Projetos
              </span>
              <span className="rounded-full bg-neutral-100 px-3 py-1 text-xs font-medium text-neutral-700">
                Figma
              </span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
