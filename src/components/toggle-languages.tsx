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


  const basePath = useMemo(() => {
    const rx = /^\/(pt-BR|es)(\/|$)/;
    return pathname.replace(rx, '/');
  }, [pathname]);

  const current = useMemo(() => {
    const m = pathname.match(/^\/(pt-BR|es)(\/|$)/);
    return m?.[1] ?? 'pt-BR';
  }, [pathname]);

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
            href={`/${l.code}${basePath === '/' ? '' : basePath}`}
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
