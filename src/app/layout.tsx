import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/provider/provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Marketplace das oportunidades",
  description:
    "O Marketplace das Oportunidades é uma plataforma digital que conecta empresas, profissionais e instituições em busca de parcerias, talentos e soluções inovadoras. Seu principal objetivo é promover oportunidades de negócios, empregos, estágios, capacitações e serviços, facilitando a interação entre candidatos e empresas de forma ágil, segura e eficiente. Ideal para quem busca crescer no mercado ou encontrar novas possibilidades de atuação.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-br">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
