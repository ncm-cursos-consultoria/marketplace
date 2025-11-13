"use client";

import Image from "next/image";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import logo from "@/assets/ncm-logo.png";
import avatar from "@/assets/avatar.png";
import { UseUserCandidate } from "@/context/user-candidate.context";
import { LogOut, Loader2, Home, BookCopy, Briefcase, NotebookPenIcon } from "lucide-react";
import { NotificationBell } from "../notification/NotificationBell";

type NavItem = {
  label: string;
  slug: "home" | "courses" | "jobs" | "teste-comportamental" | "minhas-candidaturas";
  requiresId?: boolean;
  icon: React.ReactNode; // Adicionando o ícone ao tipo
};

const NAV: NavItem[] = [
  { label: "Início", slug: "home", requiresId: true, icon: <Home className="h-5 w-5" /> },
  { label: "Teste Comportamental", slug: "teste-comportamental", requiresId: true, icon: <BookCopy className="h-5 w-5" /> },
  { label: "Cursos", slug: "courses", requiresId: true, icon: <NotebookPenIcon className="h-5 w-5" /> },
  { label: "Vagas", slug: "jobs", requiresId: true, icon: <Briefcase className="h-5 w-5" /> },
  { label: "Minhas Candidaturas", slug: "minhas-candidaturas", requiresId: true, icon: <Briefcase className="h-5 w-5" /> }
];

export function Aside() {
  const { userCandidate, logout, isLoggingOut } = UseUserCandidate();
  const pathname = usePathname() || "";
  const params = useParams();

  const id = userCandidate?.id || (params?.id as string | undefined);
  const base = "/br/candidato/oportunidades";

  const hrefFor = (slug: NavItem["slug"]) =>
    id ? `${base}/${slug}/${id}` : `${base}/${slug}`;

  const isActive = (slug: NavItem["slug"]): boolean =>
    pathname.startsWith(`${base}/${slug}`);

  const itemCls = (active: boolean, disabled: boolean) =>
    [
      "flex items-center gap-3 rounded-lg px-3 py-2 text-gray-200 transition-colors",
      "hover:bg-blue-800 hover:text-white",
      active && "bg-gray-100 text-blue-900 font-semibold",
      disabled && "opacity-50 pointer-events-none",
    ]
      .filter(Boolean)
      .join(" ");

  const handleLogout = async () => {
    await logout("/");
  };

  return (
    // 1. O container principal agora é um flex-col
    <aside className="fixed inset-y-0 left-0 hidden w-72 flex-col bg-blue-900 text-white md:flex">
      {/* Seção do Logo (não muda) */}
      <div className="px-6 py-6 border-b border-white/10">
        <Image src={logo} alt="Logo NCM" width={200} priority />
      </div>

      {/* Seção da Navegação */}
      <nav className="flex-1 px-4 py-4 space-y-2">
        {NAV.map(({ label, slug, requiresId, icon }) => {
          const disabled = !!(requiresId && !id);
          const href = disabled ? "#" : hrefFor(slug);
          const active = isActive(slug);

          return (
            <li key={slug} style={{ listStyleType: 'none' }}>
              <Link
                href={href}
                aria-disabled={disabled}
                aria-current={active ? "page" : undefined}
                className={itemCls(active, disabled)}
              >
                {icon}
                <span>{label}</span>
              </Link>
            </li>
          );
        })}
      </nav>

      <div className="mt-auto border-t border-white/10 p-4">
        <div className="flex items-center justify-between gap-3">
          {/* Agrupar Avatar e Nome */}
          <div className="flex items-center gap-3 min-w-0">
            <Image
              src={userCandidate?.profilePictureUrl || avatar}
              alt="Avatar"
              width={40}
              height={40}
              className="rounded-full object-cover flex-shrink-0"
            />
            <div className="flex flex-col leading-tight min-w-0">
              <Link href={id ? `/br/candidato/oportunidades/perfil/${id}` : '#'}>
                <p className="font-semibold hover:underline truncate">
                  {userCandidate?.firstName} {userCandidate?.lastName}
                </p>
              </Link>
              <p className="text-xs text-white/70 truncate">{userCandidate?.email}</p>
            </div>
          </div>

          {/* 3. SINO ADICIONADO AQUI */}
          <div className="flex-shrink-0">
            <NotificationBell />
          </div>
        </div>

        <button
          type="button"
          onClick={handleLogout}
          disabled={isLoggingOut}
          className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-white/10 px-3 py-2 text-sm font-medium hover:bg-white/20 disabled:opacity-60"
        >
          {isLoggingOut ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" /> Saindo...
            </>
          ) : (
            <>
              <LogOut className="h-4 w-4" /> Sair
            </>
          )}
        </button>
      </div>
    </aside>
  );
}