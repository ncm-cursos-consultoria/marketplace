"use client";

import {
  Building2,
  Briefcase,
  CheckCircle2,
  Users,
  UserCheck2,
  TrendingUp,
  Check,
  ArrowUpRight,
  Download,
  Plus,
  FolderOpen,
  MapPin,
  Factory,
  UserRoundCheck,
} from "lucide-react";
import { StatCard } from "./complementary/stat-card";

/** helpers simples */
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

function BarCompare({
  month,
  opened,
  filled,
}: {
  month: string;
  opened: number;
  filled: number;
}) {
  const pct = opened > 0 ? Math.round((filled / opened) * 100) : 0;
  return (
    <div className="rounded-xl border p-3">
      <div className="mb-2 flex items-center justify-between text-xs">
        <span className="font-medium text-neutral-700">{month}</span>
        <span className="text-neutral-600">
          {filled}/{opened} ({pct}%)
        </span>
      </div>
      <div className="h-2 w-full rounded-full bg-neutral-200">
        {/* faixa total (abertas) */}
        <div className="h-2 w-full rounded-full bg-neutral-200" />
        {/* preenchidas sobrepostas */}
        <div
          className="relative -mt-2 h-2 rounded-full bg-blue-600"
          style={{ width: `${pct}%` }}
        />
      </div>
      <div className="mt-2 flex items-center gap-3 text-[11px] text-neutral-600">
        <span className="inline-block h-2 w-2 rounded-full bg-blue-600" />
        Preenchidas
        <span className="inline-block h-2 w-2 rounded-full bg-neutral-300" />
        Abertas
      </div>
    </div>
  );
}

function Insight({ children }: { children: string }) {
  return (
    <div className="flex items-start gap-2 text-sm">
      <Check className="mt-[2px] h-4 w-4 text-green-600" />
      <span className="text-neutral-700">{children}</span>
    </div>
  );
}

export default function PartnerPanel() {
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
          <h1 className="text-2xl font-semibold">PAINEL DE CONTROLE PREFEITURA</h1>
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

      {/* ===== Informações profissionais relevantes (já tinha) ===== */}
      <section className="mt-10">
        <div className="mb-4">
          <h2 className="text-lg font-semibold">Informações profissionais relevantes</h2>
          <p className="text-sm text-neutral-600">
            Indicadores de mercado e perfil dos candidatos (exemplo ilustrativo).
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
          {/* Resumo */}
          <div className="rounded-2xl border bg-white p-4 shadow-sm">
            <h3 className="mb-3 text-sm font-medium text-neutral-700">Resumo</h3>

            <div className="mb-3 flex items-center justify-between rounded-xl border bg-neutral-50 px-3 py-2">
              <div>
                <p className="text-xs font-medium text-neutral-600">Tempo médio até contratação</p>
                <p className="text-[11px] text-neutral-500">Da candidatura à admissão</p>
              </div>
              <span className="text-sm font-semibold text-neutral-800">16 dias</span>
            </div>

            <div className="mb-3 flex items-center justify-between rounded-xl border bg-neutral-50 px-3 py-2">
              <div>
                <p className="text-xs font-medium text-neutral-600">Faixa salarial média</p>
                <p className="text-[11px] text-neutral-500">Predominante em nível Pleno</p>
              </div>
              <span className="text-sm font-semibold text-neutral-800">R$ 5.800</span>
            </div>

            <div className="flex items-center justify-between rounded-xl border bg-neutral-50 px-3 py-2">
              <div>
                <p className="text-xs font-medium text-neutral-600">Senioridade predominante</p>
                <p className="text-[11px] text-neutral-500">Júnior 28% · Sênior 17%</p>
              </div>
              <span className="text-sm font-semibold text-neutral-800">Pleno (55%)</span>
            </div>
          </div>

          {/* Modelo de trabalho */}
          <div className="rounded-2xl border bg-white p-4 shadow-sm">
            <h3 className="mb-3 text-sm font-medium text-neutral-700">Modelo de trabalho</h3>
            <ProgressRow label="Híbrido" percent={48} />
            <ProgressRow label="Presencial" percent={32} />
            <ProgressRow label="Remoto" percent={20} />
          </div>

          {/* Setores */}
          <div className="rounded-2xl border bg-white p-4 shadow-sm">
            <h3 className="mb-3 text-sm font-medium text-neutral-700">Setores com mais contratações</h3>
            <ProgressRow label="Tecnologia" percent={38} />
            <ProgressRow label="Administração" percent={22} />
            <ProgressRow label="Saúde" percent={14} />
          </div>

          {/* Habilidades */}
          <div className="rounded-2xl border bg-white p-4 shadow-sm lg:col-span-3">
            <h3 className="mb-3 text-sm font-medium text-neutral-700">Habilidades mais demandadas</h3>
            <div className="flex flex-wrap gap-2">
              <span className="rounded-full bg-neutral-100 px-3 py-1 text-xs font-medium text-neutral-700">TypeScript</span>
              <span className="rounded-full bg-neutral-100 px-3 py-1 text-xs font-medium text-neutral-700">React</span>
              <span className="rounded-full bg-neutral-100 px-3 py-1 text-xs font-medium text-neutral-700">Node.js</span>
              <span className="rounded-full bg-neutral-100 px-3 py-1 text-xs font-medium text-neutral-700">SQL</span>
              <span className="rounded-full bg-neutral-100 px-3 py-1 text-xs font-medium text-neutral-700">Gestão de Projetos</span>
              <span className="rounded-full bg-neutral-100 px-3 py-1 text-xs font-medium text-neutral-700">Figma</span>
            </div>
          </div>
        </div>
      </section>


      {/* <section className="mt-10">
        <div className="mb-4">
          <h2 className="text-lg font-semibold">Panorama complementar</h2>
          <p className="text-sm text-neutral-600">Comparativos mensais, funil de candidatura, ranking e atalhos.</p>
        </div>

        <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">
          <div className="rounded-2xl border bg-white p-4 shadow-sm">
            <h3 className="mb-3 flex items-center gap-2 text-sm font-medium text-neutral-700">
              <ArrowUpRight className="h-4 w-4" /> Comparativo mensal (abertas × preenchidas)
            </h3>

            <div className="grid gap-3">
              <BarCompare month="Agosto" opened={36} filled={22} />
              <BarCompare month="Setembro" opened={41} filled={25} />
              <BarCompare month="Outubro" opened={42} filled={27} />
            </div>
          </div>


          <div className="rounded-2xl border bg-white p-4 shadow-sm">
            <h3 className="mb-3 flex items-center gap-2 text-sm font-medium text-neutral-700">
              <UserRoundCheck className="h-4 w-4" /> Funil de candidaturas
            </h3>
            <ProgressRow label="Triagem" percent={72} />
            <ProgressRow label="Entrevista" percent={49} />
            <ProgressRow label="Proposta" percent={21} />
            <ProgressRow label="Admitidos" percent={84} />
            <p className="mt-2 text-xs text-neutral-600">
              Conversões ilustrativas por etapa do processo.
            </p>
          </div>

          <div className="rounded-2xl border bg-white p-4 shadow-sm">
            <h3 className="mb-3 text-sm font-medium text-neutral-700">Atalhos</h3>
            <div className="grid gap-2">
              <button className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
                <Plus className="h-4 w-4" /> Criar nova vaga
              </button>
              <button className="flex items-center justify-center gap-2 rounded-xl border px-4 py-2 text-sm font-medium hover:bg-neutral-50">
                <FolderOpen className="h-4 w-4" /> Ver todas as vagas
              </button>
              <button className="flex items-center justify-center gap-2 rounded-xl border px-4 py-2 text-sm font-medium hover:bg-neutral-50">
                <Factory className="h-4 w-4" /> Empresas
              </button>
              <button className="flex items-center justify-center gap-2 rounded-xl border px-4 py-2 text-sm font-medium hover:bg-neutral-50">
                <Download className="h-4 w-4" /> Exportar CSV
              </button>
            </div>
          </div>

          <div className="rounded-2xl border bg-white p-4 shadow-sm xl:col-span-2">
            <h3 className="mb-3 flex items-center gap-2 text-sm font-medium text-neutral-700">
              <Building2 className="h-4 w-4" /> Empresas com mais contratações
            </h3>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead className="text-left text-neutral-500">
                  <tr>
                    <th className="pb-2">Empresa</th>
                    <th className="pb-2">Contratações</th>
                    <th className="pb-2">Vagas abertas</th>
                    <th className="pb-2">Índice de preenchimento</th>
                  </tr>
                </thead>
                <tbody className="align-top">
                  <tr className="border-t">
                    <td className="py-2 font-medium">TechParnaíba</td>
                    <td className="py-2">32</td>
                    <td className="py-2">12</td>
                    <td className="py-2">
                      <div className="h-2 w-40 rounded-full bg-neutral-200">
                        <div className="h-2 w-[78%] rounded-full bg-blue-600" />
                      </div>
                      <span className="text-xs text-neutral-600">78%</span>
                    </td>
                  </tr>
                  <tr className="border-t">
                    <td className="py-2 font-medium">Saúde+</td>
                    <td className="py-2">21</td>
                    <td className="py-2">9</td>
                    <td className="py-2">
                      <div className="h-2 w-40 rounded-full bg-neutral-200">
                        <div className="h-2 w-[66%] rounded-full bg-blue-600" />
                      </div>
                      <span className="text-xs text-neutral-600">66%</span>
                    </td>
                  </tr>
                  <tr className="border-t">
                    <td className="py-2 font-medium">AdminCorp</td>
                    <td className="py-2">18</td>
                    <td className="py-2">7</td>
                    <td className="py-2">
                      <div className="h-2 w-40 rounded-full bg-neutral-200">
                        <div className="h-2 w-[61%] rounded-full bg-blue-600" />
                      </div>
                      <span className="text-xs text-neutral-600">61%</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="rounded-2xl border bg-white p-4 shadow-sm">
            <h3 className="mb-3 flex items-center gap-2 text-sm font-medium text-neutral-700">
              <MapPin className="h-4 w-4" /> Cidades com mais contratações
            </h3>
            <ProgressRow label="Santana de Parnaíba" percent={40} />
            <ProgressRow label="Barueri" percent={28} />
            <ProgressRow label="Osasco" percent={18} />
          </div>
          <div className="rounded-2xl border bg-white p-4 shadow-sm xl:col-span-2">
            <h3 className="mb-3 text-sm font-medium text-neutral-700">Notas & insights</h3>
            <div className="grid gap-2">
              <Insight>Alta demanda por perfis Pleno em Tecnologia.</Insight>
              <Insight>Processos ágeis reduziram o tempo médio de contratação para 16 dias.</Insight>
              <Insight>Híbrido permanece como o modelo preferido (48%).</Insight>
            </div>
          </div>
        </div>
      </section> */}
    </div>
  );
}
