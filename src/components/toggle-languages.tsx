'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useMemo } from 'react';

const LANGS = [
  { code: 'pt-BR', flag: '🇧🇷', label: 'PT-BR' },
  { code: 'es',    flag: '🇪🇸', label: 'ES' }
];

export function LanguageToggle() {
  const pathname = usePathname() || '/';

  // remove o prefixo de locale (pt-BR|es) do pathname
  const basePath = useMemo(() => {
    // remove só o prefixo de locale, sem adicionar barras extras
    let p = pathname.replace(/^\/(pt-BR|es)(?=\/|$)/, '');
    if (p === '') p = '/';
    return p;
  }, [pathname]);

  // idioma atual: se começar com /es -> es, senão pt-BR (root)
  const current = useMemo<'pt-BR' | 'es'>(() => {
    return /^\/es(\/|$)/.test(pathname) ? 'es' : 'pt-BR';
  }, [pathname]);

  const hrefFor = (code: 'pt-BR' | 'es') =>
    code === 'pt-BR'
      ? basePath // PT-BR SEM prefixo (root)
      : `/es${basePath === '/' ? '' : basePath}`; // ES COM prefixo

  return (
    <div
      className="flex items-center gap-1 rounded-full border border-neutral-300 bg-white px-1 py-1 shadow-sm"
      aria-label="Trocar idioma"
    >
      {LANGS.map((l) => {
        const active = l.code === current;
        return (
          <Link
            key={l.code}
            href={hrefFor(l.code)}
            className={`flex items-center gap-2 rounded-full px-3 py-1 text-sm transition
              ${active ? 'bg-neutral-200 font-semibold' : 'hover:bg-neutral-100'}`}
          >
            <span aria-hidden>{l.flag}</span>
            <span className="hidden sm:inline">{l.label}</span>
          </Link>
        );
      })}
    </div>
  );
}
