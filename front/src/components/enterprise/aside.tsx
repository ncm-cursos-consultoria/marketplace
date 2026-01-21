"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import logo from "@/assets/ncm-logo.png";
import { UseUserEnteprise } from "@/context/user-enterprise.context";
import { useQuery } from "@tanstack/react-query";
import { getEnterprise } from "@/service/enterprise/get-enterprise";
import { UserEnterpriseProps } from "@/utils/interfaces";
import { LogOut, Loader2, Home, Building2, Briefcase, NotebookPenIcon, Users, X, Mail } from "lucide-react";
import { NotificationBell } from "./enterprise-notification-bell";

type NavItem = {
  label: string;
  slug: "home" | "profile" | "vaga" | "module" | "talent-base" | "invite-mentor";
  icon: React.ReactNode;
  adminOnly?: boolean;
};

// Interface para controle de estado mobile
interface AsideEnterpriseProps {
  isOpen?: boolean;
  onClose?: () => void;
}

const NAV: NavItem[] = [
  { label: "Início", slug: "home", icon: <Home className="h-5 w-5" /> },
  { label: "Minha Empresa", slug: "profile", icon: <Building2 className="h-5 w-5" /> },
  { label: "Minhas Vagas", slug: "vaga", icon: <Briefcase className="h-5 w-5" /> },
  { label: "Banco de Talentos", slug: "talent-base", icon: <Users className="h-5 w-5" /> },
  { label: "Portfólio de Cursos", slug: "module", icon: <NotebookPenIcon className="h-5 w-5" /> },
  { label: "Convidar Mentores", slug: "invite-mentor", icon: <Mail className="h-5 w-5" />, adminOnly: true },
];

export function AsideEnterprise({ isOpen, onClose }: AsideEnterpriseProps) {
  const { userEnterprise, logout, isLoggingOut } = UseUserEnteprise();
  const pathname = usePathname() || "";
  const enterpriseId = userEnterprise?.enterpriseId;
  const isAdmin = userEnterprise?.admin === true;

  const { data: enterpriseData, isLoading } = useQuery<UserEnterpriseProps>({
    queryKey: ["enterprise", enterpriseId],
    queryFn: () => getEnterprise(enterpriseId as string),
    enabled: !!enterpriseId,
  });

  const filteredNav = NAV.filter(item => !item.adminOnly || isAdmin);

  const base = "/br/enterprise";

  const isActive = (slug: NavItem["slug"]): boolean => {
    const homePath = `${base}/${enterpriseId}`;
    if (slug === 'home') {
      return pathname === homePath;
    } else {
      const segments = pathname.split('/');
      const secondToLastSegment = segments.length > 2 ? segments[segments.length - 2] : null;
      return secondToLastSegment === slug;
    }
  };

  const itemCls = (active: boolean) =>
    [
      "flex items-center gap-3 rounded-lg px-3 py-2 transition-colors text-lg",
      active
        ? "bg-gray-100 text-blue-900 font-semibold"
        : "text-gray-200 hover:bg-blue-800 hover:text-white",
    ]
      .filter(Boolean)
      .join(" ");

  const handleLogout = async () => {
    await logout("/br/auth/sign-in");
  };

  // Renderização de carregamento adaptada
  if (isLoading || !enterpriseId) {
    return (
      <aside className={`fixed inset-y-0 left-0 z-50 w-72 flex-col bg-blue-900 text-white transition-transform duration-300 md:flex ${isOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}>
        <div className="px-6 py-6 border-b border-white/10">Carregando...</div>
      </aside>
    );
  }

  return (
    <>
      {/* Fundo escurecido no mobile quando o menu está aberto */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={onClose}
        />
      )}

      <aside className={`
        fixed inset-y-0 left-0 z-50 flex w-72 flex-col bg-blue-900 text-white transition-transform duration-300 ease-in-out
        ${isOpen ? "translate-x-0" : "-translate-x-full"} 
        md:translate-x-0
      `}>
        {/* Header do Aside com Botão Fechar no Mobile */}
        <div className="px-6 py-6 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/10">
              <Building2 />
            </div>
            <div className="leading-tight min-w-0">
              <p className="font-semibold truncate">{enterpriseData?.tradeName}</p>
              <p className="text-xs text-white/70 truncate">{enterpriseData?.legalName}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <NotificationBell />
            <button onClick={onClose} className="md:hidden text-white p-1">
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* Navegação */}
        <nav className="flex-1 px-4 py-4 overflow-y-auto">
          <ul className="space-y-2">
            {filteredNav.map(({ label, slug, icon }) => {
              const href = slug === 'home' ? `${base}/${enterpriseId}` : `${base}/${slug}/${enterpriseId}`;
              const active = isActive(slug);

              return (
                <li key={slug}>
                  <Link
                    href={href}
                    onClick={onClose} // Fecha o menu ao clicar em um link no mobile
                    aria-current={active ? "page" : undefined}
                    className={itemCls(active)}
                  >
                    {icon}
                    <span>{label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Rodapé de Logout */}
        <div className="mt-auto border-t border-white/10 p-4">
          <button
            type="button"
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-white/10 px-3 py-2 text-sm font-medium hover:bg-white/20 disabled:opacity-60 transition-colors"
          >
            {isLoggingOut ? (
              <><Loader2 className="h-4 w-4 animate-spin" /> Saindo...</>
            ) : (
              <><LogOut className="h-4 w-4" /> Sair</>
            )}
          </button>
        </div>
      </aside>
    </>
  );
}