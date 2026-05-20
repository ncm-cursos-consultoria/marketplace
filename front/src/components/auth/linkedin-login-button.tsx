"use client";

import { Linkedin } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";

const CLIENT_ID = process.env.NEXT_PUBLIC_LINKEDIN_CLIENT_ID;
const FRONTEND_URL = process.env.NEXT_PUBLIC_FRONTEND_URL;
const REDIRECT_URI = encodeURIComponent(`${FRONTEND_URL}/br/auth/callback/linkedin`);
const SCOPE = encodeURIComponent("openid profile email");

export const LINKEDIN_AUTH_URL = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&scope=${SCOPE}`;

export function LinkedInButton() {
    const router = useRouter();
    const queryClient = useQueryClient();

    useEffect(() => {
        const handleMessage = (event: MessageEvent) => {
            if (event.origin !== window.location.origin) return;
            if (event.data?.type !== "LINKEDIN_AUTH_SUCCESS") return;

            const data = event.data.data;

            // Invalida o cache para forçar busca imediata dos dados do usuário
            queryClient.invalidateQueries({ queryKey: ["authUser"] });

            if (data.needsRegistration) {
                sessionStorage.setItem("linkedin_user", JSON.stringify(data));
                router.push("/br/auth/complete-register");
            } else {
                router.push(`/br/candidato/oportunidades/home/${data.id}`);
            }
        };

        window.addEventListener("message", handleMessage);
        return () => window.removeEventListener("message", handleMessage);
    }, [router, queryClient]);

    const handleLinkedInLogin = () => {
        const width = 600;
        const height = 600;
        const left = window.screen.width / 2 - width / 2;
        const top = window.screen.height / 2 - height / 2;

        window.open(
            LINKEDIN_AUTH_URL,
            "LinkedIn Login",
            `width=${width},height=${height},top=${top},left=${left},scrollbars=yes,resizable=yes`
        );
    };

    return (
        <button
            type="button"
            onClick={handleLinkedInLogin}
            className="flex items-center justify-center gap-3 w-full p-4 border border-slate-200 rounded-xl font-semibold text-slate-700 hover:bg-slate-50 transition-all mb-4"
        >
            <Linkedin className="h-5 w-5 text-[#0077b5]" />
            Entrar com LinkedIn
        </button>
    );
}