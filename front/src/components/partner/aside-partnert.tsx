"use client";

import {
  Building,
  Home,
  LogOut,
  X,
} from "lucide-react";
import { NavItem } from "../enterprise/nav-item";
import { UseUserPartner } from "@/context/user-partner.context";

interface AsidePartnerProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export function AsidePartner({ isOpen, onClose }: AsidePartnerProps) {
  const { userPartner, logout, isLoggingOut } = UseUserPartner();

  return (
    <>
      {/* Overlay para fechar o menu ao clicar fora no mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 md:hidden" 
          onClick={onClose}
        />
      )}

      <aside className={`
        fixed inset-y-0 left-0 z-50 flex w-72 flex-col bg-[#0D2E66] text-white transition-transform duration-300 ease-in-out
        ${isOpen ? "translate-x-0" : "-translate-x-full"} 
        md:translate-x-0 md:sticky md:top-0 md:h-screen
      `}>
        
        {/* Cabeçalho do Aside com Botão de Fechar no Mobile */}
        <div className="px-6 py-6 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-white/10 flex items-center justify-center font-bold">
              <Building />
            </div>
            <div className="leading-tight">
              <p className="font-semibold">{userPartner?.firstName}</p>
              <p className="text-xs text-white/70">{userPartner?.lastName}</p>
            </div>
          </div>
          
          <button onClick={onClose} className="md:hidden text-white p-1">
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Navegação principal */}
        <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
          <div onClick={onClose}> {/* Fecha ao clicar no item no mobile */}
            <NavItem
              href={`/br/partner/${userPartner?.id}`}
              icon={<Home className="h-4 w-4" />}
            >
              Início
            </NavItem>
          </div>
        </nav>

        {/* Rodapé com botão de Logout */}
        <div className="p-4 mt-auto space-y-2 border-t border-white/10">
          <button
            type="button"
            onClick={() => logout?.("/br/auth/sign-in")}
            disabled={isLoggingOut}
            className="inline-flex items-center gap-2 w-full justify-center rounded-lg border border-white/20 text-white font-medium py-2 hover:bg-white/10 disabled:opacity-60 transition-colors"
          >
            <LogOut className="h-4 w-4" />
            {isLoggingOut ? "Saindo..." : "Sair"}
          </button>
        </div>
      </aside>
    </>
  );
}