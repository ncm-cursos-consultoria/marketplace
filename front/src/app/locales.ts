export const SUPPORTED_LOCALES = ['pt-BR', 'es'] as const;
export type Locale = typeof SUPPORTED_LOCALES[number];

export const DEFAULT_LOCALE: Locale = 'pt-BR';

export function isSupportedLocale(l: string): l is Locale {
  return (SUPPORTED_LOCALES as readonly string[]).includes(l);
}
