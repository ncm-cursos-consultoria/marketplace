"use client";

import { useMemo } from "react";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { UseUserEnteprise } from "@/context/user-enterprise.context";
import { getEnterprise } from "@/service/enterprise/get-enterprise";

import { Card } from "@/components/enterprise/profile/card";
import { CardHeader } from "@/components/enterprise/profile/card-header";
import { EnterpriseProfileHeader } from "./complementary/header";
import { AboutEnterprise } from "./complementary/about";
import { AddressEnterprise } from "./complementary/address";
import { PagePublic } from "./complementary/page-public";

import { Mail, Phone, Globe, Link as LinkIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

type Enterprise = {
  id: string;
  legalName: string;
  cnpj: string;
  email?: string;
  phone?: string;
  website?: string;
  links?: { label: string; url: string }[];
};

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

/* ================= Page ================= */
export default function EmpresaProfilePage() {
  const { userEnterprise } = UseUserEnteprise();
  const params = useParams<{ id: string }>();
  const id = params?.id;

  // fallback para o enterprise da sessão, se a rota não trouxer id
  const enterpriseId = useMemo(() => id ?? userEnterprise?.enterpriseId, [id, userEnterprise?.enterpriseId]);

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["enterprise", enterpriseId],
    queryFn: () => getEnterprise(enterpriseId as string),
    enabled: !!enterpriseId,
    staleTime: 5 * 60 * 1000,
  });

  const enterprise = data as Enterprise | undefined;

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
      <div className="flex w-full">
        <main className="flex-1">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
            {/* Header */}
            <EnterpriseProfileHeader cnpj={formattedCnpj} legalName={enterprise.legalName} />

            {/* Grid */}
            <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
              {/* Coluna esquerda */}
              <div className="lg:col-span-2 space-y-6">
                {/* Informações básicas */}
                <Card>
                  <CardHeader
                    title="Informações da empresa"
                    subtitle="Esses dados aparecem na página pública."
                  />
                  <div className="text-neutral-700 text-sm">
                    <p><span className="text-neutral-500">CNPJ</span> {formattedCnpj}</p>
                    <p className="mt-1">
                      <span className="text-neutral-500">Razão social</span> {enterprise.legalName}
                    </p>
                  </div>
                </Card>

                {/* Sobre */}
                <AboutEnterprise cnpj={formattedCnpj} />

                {/* Endereço */}
                <AddressEnterprise />

                {/* Benefícios */}
                <Card>
                  <CardHeader title="Benefícios oferecidos" />
                  <p className="text-neutral-500 text-sm">Adicione benefícios para atrair mais candidatos.</p>
                </Card>
              </div>

              {/* Coluna direita */}
              <div className="space-y-6">
                {/* Contatos */}
                <Card>
                  <CardHeader title="Contatos" />
                  <div className="space-y-3 text-neutral-700">
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

                  {/* Links úteis (opcional) */}
                  {enterprise.links && enterprise.links.length > 0 && (
                    <div className="mt-4 border-t pt-4">
                      <h4 className="mb-2 flex items-center gap-2 text-sm font-semibold text-gray-900">
                        <LinkIcon className="h-4 w-4" /> Links úteis
                      </h4>
                      <ul className="space-y-2 text-sm">
                        {enterprise.links.map((l, i) => (
                          <li key={i} className="flex items-center justify-between">
                            <span className="text-gray-700">{l.label}</span>
                            <a
                              className="link hover:underline"
                              href={safeUrl(l.url)}
                              target="_blank"
                              rel="noreferrer"
                            >
                              Abrir
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </Card>
                <PagePublic />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
