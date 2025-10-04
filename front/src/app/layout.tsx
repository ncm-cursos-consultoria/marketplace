import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/provider/provider";
// se usar next/font centralizado:
import { fontVars } from "@/styles/fonts";

export const metadata: Metadata = {
  title: "Marketplace das oportunidades",
  description:
    "O Marketplace das Oportunidades é uma plataforma digital que conecta empresas, profissionais e instituições em busca de parcerias, talentos e soluções inovadoras. Seu principal objetivo é promover oportunidades de negócios, empregos, estágios, capacitações e serviços, facilitando a interação entre candidatos e empresas de forma ágil, segura e eficiente. Ideal para quem busca crescer no mercado ou encontrar novas possibilidades de atuação.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className={`${fontVars ?? ""} antialiased`.trim()}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
