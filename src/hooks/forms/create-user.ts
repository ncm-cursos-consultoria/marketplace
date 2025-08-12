import { useForm } from "react-hook-form";
import {
  createUserFormSchema,
  CreateUserFormSchema,
} from "../schemas/create-user-formschema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { postUser } from "@/service/user/post-user";

export function useCreateUser() {
  const form = useForm<CreateUserFormSchema>({
    resolver: zodResolver(createUserFormSchema),
  });

  const { mutate, isPending } = useMutation({
    mutationFn: (data: CreateUserFormSchema) => postUser(data),
    mutationKey: ["user"],
    onSuccess: () => {
      console.log("Sucesso");
    },
    onError: () => {
      console.log("Erro");
    },
  });

  const onSubmit = (data: CreateUserFormSchema) => {
    console.log('enviando dados de cadastro:',data);
    
    mutate(data);
  };

  return { form, isPending, onSubmit };
}
