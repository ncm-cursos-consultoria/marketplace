"use client";

import { useState } from "react";
import { UseUserMentor } from "@/context/user-mentor.context";
import { Menu } from "lucide-react";
import { AsideMentor } from "@/components/mentor/aside";

export default function LayoutMentor({ children }: { children: React.ReactNode }) {
  const { userMentor } = UseUserMentor();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const typeUser = userMentor?.type;

  // Proteção básica de rota: Garante que apenas MENTOR acesse
  if (typeUser && typeUser !== "MENTOR") {
    return (
      <div className="flex items-center justify-center min-h-screen text-center p-6 bg-gray-50">
        <div className="max-w-md p-8 bg-white rounded-2xl shadow-sm border">
          <h2 className="text-xl font-bold text-red-600 mb-2">Acesso Restrito</h2>
          <p className="text-gray-600">Seu perfil atual não possui permissões de Mentor para acessar esta área.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* HEADER MOBILE: Visível apenas em telas menores que 768px (md) */}
      <header className="flex items-center justify-between p-4 bg-blue-900 text-white md:hidden sticky top-0 z-30 shadow-md">
        <div className="flex items-center gap-2">
          <span className="font-bold tracking-tight">Painel do Mentor</span>
        </div>
        <button
          onClick={() => setIsMenuOpen(true)}
          className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          aria-label="Abrir menu"
        >
          <Menu className="h-6 w-6" />
        </button>
      </header>

      <div className="flex flex-1">
        <AsideMentor isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />

        {/* CONTEÚDO PRINCIPAL: 
          - ml-0 no mobile (ocupa tudo)
          - md:ml-72 no desktop (respeita a largura do menu fixo) 
      */}
        <main className="transition-all duration-300 md:ml-72 min-h-screen">
          <div className="w-full max-w-[1400px] mx-auto p-6 lg:p-10">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}