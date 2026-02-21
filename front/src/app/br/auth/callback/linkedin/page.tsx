"use client";

import { useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { api } from "@/service/api";

// 1. Criamos um componente interno para gerenciar a lógica dos params
function LinkedInCallbackContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const code = searchParams.get("code");

    useEffect(() => {
        const handleLinkedInAuth = async (authCode: string) => {
            try {
                // Enviamos o código para o seu backend Java
                const response = await api.post("/auth/linkedin", { token: authCode });

                if (window.opener) {
                    // Se for popup, avisa a janela pai e fecha
                    window.opener.postMessage({ type: "LINKEDIN_AUTH_SUCCESS", data: response.data }, window.location.origin);
                    window.close();
                } else {
                    // Fluxo normal de redirecionamento
                    if (response.data.needsRegistration) {
                        sessionStorage.setItem("linkedin_user", JSON.stringify(response.data));
                        router.push("/br/auth/complete-register");
                    } else {
                        router.push(`/br/candidato/oportunidades/home/${response.data.id}`);
                    }
                }
            } catch (error) {
                toast.error("Erro ao autenticar com LinkedIn.");
                router.push("/br/auth/sign-in");
            }
        };

        if (code) {
            handleLinkedInAuth(code);
        }
    }, [code, router]);

    return (
        <div className="min-h-screen flex flex-col items-center justify-center gap-4">
            <Loader2 className="h-8 w-8 animate-spin text-blue-900" />
            <p className="text-slate-600 font-medium">Autenticando com LinkedIn...</p>
        </div>
    );
}

// 2. O componente principal da página envolve o conteúdo em um Suspense Boundary
export default function LinkedInCallbackPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex flex-col items-center justify-center gap-4">
                <Loader2 className="h-8 w-8 animate-spin text-blue-900" />
                <p className="text-slate-600 font-medium">Carregando autenticação...</p>
            </div>
        }>
            <LinkedInCallbackContent />
        </Suspense>
    );
}