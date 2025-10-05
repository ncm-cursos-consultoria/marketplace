import z from "zod";

export const createUserFormSchema = z.object({
  firstName: z.string().nonempty("Nome é obrigatório"),
  lastName: z.string().nonempty("Sobrenome é obrigatório"),
  cpf: z.string().nonempty("cpf não pode ser vazio"),
  email: z.string().email().nonempty("Obrigatório"),
  password: z.string().nonempty("Obrigatório"),
  birthDate: z.string().nonempty("Data de nascimento é obrigatório")
})

export type CreateUserFormSchema = z.infer<typeof createUserFormSchema>