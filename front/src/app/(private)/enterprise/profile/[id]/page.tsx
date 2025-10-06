"use client";

import { useState } from "react";
import {
  Globe,
  Mail,
  Phone,
  Link as LinkIcon,
} from "lucide-react";
import { AsideEnterprise } from "@/components/enterprise/aside";
import { Card } from "@/components/enterprise/profile/card";
import { CardHeader } from "@/components/enterprise/profile/card-header";
import { AboutEnterprise } from "./complementary/about";
import { AddressEnterprise } from "./complementary/address";
import { EnterpriseProfileHeader } from "./complementary/header";
import { Kpis } from "./complementary/kpis";
import { RecruitersTeam } from "./complementary/recruiters-team";
import { PagePublic } from "./complementary/page-public";

type Recruiter = {
  id: string;
  name: string;
  role: string;
  email: string;
};

type Company = {
  name: string;
  legalName: string; 
  tradeName: string; 
  cnpj: string;
  size: string;
  city: string;
  state: string;
  logoUrl?: string;
  website?: string;
  email?: string;
  phone?: string;
  about: string;
  address: string;
  areas: string[];
  benefits: string[];
  links: { label: string; url: string }[];
  recruiters: Recruiter[];
  metrics: {
    activeJobs: number;
    candidates: number;
    views: number;
    rating: number;
  };
  verified: boolean;
};

export default function EmpresaProfilePage() {
  const [company, setCompany] = useState<Company>({
    name: "NCM — Sistema & Consultoria",
    legalName: "NCM Sistemas e Consultoria LTDA",
    tradeName: "NCM Consultoria",
    cnpj: "12.345.678/0001-90",
    size: "51–100 colaboradores",
    city: "Curitiba",
    state: "PR",
    logoUrl: "/logo-ncm.png", 
    website: "https://ncm.exemplo.com",
    email: "contato@ncm.com.br",
    phone: "+55 (41) 99999-0000",
    about:
      "Somos uma consultoria focada em diagnóstico empresarial, recrutamento eficiente e tecnologia aplicada a RH. Nosso time conecta empresas e talentos com processos claros e sem vieses.",
    address: "Av. Exemplo, 1000 — Centro, Curitiba/PR, 80000-000",
    areas: ["Tecnologia", "Dados", "Produtos", "Marketing"],
    benefits: [
      "Plano de saúde",
      "VT/VR",
      "Remoto híbrido",
      "Plano de carreira",
    ],
    links: [
      { label: "LinkedIn", url: "https://linkedin.com/company/ncm" },
      { label: "Site", url: "https://ncm.exemplo.com" },
    ],
    recruiters: [
      {
        id: "1",
        name: "Ana Ribeiro",
        role: "Tech Recruiter",
        email: "ana@ncm.com.br",
      },
      {
        id: "2",
        name: "João Lima",
        role: "Talent Partner",
        email: "joao@ncm.com.br",
      },
    ],
    metrics: {
      activeJobs: 3,
      candidates: 128,
      views: 1542,
      rating: 4.7,
    },
    verified: true,
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex w-full">
        <main className="flex-1">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
            <EnterpriseProfileHeader />
            <Kpis />
            <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
              <div className="lg:col-span-2 space-y-6">
                <Card>
                  <CardHeader
                    title="Informações da empresa"
                    subtitle="Esses dados aparecem na página pública."
                  />
                </Card>

                <AboutEnterprise />

                <AddressEnterprise />
                <Card>
                  <CardHeader title="Benefícios oferecidos" />
                </Card>
              </div>

              <div className="space-y-6">
                <Card>
                  <CardHeader title="Contatos" />
                  <div className="space-y-3 text-sm text-gray-700">
                    {company.website && (
                      <div className="flex items-center gap-2">
                        <Globe className="h-4 w-4" />
                        <a
                          href={company.website}
                          target="_blank"
                          className="link"
                        >
                          {company.website}
                        </a>
                      </div>
                    )}
                    {company.email && (
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4" />
                        <a href={`mailto:${company.email}`} className="link">
                          {company.email}
                        </a>
                      </div>
                    )}
                    {company.phone && (
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4" /> {company.phone}
                      </div>
                    )}
                  </div>

                  {company.links.length > 0 && (
                    <div className="mt-4 border-t pt-4">
                      <h4 className="text-sm font-semibold text-gray-900 mb-2 flex items-center gap-2">
                        <LinkIcon className="h-4 w-4" /> Links úteis
                      </h4>
                      <ul className="space-y-2 text-sm">
                        {company.links.map((l, i) => (
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
                  )}
                </Card>
                <RecruitersTeam company={company} />
                <PagePublic />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
