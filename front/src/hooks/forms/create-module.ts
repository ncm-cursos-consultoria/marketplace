import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  CreateModuleFormSchema,
  createModuleFormSchema,
} from "../schemas/create-module-formschema";
import { useParams } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postModule } from "@/service/module/post-module";
import { UseUserEnteprise } from "@/context/user-enterprise.context";

export function useCreateModule() {
  const {userEnterprise} = UseUserEnteprise()
  const queryClient = useQueryClient()
  const params = useParams<{ id: string }>();
  const enterpriseId = userEnterprise?.enterpriseId ?? null;
  const id = params?.id;
  const form = useForm<CreateModuleFormSchema>({
    resolver: zodResolver(createModuleFormSchema),
    defaultValues: {
      enterpriseId: id,
    },
  });

  const { mutate, isPending, error, isError } = useMutation({
    mutationFn: (data: CreateModuleFormSchema) => postModule(data),
    mutationKey: ['module'],
    onSuccess: () => {
      queryClient.invalidateQueries({ 
        queryKey: ['module', enterpriseId],
        exact: true 
      });
      form.reset()
    }
  });

  const onSubmit = async (data: CreateModuleFormSchema) => {
    mutate(data);
  };

  return { onSubmit, isPending, form, error, isError };
}
