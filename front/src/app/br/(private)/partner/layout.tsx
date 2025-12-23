"use client";
import { useState } from "react";
import { AsidePartner } from "@/components/partner/aside-partnert";
import { UseUserPartner } from "@/context/user-partner.context";
import { Menu } from "lucide-react";

export default function LayoutPartner({ children }: { children: React.ReactNode }) {
  const { userPartner } = UseUserPartner();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const typeUser = userPartner?.type; 

  if (!typeUser) return null; 

  if (typeUser !== "PARTNER") {
    return (
      <div className="flex items-center justify-center min-h-screen text-center">
        seu usuário não é parceiro
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Gatilho Mobile */}
      <header className="flex items-center p-4 bg-gray-900 text-white md:hidden">
        <button onClick={() => setIsMenuOpen(true)}>
          <Menu className="h-6 w-6" />
        </button>
      </header>

      <AsidePartner isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
      
      {/* Ajuste: m-[50px] para desktop apenas. No mobile m-4 ou p-4 */}
      <main className="transition-all p-4 md:ml-[280px] md:m-[50px]">
        {children}
      </main>
    </div>
  );
}