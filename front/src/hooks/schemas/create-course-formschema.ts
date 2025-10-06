import z from "zod";

export const createCourseFormSchema = z.object({
  title: z.string(),
  description: z.string(),
  videoUrl: z.string()
})

export type CreateCourseFormSchema = z.infer<typeof createCourseFormSchema>