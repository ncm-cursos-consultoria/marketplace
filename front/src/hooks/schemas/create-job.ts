import z from "zod";

export const createJobFormSchema = z.object({
  title: z.string(),
  salary: z.number(),
  description: z.string(),
})

export type CreateJobFormSchema = z.infer<typeof createJobFormSchema>