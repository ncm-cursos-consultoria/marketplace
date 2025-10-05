'use client'

import { useState } from "react";
import { CandidateLogin } from "./candidate-login";
import { EnterpriseLogin } from "./enterprise-login";

export default function SignIn() {
  const [selectType, setSelectType] = useState<"candidato" | "empresa">(
    "candidato"
  );

  const btn = (active: boolean) =>
    [
      "w-[120px] px-4 py-2 rounded-md transition-all flex items-center justify-center cursor-pointer",
      active
        ? "bg-green-600 text-white shadow-sm border-none"
        : "bg-white text-gray-800 border-neutral-300 hover:bg-gray-50",
    ].join(" ");

  return (
    <div className="w-full max-w-md flex flex-col gap-6">
      {/* Cabeçalho */}
      <div className="flex flex-col items-center text-center gap-2">
        <h1 className="font-bold text-2xl md:text-3xl text-gray-900">
          Continue sua jornada!
        </h1>
        <h2 className="font-medium text-lg md:text-xl text-gray-600">
          Seja bem-vindo novamente
        </h2>
      </div>
      <div className="flex items-center justify-center border shadow-md p-2 border-neutral-200 w-auto">
        <div
          aria-pressed={selectType === "candidato"}
          onClick={() => setSelectType("candidato")}
          className={btn(selectType === "candidato")}
        >
          Candidato
        </div>

        <div
          aria-pressed={selectType === "empresa"}
          onClick={() => setSelectType("empresa")}
          className={btn(selectType === "empresa")}
        >
          Empresa
        </div>
      </div>
      {selectType === "candidato" ? <CandidateLogin /> : <EnterpriseLogin />}
    </div>
  );
}
