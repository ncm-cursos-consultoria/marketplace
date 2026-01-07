import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { CreateCourseFormSchema, createCourseFormSchema } from "../schemas/create-course-formschema";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createCourse } from "@/service/course/create-course";

export function useCreateCourse(moduleId: string) {
  const queryClient = useQueryClient();
  const form = useForm<CreateCourseFormSchema>({
    resolver: zodResolver(createCourseFormSchema)
  });

  const { mutate, isPending } = useMutation({
    // AJUSTE: O tipo aqui deve aceitar o moduleId junto com os dados do form
    mutationFn: (data: CreateCourseFormSchema & { moduleId: string }) => createCourse(data),
    mutationKey: ['course'],
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['course'] });
      form.reset(); // Dica: limpa o form após sucesso
    }
  });

  const onSubmit = async (data: CreateCourseFormSchema) => {
    // Agora o mutate reconhecerá que este payload é válido
    mutate({
      ...data,
      moduleId: moduleId
    });
  };

  return { onSubmit, isPending, form };
}