"use client";

import { XCircle, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function PaymentFailedPage() {
    const router = useRouter();

    return (
        <div className="h-screen w-full flex flex-col items-center justify-center bg-slate-50 p-6">
            <div className="max-w-md w-full bg-white p-8 rounded-3xl shadow-xl shadow-slate-200/50 text-center space-y-6 animate-in zoom-in duration-300">

                <div className="flex justify-center">
                    <div className="p-4 bg-red-50 rounded-full">
                        <XCircle className="h-16 w-16 text-red-500" />
                    </div>
                </div>

                <div className="space-y-2">
                    <h1 className="text-2xl font-black text-slate-900">Ops! Algo deu errado</h1>
                    <p className="text-slate-500 text-sm leading-relaxed">
                        Não foi possível processar o seu pagamento neste momento.
                        Verifique os dados do seu cartão ou tente uma forma de pagamento diferente.
                    </p>
                </div>

                <div className="pt-4 space-y-3">
                    <Button
                        onClick={() => window.close()}
                        className="w-full bg-slate-900 hover:bg-slate-800 text-white rounded-2xl h-12 font-bold"
                    >
                        Fechar esta janela
                    </Button>
                </div>
            </div>

            <p className="mt-8 text-xs text-slate-400 font-medium uppercase tracking-widest">
                NCM Marketplace • Pagamento Seguro
            </p>
        </div>
    );
}