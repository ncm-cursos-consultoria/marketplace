import { postPartner } from "@/service/partner/post-partner";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

export const partnerSchema = z
  .object({
    isSubsidized: z.boolean(),
    subsidizedEndDate: z.string(),
    legalName: z.string().min(1, "Razão social é obrigatória"),
    tradeName: z.string().min(1, "Nome fantasia é obrigatório"),
    cnpj: z
      .string()
      .transform((v) => v.replace(/\D/g, "")) 
      .refine((v) => /^\d{14}$/.test(v), {
        message: "CNPJ deve conter 14 dígitos (apenas números).",
      }),
    email: z.string().email("E-mail inválido"),
    birthday: z.string().nonempty("Obrigatório"),
    password: z.string().min(8, "Senha deve ter ao menos 8 caracteres"),
  })

export type PartnerSchema = z.infer<typeof partnerSchema>;

export function useCreatePartner() {
  const router = useRouter()

  const form = useForm<PartnerSchema>({
    resolver: zodResolver(partnerSchema),
    defaultValues: {
      isSubsidized: true
    }
  })

  const {mutate, isPending} = useMutation({
    mutationFn: (data: PartnerSchema) => postPartner(data),
    mutationKey: ['partner'],
    onSuccess: () => {
      toast.success("Sucesso ao criar parceiro")
      router.push("/br/auth/sign-in")
    },
    onError: () => {
      toast.error("Erro ao criar parceiro")
    }
  })

  const onSubmit = async(data: PartnerSchema) => {
    mutate(data)
  }

  return {onSubmit, form, isPending}
}