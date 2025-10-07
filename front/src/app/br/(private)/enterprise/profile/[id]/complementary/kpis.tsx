import { Kpi } from "@/components/enterprise/profile/kpi";

export function Kpis() {
  return (
    <section className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <Kpi title="Vagas ativas" value="3" />
      <Kpi title="Candidatos" value="123" />
      <Kpi title="Visualizações" value="198" />
    </section>
  );
}
