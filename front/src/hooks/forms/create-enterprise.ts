import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { CreateEnterpriseFormSchema, createEnterpriseFormSchema } from "../schemas/create-enterprise-formschema";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postEnterprise } from "@/service/enterprise/post-enterprise";
import { useRouter } from "next/navigation";

export function useCreateEnterprise() {
  const router = useRouter()
  const queryClient = useQueryClient()
  const form = useForm<CreateEnterpriseFormSchema>({
    resolver: zodResolver(createEnterpriseFormSchema)
  })

  const {mutate, isPending, error, isError} = useMutation({
    mutationFn: (data: CreateEnterpriseFormSchema) => postEnterprise(data),
    mutationKey: ['auth-enterprise'],
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey:['auth-enterprise']})
      router.push('/br/auth/sign-in')
    }
  })

  const onSubmit = async(data: CreateEnterpriseFormSchema) => {
    console.log(data);
    mutate(data)
  }

  return{onSubmit, isPending, form, error, isError}
}  