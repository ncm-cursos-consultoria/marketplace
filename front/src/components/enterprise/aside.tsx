"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import logo from "@/assets/ncm-logo.png"; // Supondo que você tenha o logo
import { UseUserEnteprise } from "@/context/user-enterprise.context";
import { useQuery } from "@tanstack/react-query";
import { getEnterprise } from "@/service/enterprise/get-enterprise";
import { UserEnterpriseProps } from "@/utils/interfaces";
import { LogOut, Loader2, Home, Building2, Briefcase, NotebookPenIcon } from "lucide-react";

// 1. ATUALIZANDO A ESTRUTURA NAV: Adicionamos "Minhas Vagas" e a propriedade 'icon'
type NavItem = {
  label: string;
  slug: "home" | "profile" | "jobs" | "module";
  icon: React.ReactNode;
};

const NAV: NavItem[] = [
  { label: "Início", slug: "home", icon: <Home className="h-5 w-5" /> },
  { label: "Minha Empresa", slug: "profile", icon: <Building2 className="h-5 w-5" /> },
  { label: "Minhas Vagas", slug: "jobs", icon: <Briefcase className="h-5 w-5" /> },
  { label: "Portfólio de Cursos", slug: "module", icon: <NotebookPenIcon className="h-5 w-5" /> },
];

export function AsideEnterprise() {
  const { userEnterprise, logout, isLoggingOut } = UseUserEnteprise();
  const pathname = usePathname() || "";
  const enterpriseId = userEnterprise?.enterpriseId;

  const { data: enterpriseData, isLoading } = useQuery<UserEnterpriseProps>({
    queryKey: ["enterprise", enterpriseId],
    queryFn: () => getEnterprise(enterpriseId as string),
    enabled: !!enterpriseId,
  });

  const base = "/br/enterprise";

  // Lógica de rota ativa, mais precisa
  const isActive = (slug: NavItem["slug"]): boolean => {
    const segments = pathname.split('/');
    const lastSegment = segments[segments.length - 1];
    const secondToLastSegment = segments[segments.length - 2];

    if (slug === 'home') return lastSegment === enterpriseId;
    return secondToLastSegment === slug;
  };

  // 2. ESTILO UNIFICADO: Usando a mesma lógica de classes do Aside do Candidato
  const itemCls = (active: boolean) =>
    [
      "flex items-center gap-3 rounded-lg px-3 py-2 text-gray-200 transition-colors text-lg",
      "hover:bg-blue-800 hover:text-white",
      active && "bg-gray-100 text-blue-900 font-semibold",
    ]
      .filter(Boolean)
      .join(" ");

  const handleLogout = async () => {
    await logout("/br/auth/sign-in");
  };

  if (isLoading || !enterpriseId) {
    return (
        <aside className="fixed inset-y-0 left-0 hidden w-72 flex-col bg-blue-900 text-white md:flex">
            <div className="px-6 py-6 border-b border-white/10">Carregando...</div>
        </aside>
    );
  }

  return (
    // 3. LAYOUT FLEXBOX: Garante que o rodapé fique no final
    <aside className="fixed inset-y-0 left-0 hidden w-72 flex-col bg-blue-900 text-white md:flex">
      {/* Seção do Logo */}
      <div className="px-6 py-6 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/10">
            <Building2 />
          </div>
          <div className="leading-tight">
            <p className="font-semibold">{enterpriseData?.tradeName}</p>
            <p className="text-xs text-white/70">{enterpriseData?.legalName}</p>
          </div>
        </div>
      </div>

      {/* Seção da Navegação (Agora usando <Link> diretamente) */}
      <nav className="flex-1 px-4 py-4">
        <ul className="space-y-2">
          {NAV.map(({ label, slug, icon }) => {
            const href = slug === 'home' ? `${base}/${enterpriseId}` : `${base}/${slug}/${enterpriseId}`;
            const active = isActive(slug);

            return (
              <li key={slug}>
                <Link href={href} aria-current={active ? "page" : undefined} className={itemCls(active)}>
                  {icon}
                  <span>{label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Rodapé com Perfil e Logout (mt-auto empurra para o final) */}
      <div className="mt-auto border-t border-white/10 p-4">
        <button
          type="button"
          onClick={handleLogout}
          disabled={isLoggingOut}
          className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-white/10 px-3 py-2 text-sm font-medium hover:bg-white/20 disabled:opacity-60"
        >
          {isLoggingOut ? (
            <><Loader2 className="h-4 w-4 animate-spin" /> Saindo...</>
          ) : (
            <><LogOut className="h-4 w-4" /> Sair</>
          )}
        </button>
      </div>
    </aside>
  );
}