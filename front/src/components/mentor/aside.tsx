"use client";

import {
  Home,
  Calendar,
  User,
  LogOut,
  X,
  BookOpen,
  Settings,
  Clock
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { UseUserMentor } from "@/context/user-mentor.context"; // Ajuste conforme seu contexto real
import { NotificationBell } from "./../notification/NotificationBell";

interface AsideMentorProps {
  isOpen?: boolean;
  onClose?: () => void;
}

type NavItem = {
  label: string;
  href: string;
  icon: React.ReactNode;
  slug: string;
};

export function AsideMentor({ isOpen, onClose }: AsideMentorProps) {
  const { userMentor, logout, isLoggingOut } = UseUserMentor();
  const pathname = usePathname() || "";
  const mentorId = userMentor?.id;

  const base = `/br/mentor/${mentorId}`;

  const NAV_ITEMS: NavItem[] = [
    { label: "Início", href: `${base}`, icon: <Home className="h-5 w-5" />, slug: "home" },
    { label: "Minha Agenda", href: `${base}/appointment`, icon: <Calendar className="h-5 w-5" />, slug: "agenda" },
    { label: "Disponibilidade", href: `${base}/availability`, icon: <Clock className="h-5 w-5" />, slug: "availability" },
    { label: "Meus Módulos", href: `${base}/module`, icon: <BookOpen className="h-5 w-5" />, slug: "modules" },
    { label: "Meu Perfil", href: `${base}/profile`, icon: <User className="h-5 w-5" />, slug: "profile" },
  ];

  const isActive = (href: string) => pathname === href;

  const itemCls = (active: boolean) =>
    `flex items-center gap-3 rounded-lg px-3 py-2 transition-colors text-lg ${
      active
        ? "bg-gray-100 text-blue-900 font-semibold shadow-sm"
        : "text-gray-200 hover:bg-blue-800 hover:text-white"
    }`;

  return (
    <>
      {/* Overlay para fechar o menu no mobile ao clicar fora */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 md:hidden animate-in fade-in duration-300" 
          onClick={onClose}
        />
      )}

      {/* Aside com lógica de transição e responsividade */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 flex w-72 flex-col bg-blue-900 text-white transition-transform duration-300 ease-in-out
        ${isOpen ? "translate-x-0" : "-translate-x-full"} 
        md:translate-x-0 md:sticky md:top-0 md:h-screen
      `}>
        
        {/* Seção Superior: Nome do Mentor e Botão Fechar */}
        <div className="px-6 py-6 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/10 font-bold text-white">
              <User />
            </div>
            <div className="leading-tight min-w-0">
              <p className="font-semibold truncate">{userMentor?.firstName || "Mentor"}</p>
              <p className="text-xs text-white/70 truncate">Área de Mentoria</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <NotificationBell />
            <button onClick={onClose} className="md:hidden text-white p-1 hover:bg-white/10 rounded">
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* Navegação Principal */}
        <nav className="flex-1 px-4 py-6 overflow-y-auto">
          <ul className="space-y-2">
            {NAV_ITEMS.map((item) => (
              <li key={item.slug}>
                <Link 
                  href={item.href} 
                  onClick={onClose} 
                  className={itemCls(isActive(item.href))}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Rodapé: Botão de Sair */}
        <div className="mt-auto border-t border-white/10 p-4">
          <button
            type="button"
            onClick={() => logout?.("/br/auth/sign-in")}
            disabled={isLoggingOut}
            className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-white/10 px-3 py-3 text-sm font-medium hover:bg-white/20 transition-colors disabled:opacity-60"
          >
            {isLoggingOut ? (
              <><Settings className="h-4 w-4 animate-spin" /> Saindo...</>
            ) : (
              <><LogOut className="h-4 w-4" /> Encerrar Sessão</>
            )}
          </button>
        </div>
      </aside>
    </>
  );
}