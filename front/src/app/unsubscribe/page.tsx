"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Loader2, CheckCircle2, XCircle } from "lucide-react";
import { unsubscribeEmail } from "@/service/user/unsubscribe-email";

export default function UnsubscribePage() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email");
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");

  useEffect(() => {
    if (email) {
      unsubscribeEmail(email)
        .then(() => setStatus("success"))
        .catch(() => setStatus("error"));
    } else {
      setStatus("error");
    }
  }, [email]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
      <div className="max-w-md w-full bg-white rounded-3xl p-10 shadow-sm text-center">
        {status === "loading" && (
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-10 w-10 animate-spin text-blue-900" />
            <p className="text-slate-600 font-medium">Processando seu pedido...</p>
          </div>
        )}

        {status === "success" && (
          <div className="space-y-4">
            <CheckCircle2 className="h-12 w-12 text-emerald-500 mx-auto" />
            <h1 className="text-2xl font-bold text-slate-900">E-mail removido!</h1>
            <p className="text-slate-500">
              Você não receberá mais comunicações promocionais de <strong>{email}</strong>.
            </p>
            <a href="/" className="inline-block mt-4 text-blue-900 font-bold hover:underline">
              Voltar para o site
            </a>
          </div>
        )}

        {status === "error" && (
          <div className="space-y-4">
            <XCircle className="h-12 w-12 text-red-500 mx-auto" />
            <h1 className="text-2xl font-bold text-slate-900">Ops! Algo deu errado.</h1>
            <p className="text-slate-500">
              Não conseguimos processar o descadastro. Por favor, tente novamente mais tarde ou contate o suporte.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}