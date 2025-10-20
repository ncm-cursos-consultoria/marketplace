"use client";

import { JSX, useState } from "react";
import { CandidateLogin } from "./candidate-login";
import { EnterpriseLogin } from "./enterprise-login";
import PartnerLogin from "./partner-login";

type SelectType = "candidato" | "empresa" | "parceiro";

export default function SignIn() {
  const [selectType, setSelectType] = useState<SelectType>("candidato");

  const btn = (active: boolean) =>
    [
      "w-[320px] px-4 py-2 rounded-md transition-all flex items-center justify-center cursor-pointer",
      active
        ? "bg-green-600 text-white  shadow-sm border-none"
        : "bg-white text-gray-800  border border-neutral-300 hover:bg-gray-50",
    ].join(" ");

  const forms: Record<SelectType, JSX.Element> = {
    candidato: <CandidateLogin />,
    empresa: <EnterpriseLogin />,
    parceiro: <PartnerLogin />,
  };

  return (
    <div className="w-full max-w-md flex flex-col gap-6 items-center">
      <div className="flex flex-col items-center text-center gap-2">
        <h1 className="font-bold text-2xl md:text-3xl text-gray-900">
          Continue sua jornada!
        </h1>
        <h2 className="font-medium text-lg md:text-xl text-gray-600">
          Seja bem-vindo novamente
        </h2>
      </div>

      <div className="flex items-center justify-center border shadow-md p-2 border-neutral-500  gap-2 w-[600px]">
        <button
          type="button"
          aria-pressed={selectType === "candidato"}
          onClick={() => setSelectType("candidato")}
          className={btn(selectType === "candidato")}
        >
          Candidato
        </button>

        <button
          type="button"
          aria-pressed={selectType === "parceiro"}
          onClick={() => setSelectType("parceiro")}
          className={btn(selectType === "parceiro")} 
        >
          Prefeitura
        </button>

        <button
          type="button"
          aria-pressed={selectType === "empresa"}
          onClick={() => setSelectType("empresa")}
          className={btn(selectType === "empresa")}
        >
          Empresa
        </button>
      </div>

      {forms[selectType]}
    </div>
  );
}
