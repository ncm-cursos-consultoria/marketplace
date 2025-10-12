import Image from "next/image";
import authLogo from "@/assets/lugar-de-trabalho-comercial-vazio-equipado-com-ferramentas-tecnologicas-modernas-para-servir-uma-empresa.jpg";

interface AuthLayoutProps {
  children: React.ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="flex h-screen">
      {/* Imagem só aparece em telas md pra cima */}
      <div className="hidden md:block w-1/2 h-full relative">
        <Image
          src={authLogo}
          alt="Imagem de fundo"
          unoptimized
          className="object-cover"
          fill
        />
      </div>

      {/* Área do formulário */}
      <div className="w-full md:w-1/2 h-full flex items-center justify-center p-6 md:p-10 bg-white">
        <div className="w-full max-w-md">{children}</div>
      </div>
    </div>
  );
}
