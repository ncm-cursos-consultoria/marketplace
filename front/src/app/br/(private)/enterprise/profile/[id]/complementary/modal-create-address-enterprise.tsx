"use client";

import { Modal } from "@/components/modal";
import { UseUserEnteprise } from "@/context/user-enterprise.context";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import z from "zod";
import { api } from "@/service/api";
import { toast } from "sonner";

const createAddressEnterpriseFormSchema = z.object({
  country: z.string().min(1, "País é obrigatório"),
  state: z.string().min(1, "Estado é obrigatório"),
  city: z.string().min(1, "Cidade é obrigatória"),
  district: z.string().min(1, "Bairro é obrigatório"),
  zip: z.string(),
  street: z.string().min(1, "Rua é obrigatória"),
  number: z.string().min(1, "Número é obrigatório"),
  addressLine2: z.string().optional(),
});

type CreateAddressEnterpriseFormSchema = z.infer<
  typeof createAddressEnterpriseFormSchema
>;

export function ModalCreateAddressEnterprise() {
  const { userEnterprise } = UseUserEnteprise();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CreateAddressEnterpriseFormSchema>({
    resolver: zodResolver(createAddressEnterpriseFormSchema),
    defaultValues: {
      country: "BR",
      state: "",
      city: "",
      district: "",
      zip: "",
      street: "",
      number: "",
      addressLine2: "",
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: async (payload: CreateAddressEnterpriseFormSchema) => {
      const id = userEnterprise?.enterpriseId;
      if (!id) {
        throw new Error("ID da empresa não encontrado.");
      }
      const { data } = await api.patch(
        `/enterprise/${id}/address`,
        payload
      );
      return data;
    },
    onSuccess: () => {
      toast.success("Endereço salvo com sucesso!");
      window.location.reload();
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
    console.log(values);
    
    mutate(values);
  };

  return (
    <Modal
      title="Adicionar endereço"
      headerTitle="Registre seu endereço"
      className="bg-blue-600 hover:bg-blue-700 p-2 rounded-md text-white font-medium cursor-pointer"
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
          <Button
            type="button"
            variant="outline"
            onClick={() =>
              reset({
                country: "BR",
                state: "",
                city: "",
                district: "",
                zip: "",
                street: "",
                number: "",
                addressLine2: "",
              })
            }
          >
            Limpar
          </Button>
          <Button type="submit" disabled={isPending}>
            {isPending ? "Salvando..." : "Salvar endereço"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
