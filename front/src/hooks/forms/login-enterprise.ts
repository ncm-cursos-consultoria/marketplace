import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { LoginFormSchema, loginFormSchema } from "../schemas/login-formschema";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { login } from "@/service/auth/login";
import { useRouter } from "next/navigation";
import { UseUserEnteprise } from "@/context/user-enterprise.context";

export function useLoginEnterprise() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const {userEnterprise} = UseUserEnteprise()
  
  const form = useForm<LoginFormSchema>({
    resolver: zodResolver(loginFormSchema),
  });

  const { mutate, isPending } = useMutation({
    mutationFn: (data: LoginFormSchema) => login(data),
    mutationKey: ["enterprise-user"],
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["enterprise-user"] });
      setTimeout(() => {
        router.push(`/enterprise/${userEnterprise?.enterpriseId}`)
      })
    },
  });

  const onSubmit = async (data: LoginFormSchema) => {
    mutate(data);
  };

  return { onSubmit, isPending, form };
}