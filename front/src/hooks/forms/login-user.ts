import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { LoginFormSchema, loginFormSchema } from "../schemas/login-formschema";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { login } from "@/service/auth/login";
import { useRouter } from "next/navigation";
import { UseUserCandidate } from "@/context/user-candidate.context";
import { me } from "@/service/auth/me";

// Destinos permitidos após o login (lista fechada, evita redirecionamento aberto)
function getPostLoginPath(userId: string): string {
  const redirect =
    typeof window !== "undefined"
      ? new URLSearchParams(window.location.search).get("redirect")
      : null;

  if (redirect === "upgrade") {
    return `/br/candidato/oportunidades/perfil/${userId}?upgrade=true`;
  }
  return `/br/candidato/oportunidades/home/${userId}`;
}

export function useLogin() {
  const [hasCookieConsent, setHasCookieConsent] = useState(false);
  
    useEffect(() => {
      // Checa o consentimento inicial
      const checkConsent = () => {
        setHasCookieConsent(localStorage.getItem('ncm_cookie_consent') === 'true');
      };
      
      checkConsent();
      // Ouve o evento do banner
      window.addEventListener("cookieConsentChanged", checkConsent);
      return () => window.removeEventListener("cookieConsentChanged", checkConsent);
    }, []);
  const router = useRouter();
  const { userCandidate, setUserCandidate } = UseUserCandidate();

  // Candidato que já está logado e chegou pelo link do e-mail: vai direto ao pagamento
  useEffect(() => {
    if (!userCandidate?.id) return;
    const redirect = new URLSearchParams(window.location.search).get("redirect");
    if (redirect === "upgrade") {
      router.replace(getPostLoginPath(userCandidate.id));
    }
  }, [userCandidate?.id, router]);

  const form = useForm<LoginFormSchema>({
    resolver: zodResolver(loginFormSchema),
  });
  const { setError } = form;
  const [isProcessing, setIsProcessing] = useState(false);

  const { mutateAsync: loginMutation } = useMutation({
    mutationFn: (data: LoginFormSchema) => login(data),
  });

  const onSubmit = async (data: LoginFormSchema) => {
    setIsProcessing(true);

    try {
      await loginMutation(data);

      const userData = await me();

      if (userData?.id) {
        if (userData?.type !== "CANDIDATE") {
          throw new Error("Tipo de usuário inválido para esta área.");
        }
        setUserCandidate(userData);
        toast.success("Login efetuado com sucesso!");
        router.push(getPostLoginPath(userData.id));
      } else {
        throw new Error("Dados do usuário não encontrados após o login.");
      }
    } catch (error) {
      console.error("Falha no login:", error);
      setError("root", {
        message: "Email ou senha inválidos. Por favor, tente novamente.",
      });
      setIsProcessing(false);
    }
  };
  return { 
    onSubmit, 
    isPending: isProcessing, 
    form,
    isButtonDisabled: !hasCookieConsent || isProcessing
  };
}

