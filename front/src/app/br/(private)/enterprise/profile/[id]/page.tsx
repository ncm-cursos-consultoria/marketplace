"use client";

import { Globe, Mail, Phone, Link as LinkIcon } from "lucide-react";
import { Card } from "@/components/enterprise/profile/card";
import { CardHeader } from "@/components/enterprise/profile/card-header";
import { AboutEnterprise } from "./complementary/about";
import { AddressEnterprise } from "./complementary/address";
import { EnterpriseProfileHeader } from "./complementary/header";
import { Kpis } from "./complementary/kpis";
import { RecruitersTeam } from "./complementary/recruiters-team";
import { PagePublic } from "./complementary/page-public";
import { useQuery } from "@tanstack/react-query";
import { getEnterprise } from "@/service/enterprise/get-enterprise";
import { useParams } from "next/navigation";
import { UseUserEnteprise } from "@/context/user-enterprise.context";

export default function EmpresaProfilePage() {
  const { userEnterprise } = UseUserEnteprise();
  const params = useParams<{ id: string }>();
  const id = params?.id;

  const { data, isLoading, error } = useQuery({
    queryKey: ["enterprise", id],
    queryFn: () => getEnterprise(id as string),
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
  });

  console.log("teste", data);

  return (
    <div className="min-h-screen">
      <div className="flex w-full">
        <main className="flex-1">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
            <EnterpriseProfileHeader cnpj={data?.cnpj} legalName={data?.legalName}/>
            {/* <Kpis /> */}
            <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
              <div className="lg:col-span-2 space-y-6">
                <Card>
                  <CardHeader
                    title="Informações da empresa"
                    subtitle="Esses dados aparecem na página pública."
                  />
                  <p className="text-neutral-600">CNPJ {data?.cnpj}</p>
                </Card>

                <AboutEnterprise cnpj={data?.cnpj}/>

                <AddressEnterprise />
                <Card>
                  <CardHeader title="Benefícios oferecidos" />
                </Card>
              </div>

              <div className="space-y-6">
                <Card>
                  <CardHeader title="Contatos" />
                  <div className="flex items-center gap-1">
                    <Mail className="text-neutral-600" size={20}/>
                    <p className="text-[16px] text-neutral-600">
                      {userEnterprise?.email}
                    </p>
                  </div>

                  {/* {data.links.length > 0 && (
                    <div className="mt-4 border-t pt-4">
                      <h4 className="text-sm font-semibold text-gray-900 mb-2 flex items-center gap-2">
                        <LinkIcon className="h-4 w-4" /> Links úteis
                      </h4>
                      <ul className="space-y-2 text-sm">
                        {data.links.map((l, i) => (
                          <li
                            key={i}
                            className="flex items-center justify-between"
                          >
                            <span className="text-gray-700">{l.label}</span>
                            <a
                              className="link"
                              href={l.url}
                              target="_blank"
                              rel="noreferrer"
                            >
                              Abrir
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )} */}
                </Card>
                {/* <RecruitersTeam data={data} /> */}
                <PagePublic />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
