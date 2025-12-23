"use client";
import { useState } from "react";
import { Aside } from "@/components/aside/aside";
import { Menu } from "lucide-react"; // Certifique-se de ter o lucide-react instalado

export default function LayoutOportunidades({ children }: { children: React.ReactNode }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="min-h-screen">
      {/* Gatilho Mobile */}
      <header className="flex items-center p-4 bg-white border-b md:hidden">
        <button onClick={() => setIsMenuOpen(true)}>
          <Menu className="h-6 w-6 text-blue-900" />
        </button>
      </header>

      {/* Precisaremos adicionar a prop isOpen no Aside depois */}
      <Aside isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
      
      {/* Ajuste: ml-0 no mobile e ml-72 (ou 300px) no desktop */}
      <main className="transition-all md:ml-72 min-h-screen bg-gray-50">
        {children}
      </main>
    </div>
  );
}