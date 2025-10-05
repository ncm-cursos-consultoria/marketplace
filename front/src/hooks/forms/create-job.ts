import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  CreateJobFormSchema,
  createJobFormSchema,
} from "../schemas/create-job";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postJob } from "@/service/job/post.job";

export function useCreateJob() {
  const queryClient = useQueryClient();
  const form = useForm<CreateJobFormSchema>({
    resolver: zodResolver(createJobFormSchema),
  });

  const { mutate, isPending, error, isError } = useMutation({
    mutationFn: (data: CreateJobFormSchema) => postJob(data),
    mutationKey: ["job"],
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["job"] });
    },
  });

  const onSubmit = async (data: CreateJobFormSchema) => {
    mutate(data);
  };

  return { onSubmit, form, isPending, error, isError };
}
