import z from "zod";

export const createUserFormSchema = z.object({
  nome: z.string().nonempty("Obrigatório"),
  email: z.string().email().nonempty("Obrigatório"),
  senha: z.string().nonempty("Obrigatório"),
  tipo: z.string().nonempty("Obrigatório"),
})

export type CreateUserFormSchema = z.infer<typeof createUserFormSchema>