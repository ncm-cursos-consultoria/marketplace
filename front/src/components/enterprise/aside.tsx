"use client";

import {
  Briefcase,
  Building,
  Building2,
  Home,
  NotebookPenIcon,
  Plus,
  LogOut,
} from "lucide-react";
import { NavItem } from "./nav-item";
import Link from "next/link";
import { UseUserEnteprise } from "@/context/user-enterprise.context";
import { useQuery } from "@tanstack/react-query";
import { getEnterprise } from "@/service/enterprise/get-enterprise";
import { UserEnterpriseProps } from "@/utils/interfaces";

export function AsideEnterprise() {
  const { userEnterprise, logout, isLoggingOut } = UseUserEnteprise();
  const enterpriseId = userEnterprise?.enterpriseId ?? null;

  const { data, isLoading } = useQuery<UserEnterpriseProps>({
    queryKey: ["enterprise", enterpriseId],
    queryFn: () => getEnterprise(enterpriseId as string),
    enabled: !!enterpriseId,
    staleTime: 1000 * 60 * 5,
  });

  if (!enterpriseId) return null;

  if (isLoading || !data) {
    return (
      <aside className="hidden md:flex md:flex-col md:w-64 bg-[#0D2E66] text-white min-h-screen sticky top-0">
        <div className="px-6 py-6 border-b border-white/10">Carregando...</div>
      </aside>
    );
  }

  return (
    <aside className="hidden md:flex md:flex-col md:w-72 bg-[#0D2E66] text-white min-h-screen sticky top-0">
      <div className="px-6 py-6 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-white/10 flex items-center justify-center font-bold">
            <Building />
          </div>
          <div className="leading-tight">
            <p className="font-semibold">{data.tradeName}</p>
            <p className="text-xs text-white/70">{data.legalName}</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-2 py-4 space-y-1">
        <NavItem
          href={`/br/enterprise/${enterpriseId}`}
          icon={<Home className="h-4 w-4" />}
        >
          Início
        </NavItem>
        <NavItem
          href={`/br/enterprise/profile/${enterpriseId}`}
          icon={<Building2 className="h-4 w-4" />}
        >
          Minha Empresa
        </NavItem>
        {/* <NavItem
          href={`/enterprise/${enterpriseId}/jobs`}
          icon={<Briefcase className="h-4 w-4" />}
        >
          Minhas Vagas
        </NavItem> */}
        <NavItem
          href={`/br/enterprise/module/${enterpriseId}`}
          icon={<NotebookPenIcon className="h-4 w-4" />}
        >
          Meus Módulos
        </NavItem>
      </nav>

      <div className="p-4 mt-auto space-y-2">
        {/* <Link
          href={`/enterprise/${enterpriseId}/jobs/new`}
          className="inline-flex items-center gap-2 w-full justify-center rounded-lg bg-white text-[#0D2E66] font-medium py-2"
        >
          <Plus className="h-4 w-4" /> Criar nova vaga
        </Link> */}

        <button
          type="button"
          onClick={() => logout?.("/br/auth/sign-in")}
          disabled={isLoggingOut}
          className="inline-flex items-center gap-2 w-full justify-center rounded-lg border border-white/20 text-white font-medium py-2 hover:bg-white/10 disabled:opacity-60"
        >
          <LogOut className="h-4 w-4" />
          {isLoggingOut ? "Saindo..." : "Sair"}
        </button>
      </div>
    </aside>
  );
}
