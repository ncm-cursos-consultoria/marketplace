"use client";

import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/enterprise/profile/card";
import { CardHeader } from "@/components/enterprise/profile/card-header";
import { Field } from "@/components/enterprise/profile/field";
import { UseUserEnteprise } from "@/context/user-enterprise.context";
import { api } from "@/service/api";
import { ModalCreateAddressEnterprise } from "./modal-create-address-enterprise";

type ApiEnterprise = {
  id: string;
  createdAt: string;
  updatedAt: string;
  legalName: string;
  tradeName: string;
  cnpj: string;
  plan?: string;
  profilePictureUrl?: string;
  addressId?: string | null;
};

type ApiAddress = {
  id: string;
  createdAt: string;
  updatedAt: string;
  country?: string;
  state?: string;
  city?: string;
  district?: string;
  zip?: string;
  street?: string;
  number?: string;
  addressLine2?: string;
};

export function AddressEnterprise() {
  const { userEnterprise } = UseUserEnteprise();
  const enterpriseId = userEnterprise?.enterpriseId;

  // 1) Busca a empresa (possui addressId)
  const {
    data: enterprise,
    isLoading: isLoadingEnterprise,
    isError: isErrorEnterprise,
  } = useQuery<ApiEnterprise>({
    queryKey: ["enterprise", enterpriseId],
    enabled: !!enterpriseId,
    queryFn: async () => {
      const { data } = await api.get(`/enterprise/${enterpriseId}`);
      return data as ApiEnterprise;
    },
    staleTime: 1000 * 60 * 2,
  });

  const addressId = enterprise?.addressId ?? undefined;

  // 2) Com o addressId, busca o endereço
  const {
    data: address,
    isLoading: isLoadingAddress,
    isError: isErrorAddress,
  } = useQuery<ApiAddress>({
    queryKey: ["address", addressId],
    enabled: !!addressId,
    queryFn: async () => {
      const { data } = await api.get(`/address/${addressId}`);
      return data as ApiAddress;
    },
    staleTime: 1000 * 60 * 2,
  });

  const city = address?.city ?? "—";
  const state = address?.state ?? "—";

  const formattedAddress = (() => {
    if (!address) return "Nenhum endereço cadastrado.";
    const p1 =
      address.street && address.number
        ? `${address.street}, ${address.number}`
        : address.street || address.number || null;

    const p2 = address.district || null;

    const p3 =
      address.city || address.state
        ? [address.city, address.state].filter(Boolean).join(" - ")
        : null;

    const p4 = address.zip || null;

    const p5 = address.addressLine2 || null;

    const p6 = address.country || null;

    const parts = [p1, p2, p3, p4, p5, p6].filter(Boolean);
    return parts.length ? parts.join(" • ") : "Nenhum endereço cadastrado.";
  })();

  const showSkeleton =
    isLoadingEnterprise || (!!addressId && isLoadingAddress);

  const showError =
    isErrorEnterprise || (!!addressId && isErrorAddress);

  return (
    <Card>
      <div className="flex items-center justify-between">
        <CardHeader title="Endereço" subtitle="Localização principal da empresa." />
        <ModalCreateAddressEnterprise />
      </div>

      {showSkeleton ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Cidade">
            <div className="h-4 w-24 rounded bg-neutral-200 animate-pulse" />
          </Field>
          <Field label="Estado">
            <div className="h-4 w-16 rounded bg-neutral-200 animate-pulse" />
          </Field>
          <Field label="Endereço completo" className="sm:col-span-2">
            <div className="h-4 w-3/4 rounded bg-neutral-200 animate-pulse" />
          </Field>
        </div>
      ) : showError ? (
        <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          Não foi possível carregar o endereço da empresa.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Cidade">
            <div>{addressId ? city : "—"}</div>
          </Field>
          <Field label="Estado">
            <div>{addressId ? state : "—"}</div>
          </Field>
          <Field label="Endereço completo" className="sm:col-span-2">
            <div>{addressId ? formattedAddress : "Nenhum endereço cadastrado."}</div>
          </Field>
        </div>
      )}
    </Card>
  );
}
