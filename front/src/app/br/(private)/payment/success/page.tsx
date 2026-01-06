"use client";
import { useEffect } from "react";

export default function PaymentSuccessPage() {
  useEffect(() => {
    // Avisa a aba principal (opcional) e fecha a janela
    setTimeout(() => {
      window.close();
    }, 2000);
  }, []);

  return (
    <div className="h-screen grid place-items-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-emerald-600">Pagamento Confirmado!</h1>
        <p className="text-slate-500">Esta janela fechará automaticamente...</p>
      </div>
    </div>
  );
}