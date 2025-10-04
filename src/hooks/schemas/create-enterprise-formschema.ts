import z from "zod";

export const createEnterpriseFormSchema = z.object({
  legalName: z.string().nonempty(),
  tradeName: z.string(),
  cnpj: z.string(),
  email: z.string(),
  password: z.string()
})

export type CreateEnterpriseFormSchema = z.infer<typeof createEnterpriseFormSchema>