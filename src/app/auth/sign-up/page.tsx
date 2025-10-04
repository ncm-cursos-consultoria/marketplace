"use client";
import { useState } from "react";
import { CandidateSignUp } from "./candidate-signup";
import { EnterpriseCandidate } from "./enterprise-signup";

export default function SignUp() {
  const [selectType, setSelectType] = useState<"candidato" | "empresa">("candidato");

  const btn = (active: boolean) =>
    [
      "w-[120px] px-4 py-2 rounded-md transition-all flex items-center justify-center cursor-pointer",
      active
        ? "bg-green-600 text-white shadow-sm border-none"
        : "bg-white text-gray-800 border-neutral-300 hover:bg-gray-50",
    ].join(" ");

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white items-center shadow-lg rounded-xl p-6 md:p-8 flex flex-col gap-6">
        <div className="flex flex-col items-center text-center font-medium gap-1">
          <h1 className="text-2xl md:text-3xl font-bold">Seja Bem Vindo</h1>
          <h2 className="text-base md:text-lg text-gray-600">
            Crie sua conta no marketplace!
          </h2>
        </div>

        <div className="flex items-center border shadow-md p-2 border-neutral-200">
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

        {selectType === "candidato" ? <CandidateSignUp /> : <EnterpriseCandidate />}
      </div>
    </div>
  );
}
