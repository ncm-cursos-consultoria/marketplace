// src/app/[locale]/page.tsx

import ptbr from "@/languages/ptbr-home.json";
import es from "@/languages/es-home.json";
import HomeClient from "./homeclient";
import { DEFAULT_LOCALE, isSupportedLocale, Locale, SUPPORTED_LOCALES } from "../locales";


const MESSAGES: Record<Locale, any> = { "pt-BR": ptbr, es };

export function generateStaticParams() {
  return SUPPORTED_LOCALES.map((locale) => ({ locale }));
}

export default async function Page({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  const locale: Locale = isSupportedLocale(raw) ? (raw as Locale) : DEFAULT_LOCALE;
  const t = MESSAGES[locale];

  return <HomeClient t={t} locale={locale} />;
}
