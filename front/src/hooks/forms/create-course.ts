import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { CreateCourseFormSchema, createCourseFormSchema } from "../schemas/create-course-formschema";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createCourse } from "@/service/course/create-course";

export function useCreateCourse(moduleId: string) {
  const queryClient = useQueryClient()
  const form = useForm<CreateCourseFormSchema>({
    resolver: zodResolver(createCourseFormSchema)
  })

  const {mutate, isPending} = useMutation({
    mutationFn: (data: CreateCourseFormSchema) => createCourse(data),
    mutationKey: ['course'],
    onSuccess: () => {
      window.location.reload()
      queryClient.invalidateQueries({queryKey: ['course']})
    }
  })

  const onSubmit = async(data: CreateCourseFormSchema) => {
    const payload = {
      ...data,
      moduleId: moduleId
    }
    console.log(payload);
    
    mutate(payload)
  }

  return{onSubmit, isPending, form}
}