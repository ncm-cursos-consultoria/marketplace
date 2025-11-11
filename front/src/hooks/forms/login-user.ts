import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { LoginFormSchema, loginFormSchema } from "../schemas/login-formschema";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { login } from "@/service/auth/login";
import { useRouter } from "next/navigation";
import { UseUserCandidate } from "@/context/user-candidate.context";
import { me } from "@/service/auth/me";

export function useLogin() {
  const router = useRouter();
  const { setUserCandidate } = UseUserCandidate();

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
        router.push(`/br/candidato/oportunidades/home/${userData.id}`);
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
  return { onSubmit, isPending: isProcessing, form };
}
