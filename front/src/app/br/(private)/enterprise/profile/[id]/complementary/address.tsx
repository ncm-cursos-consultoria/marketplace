"use client";

import { Card } from "@/components/enterprise/profile/card";
import { CardHeader } from "@/components/enterprise/profile/card-header";
import { Field } from "@/components/enterprise/profile/field";
import { ModalCreateAddressEnterprise } from "./modal-create-address-enterprise";
import { ApiAddress } from "@/types/address";

// 2. Defina o "Contrato" (Props) que este componente aceita
interface AddressEnterpriseProps {
  address: ApiAddress | null | undefined; // Permite que o endereço seja nulo
  enterpriseId: string;
}

// 3. Receba as props na assinatura da função
export function AddressEnterprise({ address, enterpriseId }: AddressEnterpriseProps) {
  // 4. Remova toda a lógica de 'useQuery'. A lógica agora é simples.
  const hasAddress = !!address;

  const formattedAddress = (() => {
    if (!address) return "Nenhum endereço cadastrado.";
    const parts = [
      (address.street && address.number) ? `${address.street}, ${address.number}` : (address.street || address.number),
      address.district,
      (address.city && address.state) ? `${address.city} - ${address.state}` : (address.city || address.state),
      address.zip,
      address.country
    ].filter(Boolean); // Remove partes nulas ou vazias
    return parts.join(" • ");
  })();

  return (
    <Card>
      <div className="flex items-center justify-between">
        <CardHeader title="Endereço" subtitle="Localização principal da empresa." />
        {/* O modal agora pode receber os dados para edição ou criação */}
        <ModalCreateAddressEnterprise
          enterpriseId={enterpriseId}
          existingAddress={address}
          hasAddress={hasAddress} // Passa a informação do botão
        />
      </div>

      {/* A exibição é baseada nas props recebidas */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 mt-4">
        {hasAddress ? (
          <>
            <Field label="Cidade"><div>{address.city ?? "—"}</div></Field>
            <Field label="Estado"><div>{address.state ?? "—"}</div></Field>
            <Field label="Endereço completo" className="sm:col-span-2">
              <div>{formattedAddress}</div>
            </Field>
          </>
        ) : (
          <p className="text-neutral-500 text-sm sm:col-span-2">
            Nenhum endereço cadastrado.
          </p>
        )}
      </div>
    </Card>
  );
}