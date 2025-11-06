import { BadgeCheck } from "lucide-react";

export function SecondCol() {
  return (
    <div className="space-y-4 ">
      <div className="bg-white rounded-2xl shadow-sm p-5">
        <div className="flex items-start justify-between">
          <p className="font-medium">Objetivo Profissional</p>
          <span className="text-[11px] px-2 py-1 rounded-full bg-emerald-100 text-emerald-700">
            ACTIVE
          </span>
        </div>
        <p className="mt-2 text-sm text-neutral-700">
          Front‑end / Full‑Stack Pleno trabalhando com Next.js + NestJS em
          produto de alto impacto.
        </p>
        <div className="mt-3 text-xs text-neutral-600">
          Faixa salarial desejada:{" "}
          <span className="font-medium text-neutral-800">R$ 7.000,00</span>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm p-5">
        <p className="font-medium">Certificação</p>
        <div className="mt-3 flex items-center gap-3 rounded-xl border p-3">
          <BadgeCheck className="h-4 w-4 text-blue-600" />
          <div>
            <p className="text-sm">Anti-Frágil - NCM</p>
            <p className="text-xs text-neutral-600">Emitido em 2025</p>
          </div>
        </div>
      </div>

      {/* <div className="bg-white rounded-2xl shadow-sm p-5">
        <p className="font-medium">Disponibilidade</p>
        <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
          <div className="rounded-xl border p-3">Remoto</div>
          <div className="rounded-xl border p-3">Horário Comercial</div>
          <div className="rounded-xl border p-3">PJ</div>
          <div className="rounded-xl border p-3">Alocado (SP) opcional</div>
        </div>
      </div> */}
    </div>
  );
}
