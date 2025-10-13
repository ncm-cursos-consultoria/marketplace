"use client";
import { useState } from "react";
import { CandidateSignUp } from "./candidate-signup";
import { EnterpriseCandidate } from "./enterprise-signup";
import { PartnerSignUp } from "./partner-singup";

export default function SignUp() {
  const [selectType, setSelectType] = useState<"candidato" | "empresa" | "prefeitura">(
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
    <div className="flex justify-center items-center min-h-screen">
      <div className="items-center shadow-lg rounded-xl p-6 md:p-8 flex flex-col gap-6">
        <div className="flex flex-col items-center text-center font-medium gap-1">
          <h1 className="text-2xl md:text-3xl font-bold">Seja Bem Vindo</h1>
          <h2 className="text-base md:text-lg text-gray-600">
            Crie sua conta no marketplace!
          </h2>
        </div>

        <div className="flex items-center border shadow-md p-2 border-neutral-200 gap-2 rounded-lg">
          <div
            role="button"
            aria-pressed={selectType === "candidato"}
            onClick={() => setSelectType("candidato")}
            className={btn(selectType === "candidato")}
          >
            Candidato
          </div>

          <div
            role="button"
            aria-pressed={selectType === "prefeitura"}
            onClick={() => setSelectType("prefeitura")}
            className={btn(selectType === "prefeitura")}
          >
            Parceiro
          </div>

          <div
            role="button"
            aria-pressed={selectType === "empresa"}
            onClick={() => setSelectType("empresa")}
            className={btn(selectType === "empresa")}
          >
            Empresa
          </div>
        </div>

        {selectType === "candidato" && <CandidateSignUp />}
        {selectType === "prefeitura" && <PartnerSignUp />}
        {selectType === "empresa" && <EnterpriseCandidate />}
      </div>
    </div>
  );
}
