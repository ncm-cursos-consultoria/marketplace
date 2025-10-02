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
  const _locale = isSupportedLocale(raw) ? raw : DEFAULT_LOCALE; // se não usar, tudo bem

  return <>{children}</>;
}
