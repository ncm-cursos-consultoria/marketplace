"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Loader2, CheckCircle2, XCircle } from "lucide-react";
import { unsubscribeEmail } from "@/service/user/unsubscribe-email";

// 1. Criamos um subcomponente para lidar com a lógica do e-mail
function UnsubscribeContent() {
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
            Não conseguimos processar o descadastro. Por favor, tente novamente mais tarde.
          </p>
        </div>
      )}
    </div>
  );
}

// 2. A página principal apenas envolve o conteúdo com Suspense
export default function UnsubscribePage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
      <Suspense fallback={
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-10 w-10 animate-spin text-blue-900" />
          <p className="text-slate-600 font-medium">Carregando...</p>
        </div>
      }>
        <UnsubscribeContent />
      </Suspense>
    </div>
  );
}