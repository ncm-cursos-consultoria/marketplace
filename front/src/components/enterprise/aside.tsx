import {
  Briefcase,
  Building2,
  Home,
  MessageSquare,
  PlayCircle,
  Plus,
  Settings,
  Users,
} from "lucide-react";
import { NavItem } from "./nav-item";
import Link from "next/link";

export function AsideEnterprise() {
  return (
    <aside className="hidden md:flex md:flex-col md:w-64 bg-[#0D2E66] text-white min-h-screen sticky top-0">
      <div className="px-6 py-6 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-white/10 flex items-center justify-center font-bold"></div>
          <div className="leading-tight">
            <p className="font-semibold">NCM</p>
            <p className="text-xs text-white/70">sistema & consultoria</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-2 py-4 space-y-1">
        <NavItem href="#" icon={<Home className="h-4 w-4" />}>
          Início
        </NavItem>
        <NavItem href="#" icon={<Briefcase className="h-4 w-4" />}>
          Minhas Vagas
        </NavItem>
        <NavItem href="#" icon={<Users className="h-4 w-4" />}>
          Candidatos
        </NavItem>
        <NavItem href="#" icon={<PlayCircle className="h-4 w-4" />}>
          Materiais
        </NavItem>
        <NavItem href="#" icon={<MessageSquare className="h-4 w-4" />}>
          Mensagens
        </NavItem>
        <NavItem href="#" icon={<Building2 className="h-4 w-4" />}>
          Minha Empresa
        </NavItem>
        <NavItem href="#" icon={<Settings className="h-4 w-4" />}>
          Configurações
        </NavItem>
      </nav>

      <div className="p-4 mt-auto">
        <Link
          href="#"
          className="inline-flex items-center gap-2 w-full justify-center rounded-lg bg-white text-[#0D2E66] font-medium py-2"
        >
          <Plus className="h-4 w-4" /> Criar nova vaga
        </Link>
      </div>
    </aside>
  );
}
