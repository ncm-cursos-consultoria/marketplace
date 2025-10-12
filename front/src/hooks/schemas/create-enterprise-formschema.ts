import z from "zod";

export const createEnterpriseFormSchema = z.object({
  legalName: z.string().nonempty("Razão social é obrigatória"),
  tradeName: z.string().nonempty("Nome fantasia é obrigatório"),
  cnpj: z.string().nonempty("CNPJ não pode ser vazio"),
  email: z.string().email().nonempty("Obrigatório"),
  password: z.string().nonempty("Obrigatório").min(8, "Mínimo 8 caractéres para senha"),
});

export type CreateEnterpriseFormSchema = z.infer<typeof createEnterpriseFormSchema>;
