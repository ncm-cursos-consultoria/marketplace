import Image from "next/image"
import authLogo from "@/assets/lugar-de-trabalho-comercial-vazio-equipado-com-ferramentas-tecnologicas-modernas-para-servir-uma-empresa.jpg"

interface AuthLayoutProps {
  children: React.ReactNode
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="flex h-screen">
      <div className="w-1/2 h-full relative">
        <Image
          src={authLogo}
          alt="Imagem de fundo"
          fill
          className="object-cover"
          priority
        />
      </div>
      <div className="w-1/2 h-full flex items-center justify-center p-10 bg-white">
        {children}
      </div>
    </div>
  )
}
