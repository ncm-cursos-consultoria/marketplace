'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BR as FlagBR, ES as FlagES } from 'country-flag-icons/react/3x2';

export function LanguageToggle() {
  const pathname = usePathname();
  const isES = pathname?.startsWith('/es');
  const isBR = pathname?.startsWith('/') || !isES; // padrão PT-BR

  return (
    <div
      className="inline-flex items-center gap-1 rounded-full border border-neutral-300 bg-white px-1 py-1 shadow-sm"
      aria-label="Trocar idioma"
    >
      <Link
        href="/"
        className={`flex items-center gap-2 rounded-full px-3 py-1 text-sm transition ${
          isBR ? 'bg-neutral-200 font-semibold' : 'hover:bg-neutral-100'
        }`}
      >
        <FlagBR className="h-4 w-6 rounded-[2px]" title="PT-BR" />
        <span className="hidden sm:inline">PT-BR</span>
      </Link>

      <Link
        href="/es"
        className={`flex items-center gap-2 rounded-full px-3 py-1 text-sm transition ${
          isES ? 'bg-neutral-200 font-semibold' : 'hover:bg-neutral-100'
        }`}
      >
        <FlagES className="h-4 w-6 rounded-[2px]" title="ES" />
        <span className="hidden sm:inline">ES</span>
      </Link>
    </div>
  );
}
