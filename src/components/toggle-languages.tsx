'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useMemo } from 'react';
import { BR as FlagBR, ES as FlagES } from 'country-flag-icons/react/3x2';

const LANGS = [
  { code: 'pt-BR', label: 'PT-BR', Icon: FlagBR },
  { code: 'es',    label: 'ES',    Icon: FlagES },
] as const;

type LangCode = typeof LANGS[number]['code'];

export function LanguageToggle() {
  const pathname = usePathname() || '/';

  const basePath = useMemo(() => {
    let p = pathname.replace(/^\/(pt-BR|es)(?=\/|$)/, '');
    if (p === '') p = '/';
    return p;
  }, [pathname]);

  const current = useMemo<LangCode>(() => {
    return /^\/es(\/|$)/.test(pathname) ? 'es' : 'pt-BR';
  }, [pathname]);

  const hrefFor = (code: LangCode) =>
    code === 'pt-BR' ? basePath : `/es${basePath === '/' ? '' : basePath}`;

  return (
    <div
      className="flex items-center gap-1 rounded-full border border-neutral-300 bg-white px-1 py-1 shadow-sm"
      aria-label="Trocar idioma"
    >
      {LANGS.map(({ code, label, Icon }) => {
        const active = code === current;
        return (
          <Link
            key={code}
            href={hrefFor(code)}
            className={`flex items-center gap-2 rounded-full px-3 py-1 text-sm transition ${
              active ? 'bg-neutral-200 font-semibold' : 'hover:bg-neutral-100'
            }`}
          >
            <Icon className="h-4 w-6 rounded-[2px]" title={label} />
            <span className="hidden sm:inline">{label}</span>
          </Link>
        );
      })}
    </div>
  );
}
