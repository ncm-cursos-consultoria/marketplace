import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/provider/provider";
// se usar next/font centralizado:
import { fontVars } from "@/styles/fonts";
import { AppProviders } from "@/components/provider/AppProviders";
import { Inter } from "next/font/google";
import { CookieBanner } from "@/components/cookies/banner";

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: "Marketplace das oportunidades",
  description:
    "O Marketplace das Oportunidades é uma plataforma digital que conecta empresas, profissionais e instituições em busca de parcerias, talentos e soluções inovadoras. Seu principal objetivo é promover oportunidades de negócios, empregos, estágios, capacitações e serviços, facilitando a interação entre candidatos e empresas de forma ágil, segura e eficiente. Ideal para quem busca crescer no mercado ou encontrar novas possibilidades de atuação.",
    icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        {/* 2. Envolva o {children} APENAS com o AppProviders */}
        <AppProviders>
          {children}
          <CookieBanner />
        </AppProviders>
      </body>
    </html>
  );
}
