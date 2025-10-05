import z from "zod";

export const loginFormSchema = z.object({
  email: z.string().nonempty("Email é obrigatório").email("Insira um email válido"),
  password: z.string().nonempty("Senha é obrigatório")
})

export type LoginFormSchema = z.infer<typeof loginFormSchema>