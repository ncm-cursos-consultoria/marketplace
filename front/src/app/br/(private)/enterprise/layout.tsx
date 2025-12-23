'use client'
import { useState } from "react";
import { AsideEnterprise } from "@/components/enterprise/aside";
import { UseUserEnteprise } from "@/context/user-enterprise.context";
import { Menu } from "lucide-react";

export default function LayoutEnterprise({ children }: { children: React.ReactNode }) {
  const { userEnterprise } = UseUserEnteprise();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const typeUser = userEnterprise?.type;

  if (typeUser === "CANDIDATE") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        seu usuário não é uma empresa
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Gatilho Mobile */}
      <header className="flex items-center p-4 bg-blue-900 text-white md:hidden">
        <button onClick={() => setIsMenuOpen(true)}>
          <Menu className="h-6 w-6" />
        </button>
      </header>

      <AsideEnterprise isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
      
      {/* Ajuste: Removemos ml-72 e usamos md:ml-72 */}
      <main className="flex-1 p-6 lg:p-10 transition-all md:ml-72">
        {children}
      </main>
    </div>
  );
}