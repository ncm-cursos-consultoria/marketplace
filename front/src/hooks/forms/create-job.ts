import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type SubmitHandler } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postJob } from "@/service/job/post.job";
import { UseUserEnteprise } from "@/context/user-enterprise.context";
import {
  createJobFormSchema,
  type CreateJobFormSchema,
} from "../schemas/create-job";
import { useParams } from "next/navigation";
import { toast } from "sonner";

export function useCreateJob() {
  const params = useParams<{ id: string }>();
  const id = params?.id;
  const { userEnterprise } = UseUserEnteprise();
  const enterpriseId = userEnterprise?.enterpriseId ?? id;

  
  const queryClient = useQueryClient();

  const form = useForm<CreateJobFormSchema>({
    resolver: zodResolver(createJobFormSchema)
  });

  const { mutate, isPending, error, isError } = useMutation({
    mutationFn: (data: CreateJobFormSchema) => postJob(data),
    mutationKey: ["job"],
    onSuccess: () => {
      queryClient.invalidateQueries({ 
        queryKey: ["job", enterpriseId] 
      });
      toast.success("Sucesso ao criar nova vaga")
      window.location.reload()
      form.reset();
    },
    onError: (err: any) => {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "Erro ao criar vaga.";
      toast.error(msg);
    }
  });

  const onSubmit: SubmitHandler<CreateJobFormSchema> = (data) => {
    const payload = {
      ...data,
      enterpriseId: enterpriseId
    }
    console.log(payload);
    
    mutate(payload);
  };

  return { onSubmit, form, isPending, error, isError };
}
