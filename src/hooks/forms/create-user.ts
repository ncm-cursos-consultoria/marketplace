import { useForm } from "react-hook-form";
import {
  createUserFormSchema,
  CreateUserFormSchema,
} from "../schemas/create-user-formschema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { postUser } from "@/service/user/post-user";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export function useCreateUser() {
  const router = useRouter()
  const form = useForm<CreateUserFormSchema>({
    resolver: zodResolver(createUserFormSchema),
  });

  const { mutate, isPending } = useMutation({
    mutationFn: (data: CreateUserFormSchema) => postUser(data),
    mutationKey: ["user"],
    onSuccess: () => {
      console.log("Sucesso");
      toast.success("Conta criada com sucesso")
      router.push(`/auth/sign-in`)
    },
    onError: () => {
      console.log("Erro");
      toast.success("Conta criada com sucesso")
      router.push(`/auth/sign-in`)
    },
  });

  const onSubmit = (data: CreateUserFormSchema) => {
    console.log('enviando dados de cadastro:',data);
    
    mutate(data);
  };

  return { form, isPending, onSubmit };
}
