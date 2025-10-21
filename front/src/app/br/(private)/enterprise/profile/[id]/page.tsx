"use client";

import { useMemo, useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import { UseUserEnteprise } from "@/context/user-enterprise.context";
import { getEnterprise } from "@/service/enterprise/get-enterprise";
import { Card } from "@/components/enterprise/profile/card";
import { CardHeader } from "@/components/enterprise/profile/card-header";
import { EnterpriseProfileHeader } from "./complementary/header";
import { AddressEnterprise } from "./complementary/address";
import { PagePublic } from "./complementary/page-public";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, Phone, Globe, Pencil, Save, Loader2 } from "lucide-react";
import { AboutEnterprise } from "./complementary/about";
import { EnterpriseData } from "@/types/enterprise";
import { useEditEnterprise } from "@/hooks/forms/use-edit-enterprise";
import { getAddress } from "@/service/address/get-address";
import { ApiAddress } from "@/types/address";

const enterpriseEditSchema = z.object({
  tradeName: z.string().min(3, "O nome fantasia é obrigatório."),
});
type EnterpriseEditSchema = z.infer<typeof enterpriseEditSchema>;

function formatCNPJ(cnpj?: string) {
  if (!cnpj) return "—";
  const digits = cnpj.replace(/\D/g, "");
  return digits.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2}).*$/, "$1.$2.$3/$4-$5");
}

function safeUrl(url?: string) {
  if (!url) return undefined;
  try {
    const u = new URL(url.startsWith("http") ? url : `https://${url}`);
    return u.toString();
  } catch {
    return undefined;
  }
}

/* ================= Skeletons ================= */
function HeaderSkeleton() {
  return (
    <div className="rounded-xl border bg-white p-6 shadow-sm">
      <div className="h-6 w-64 rounded bg-slate-200" />
      <div className="mt-2 h-4 w-96 rounded bg-slate-100" />
    </div>
  );
}

function CardSkeleton() {
  return <div className="h-40 rounded-xl border bg-white shadow-sm animate-pulse" />;
}

export default function EmpresaProfilePage() {
  const { userEnterprise } = UseUserEnteprise();
  const params = useParams<{ id: string }>();
  const enterpriseId = useMemo(() => params?.id ?? userEnterprise?.enterpriseId, [params?.id, userEnterprise?.enterpriseId]);

  const [isEditing, setIsEditing] = useState(false);
  const queryClient = useQueryClient();
  const router = useRouter();

  const { data: enterprise, isLoading, isError, refetch } = useQuery<EnterpriseData>({
    queryKey: ["enterprise-profile", enterpriseId],
    queryFn: () => getEnterprise(enterpriseId as string),
    enabled: !!enterpriseId,
  });

  const addressId = enterprise?.addressId;

  const { data: address, isLoading: isLoadingAddress } = useQuery<ApiAddress>({
    queryKey: ["address", addressId],
    queryFn: () => getAddress(addressId as string),
    enabled: !!addressId,
  });

  const {
    form: { register, handleSubmit, formState: { errors }, reset },
    isPending: isUpdating,
    onSubmit: handleUpdateSubmit
  } = useEditEnterprise(enterprise, enterpriseId, userEnterprise?.email, setIsEditing);

  /* ====== Loading ====== */
  if (isLoading) {
    return (
      <div className="min-h-screen">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 space-y-6">
          <HeaderSkeleton />
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-6">
              <CardSkeleton />
              <CardSkeleton />
              <CardSkeleton />
            </div>
            <div className="space-y-6">
              <CardSkeleton />
              <CardSkeleton />
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* ====== Error ====== */
  if (isError || !enterprise) {
    return (
      <div className="min-h-screen">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-10">
          <div className="rounded-xl border border-rose-200 bg-rose-50 p-6">
            <h2 className="text-rose-800 font-semibold">Não foi possível carregar os dados da empresa.</h2>
            <p className="mt-1 text-rose-700 text-sm">Verifique sua conexão ou tente novamente.</p>
            <Button className="mt-4" variant="secondary" onClick={() => refetch()}>
              Tentar novamente
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const formattedCnpj = formatCNPJ(enterprise.cnpj);
  const mail = enterprise.email || userEnterprise?.email;
  const phone = enterprise.phone;
  const website = safeUrl(enterprise.website);

  return (
    <div className="min-h-screen">
      <main className="flex-1">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
          <EnterpriseProfileHeader cnpj={formattedCnpj} legalName={enterprise?.legalName || ''} />

          <form onSubmit={handleSubmit(handleUpdateSubmit)}>
            {/* Botão de Edição Global (movido para fora do card, antes do grid) */}
            <div className="flex justify-end my-4">
              {!isEditing ? (
                <Button variant="outline" onClick={() => setIsEditing(true)}>
                  <Pencil className="h-4 w-4 mr-2" /> Editar Página
                </Button>
              ) : (
                <div className="flex items-center gap-2">
                  <Button variant="ghost" onClick={() => {
                    setIsEditing(false);
                    reset(); // Reseta o formulário para os valores originais
                  }}>Cancelar</Button>
                  <Button type="submit" disabled={isUpdating}>
                    {isUpdating ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
                    Salvar Alterações
                  </Button>
                </div>
              )}
            </div>

            <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
              {/* Coluna Esquerda */}
              <div className="lg:col-span-2 space-y-6">

                {/* Card de Informações */}
                <Card>
                  <CardHeader title="Informações da empresa" subtitle="Esses dados aparecem na página pública." />
                  <div className="mt-4 text-neutral-700 text-sm">
                    {isEditing ? (
                      <div className="space-y-4">
                        {/* INPUTS DE INFORMAÇÕES */}
                        <div>
                          <Label htmlFor="tradeName">Nome Fantasia</Label>
                          <Input id="tradeName" {...register("tradeName")} />
                          {errors.tradeName && <p className="text-red-500 text-xs mt-1">{errors.tradeName.message}</p>}
                        </div>
                        <div>
                          <Label htmlFor="legalName">Razão Social</Label>
                          <Input id="legalName" {...register("legalName")} />
                          {errors.legalName && <p className="text-red-500 text-xs mt-1">{errors.legalName.message}</p>}
                        </div>
                        <div>
                          <Label htmlFor="cnpj">CNPJ (somente números)</Label>
                          <Input id="cnpj" {...register("cnpj")} />
                          {errors.cnpj && <p className="text-red-500 text-xs mt-1">{errors.cnpj.message}</p>}
                        </div>
                      </div>
                    ) : (
                      <div>
                        <p><span className="text-neutral-500">Nome Fantasia:</span> {enterprise?.tradeName}</p>
                        <p className="mt-1"><span className="text-neutral-500">Razão Social:</span> {enterprise?.legalName}</p>
                        <p className="mt-1"><span className="text-neutral-500">CNPJ:</span> {formattedCnpj}</p>
                      </div>
                    )}
                  </div>
                </Card>

                {/* Card "Sobre" */}
                {/* Passamos as props 'register' e 'errors' para o componente filho */}
                <AboutEnterprise
                  mission={enterprise?.missionStatement}
                  values={enterprise?.coreValues}
                  benefits={enterprise?.benefits}
                  isEditing={isEditing}
                  register={register} // Passando o registro
                  errors={errors}     // Passando os erros
                />

                {/* Card de Endereço (não editável por aqui) */}
                <AddressEnterprise
                  address={address}
                  enterpriseId={enterprise?.id}
                />
              </div>

              {/* Coluna Direita */}
              <div className="space-y-6">
                {/* Card de Contatos */}
                <Card>
                  <CardHeader title="Contatos" />
                  <div className="mt-4 space-y-3 text-neutral-700 text-sm">
                    {isEditing ? (
                      <div className="space-y-4">
                        {/* INPUTS DE CONTATO */}
                        <div>
                          <Label htmlFor="email">Email</Label>
                          <Input id="email" type="email" {...register("email")} />
                          {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
                        </div>
                        <div>
                          <Label htmlFor="phone">Telefone</Label>
                          <Input id="phone" {...register("phone")} />
                          {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
                        </div>
                        <div>
                          <Label htmlFor="website">Website</Label>
                          <Input id="website" {...register("website")} placeholder="https://..." />
                          {errors.website && <p className="text-red-500 text-xs mt-1">{errors.website.message}</p>}
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {mail ? (
                          <a href={`mailto:${mail}`} className="flex items-center gap-2 hover:underline">
                            <Mail size={18} className="text-neutral-600" />
                            {mail}
                          </a>
                        ) : (
                          <div className="flex items-center gap-2 text-neutral-400">
                            <Mail size={18} />
                            E-mail não informado
                          </div>
                        )}

                        {phone ? (
                          <a href={`tel:${phone}`} className="flex items-center gap-2 hover:underline">
                            <Phone size={18} className="text-neutral-600" />
                            {phone}
                          </a>
                        ) : (
                          <div className="flex items-center gap-2 text-neutral-400">
                            <Phone size={18} />
                            Telefone não informado
                          </div>
                        )}

                        {website ? (
                          <a href={website} target="_blank" rel="noreferrer" className="flex items-center gap-2 hover:underline">
                            <Globe size={18} className="text-neutral-600" />
                            {website.replace(/^https?:\/\//, "")}
                          </a>
                        ) : (
                          <div className="flex items-center gap-2 text-neutral-400">
                            <Globe size={18} />
                            Site não informado
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </Card>
                <PagePublic />
              </div>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
