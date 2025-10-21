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

type SetOpenCallback = (isOpen: boolean) => void;

export function useCreateJob(
  setIsOpen: SetOpenCallback,
  onSuccessCallback?: () => void // <--- AQUI
) {
  const params = useParams(); // Sem o tipo genérico
  const { userEnterprise } = UseUserEnteprise();
  const enterpriseId = userEnterprise?.enterpriseId ?? (params.id as string);


  const queryClient = useQueryClient();

  const form = useForm({
    resolver: zodResolver(createJobFormSchema),
    defaultValues: {
      tagIds: [],
      salary: 0 // Adicione isso para garantir
    }
  });

  const { mutate, isPending, error, isError } = useMutation({
    mutationFn: (data: CreateJobFormSchema) => postJob(data),
    mutationKey: ["job"],
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["enterpriseJobs", enterpriseId], // <--- MUDANÇA
      });

      toast.success("Sucesso ao criar nova vaga");
      setIsOpen(false);
      form.reset();

      if (onSuccessCallback) {
        onSuccessCallback(); // <--- AQUI
      }
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

    mutate(payload);
  };

  return { onSubmit, form, isPending, error, isError };
}
