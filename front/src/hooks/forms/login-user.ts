import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { LoginFormSchema, loginFormSchema } from "../schemas/login-formschema";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { login } from "@/service/auth/login";
import { useRouter } from "next/navigation";
import { UseUserCandidate } from "@/context/user-candidate.context";

import { me } from "@/service/auth/me";

export function useLogin() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { setUserCandidate } = UseUserCandidate();

  const form = useForm<LoginFormSchema>({
    resolver: zodResolver(loginFormSchema),
  });

  const { mutate, isPending } = useMutation({
    mutationFn: (data: LoginFormSchema) => login(data),
    mutationKey: ["authUser"],
    onSuccess: async () => {
      const userData = await queryClient.fetchQuery({
        queryKey: ["authUser"],
        queryFn: me,
      });
      if (userData?.id) {
        setUserCandidate(userData);
        router.push(`/br/candidato/oportunidades/home/${userData.id}`);
      } else {
        console.error("Erro ao carregar dados do usuário");
      }
    },
  });

  const onSubmit = async (data: LoginFormSchema) => {
    mutate(data);
  };

  return { onSubmit, isPending, form };
}
