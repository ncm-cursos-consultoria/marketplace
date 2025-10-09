import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { LoginFormSchema, loginFormSchema } from "../schemas/login-formschema";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { login } from "@/service/auth/login";
import { useRouter } from "next/navigation";
import { UseUserEnteprise } from "@/context/user-enterprise.context";
import { me } from "@/service/auth/me";

export function useLoginEnterprise() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { setUserEnterprise } = UseUserEnteprise();

  const form = useForm<LoginFormSchema>({
    resolver: zodResolver(loginFormSchema),
  });

  const { mutate, isPending } = useMutation({
    mutationFn: (data: LoginFormSchema) => login(data),
    mutationKey: ["enterprise-user"],
    onSuccess: async () => {
      const userData = await queryClient.fetchQuery({
        queryKey: ["authUser"],
        queryFn: me,
      });
      if (userData?.id) {
        setUserEnterprise(userData);
        router.push(`/br/enterprise/${userData.id}`);
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
