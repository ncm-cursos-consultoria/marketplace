import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { LoginFormSchema, loginFormSchema } from "../schemas/login-formschema";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { login } from "@/service/auth/login";
import { useRouter } from "next/navigation";
import { UseUserMentor } from "@/context/user-mentor.context";
import { me } from "@/service/auth/me";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export function useLoginMentor() {
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
  const { setUserMentor } = UseUserMentor();
  const queryClient = useQueryClient();

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
        if (userData?.type !== "MENTOR") {
          throw new Error("Tipo de usuário inválido para esta área.");
        }
        setUserMentor(userData);
        toast.success("Login efetuado com sucesso!");
        router.push(`/br/mentor/${userData.id}`);
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
