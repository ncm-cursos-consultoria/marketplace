"use client";

import { Modal } from "@/components/modal";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import z from "zod";
import { api } from "@/service/api";
import { toast } from "sonner";
import { ReactNode, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

const createAddressEnterpriseFormSchema = z.object({
  country: z.string().min(1, "País é obrigatório"),
  state: z.string().min(1, "Estado é obrigatório"),
  city: z.string().min(1, "Cidade é obrigatória"),
  district: z.string().min(1, "Bairro é obrigatório"),
  zip: z.string().min(1, "CEP é obrigatório"),
  street: z.string().min(1, "Rua é obrigatória"),
  number: z.string().min(1, "Número é obrigatório"),
  addressLine2: z.string().optional(),
});

type CreateAddressEnterpriseFormSchema = z.infer<
  typeof createAddressEnterpriseFormSchema
>;

interface ModalCreateAddressEnterpriseProps {
  enterpriseId: string;
  existingAddress: any | null | undefined;
  hasAddress: boolean;
}

// 3. Receba as props na assinatura da função
export function ModalCreateAddressEnterprise({
  enterpriseId,
  existingAddress,
  hasAddress,
}: ModalCreateAddressEnterpriseProps) {
  const [isOpen, setIsOpen] = useState(false);
  const isEditing = !!existingAddress;
  const queryClient = useQueryClient(); // Para invalidar o cache

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CreateAddressEnterpriseFormSchema>({
    resolver: zodResolver(createAddressEnterpriseFormSchema),
    // 5. Preencha os valores padrão com o endereço existente
    // defaultValues: {
    //   country: existingAddress?.country || "BR",
    //   state: existingAddress?.state || "",
    //   city: existingAddress?.city || "",
    //   district: existingAddress?.district || "",
    //   zip: existingAddress?.zip || "",
    //   street: existingAddress?.street || "",
    //   number: existingAddress?.number || "",
    //   addressLine2: existingAddress?.addressLine2 || "",
    // },
  });

  // 6. Reseta o formulário se os dados mudarem (ex: usuário clica em outro item)
  useEffect(() => {
    if (isOpen && existingAddress) {
      reset({
        country: existingAddress.country || "BR",
        state: existingAddress.state || "",
        city: existingAddress.city || "",
        district: existingAddress.district || "",
        zip: existingAddress.zip || "",
        street: existingAddress.street || "",
        number: existingAddress.number || "",
        addressLine2: existingAddress.addressLine2 || "",
      });
    } else {
      // Garante que o form esteja limpo se for criação
      reset({
        country: "BR",
        state: "",
        city: "",
        district: "",
        zip: "",
        street: "",
        number: "",
        addressLine2: "",
      });
    }
  }, [existingAddress, isOpen, reset]);

  const { mutate, isPending } = useMutation({
    mutationFn: async (payload: CreateAddressEnterpriseFormSchema) => {
      // 7. A lógica de 'id' agora usa a prop 'enterpriseId'
      if (!enterpriseId) {
        throw new Error("ID da empresa não encontrado.");
      }
      const { data } = await api.patch(
        `/enterprise/${enterpriseId}/address`,
        payload
      );
      return data;
    },
    onSuccess: () => {
      toast.success("Endereço salvo com sucesso!");
      // 8. Invalida as queries para forçar a atualização dos dados na página
      queryClient.invalidateQueries({ queryKey: ["enterprise-profile", enterpriseId] });
      queryClient.invalidateQueries({ queryKey: ["address", existingAddress?.id] });
      setIsOpen(false);
    },
    onError: (err: any) => {
      console.log(err);

      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "Erro ao salvar endereço.";
      toast.error(msg);
    },
  });

  const onSubmit = (values: CreateAddressEnterpriseFormSchema) => {
    mutate(values);
  };

  return (
    <Modal
      title={isEditing ? "Atualize seu endereço" : "Registre seu endereço"}
      headerTitle={isEditing ? "Editar endereço" : "Adicionar endereço"} // Texto do botão
      className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500" // Estilo do botão
      isOpen={isOpen}
      setIsOpen={setIsOpen}
    >
      <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="country">País</Label>
            <Input id="country" placeholder="BR" {...register("country")} />
            {errors.country && (
              <span className="text-sm text-red-600">
                {errors.country.message}
              </span>
            )}
          </div>

          <div>
            <Label htmlFor="state">Estado</Label>
            <Input id="state" placeholder="SP" {...register("state")} />
            {errors.state && (
              <span className="text-sm text-red-600">
                {errors.state.message}
              </span>
            )}
          </div>

          <div>
            <Label htmlFor="city">Cidade</Label>
            <Input id="city" placeholder="São Paulo" {...register("city")} />
            {errors.city && (
              <span className="text-sm text-red-600">
                {errors.city.message}
              </span>
            )}
          </div>

          <div>
            <Label htmlFor="district">Bairro</Label>
            <Input id="district" placeholder="Sacomã" {...register("district")} />
            {errors.district && (
              <span className="text-sm text-red-600">
                {errors.district.message}
              </span>
            )}
          </div>

          <div>
            <Label htmlFor="zip">CEP/ZIP</Label>
            <Input id="zip" placeholder="04180-000" {...register("zip")} />
            {errors.zip && (
              <span className="text-sm text-red-600">{errors.zip.message}</span>
            )}
          </div>

          <div>
            <Label htmlFor="street">Rua</Label>
            <Input id="street" placeholder="Rua Exemplo" {...register("street")} />
            {errors.street && (
              <span className="text-sm text-red-600">
                {errors.street.message}
              </span>
            )}
          </div>

          <div>
            <Label htmlFor="number">Número</Label>
            <Input id="number" placeholder="123" {...register("number")} />
            {errors.number && (
              <span className="text-sm text-red-600">
                {errors.number.message}
              </span>
            )}
          </div>

          <div>
            <Label htmlFor="addressLine2">Complemento</Label>
            <Input
              id="addressLine2"
              placeholder="Apto / Bloco / Referência"
              {...register("addressLine2")}
            />
            {errors.addressLine2 && (
              <span className="text-sm text-red-600">
                {errors.addressLine2.message}
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-2">
          {/* O botão 'Limpar' agora reseta para os valores atuais (existentes ou padrão) */}
          <Button
            type="button"
            variant="outline"
            onClick={() => reset()}
          >
            Resetar
          </Button>
          <Button type="submit" disabled={isPending}>
            {isPending ? "Salvando..." : "Salvar endereço"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
