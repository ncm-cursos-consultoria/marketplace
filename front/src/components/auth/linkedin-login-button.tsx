import { Linkedin } from "lucide-react";

const CLIENT_ID = process.env.NEXT_PUBLIC_LINKEDIN_CLIENT_ID;
const FRONTEND_URL = process.env.NEXT_PUBLIC_FRONTEND_URL;
const REDIRECT_URI = encodeURIComponent(`${FRONTEND_URL}/br/auth/callback/linkedin`);
const SCOPE = encodeURIComponent("openid profile email");

export const LINKEDIN_AUTH_URL = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&scope=${SCOPE}`;

export function LinkedInButton() {
    const handleLinkedInLogin = () => {
        const width = 600;
        const height = 600;
        const left = window.screen.width / 2 - width / 2;
        const top = window.screen.height / 2 - height / 2;

        // Abre em uma janela popup centralizada
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