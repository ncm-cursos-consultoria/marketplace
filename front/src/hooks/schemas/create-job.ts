import z from "zod";

export const createJobFormSchema = z.object({
  title: z.string(),
  salary: z.number(),
  description: z.string(),
  country: z.string(),
  state: z.string(),
  city: z.string(),
  workModel: z.string(),
  enterpriseId: z.string()
})

export type CreateJobFormSchema = z.infer<typeof createJobFormSchema>