// src/app/[locale]/layout.tsx
import type { ReactNode } from "react";
import { DEFAULT_LOCALE, isSupportedLocale } from "../locales";

export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  const locale = isSupportedLocale(raw) ? raw : DEFAULT_LOCALE;

  // NADA de <html>/<body> aqui. Só envolva os filhos.
  return <>{children}</>;
}
