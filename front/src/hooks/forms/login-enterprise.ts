import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { LoginFormSchema, loginFormSchema } from "../schemas/login-formschema";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { login } from "@/service/auth/login";
import { useRouter } from "next/navigation";
import { UseUserEnteprise } from "@/context/user-enterprise.context";
import { me } from "@/service/auth/me";
import { useState } from "react";
import { toast } from "sonner";

export function useLoginEnterprise() {
  const router = useRouter();
    const { setUserEnterprise } = UseUserEnteprise();
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
          setUserEnterprise(userData);
          toast.success("Login efetuado com sucesso!");
          router.push(`/br/enterprise/${userData.id}`);
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
  