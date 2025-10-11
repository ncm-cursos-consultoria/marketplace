"use client";

import Image from "next/image";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import logo from "@/assets/ncm-logo.png";
import avatar from "@/assets/avatar.png";
import { UseUserCandidate } from "@/context/user-candidate.context";
import { LogOut, Loader2 } from "lucide-react";

type NavItem = {
  label: string;
  slug: "home" | "courses" | "jobs" | "user" | "teste-comportamental";
  requiresId?: boolean;
};

const NAV: NavItem[] = [
  { label: "Início", slug: "home", requiresId: true },
  { label: "Cursos", slug: "courses", requiresId: true },
  { label: "Vagas", slug: "jobs", requiresId: true },
  {label: "Teste Comportamental", slug: "teste-comportamental", requiresId: true}
];

export function Aside() {
  const { userCandidate, logout, isLoggingOut } = UseUserCandidate();
  const pathnameRaw = usePathname();
  const pathname = pathnameRaw || "";
  const params = useParams();

  const idFromContext = userCandidate?.id;
  const idFromParams = (params?.id as string | undefined) ?? undefined;
  const id: string | undefined = idFromContext ?? idFromParams;

  const base = "/br/candidato/oportunidades";

  const hrefFor = (slug: NavItem["slug"]) =>
    id ? `${base}/${slug}/${id}` : `${base}/${slug}`;

  const isActive = (slug: NavItem["slug"]): boolean =>
    pathname.startsWith(`${base}/${slug}`);

  const itemCls = (active: boolean, disabled: boolean) =>
    [
      "block rounded-md px-3 py-2 text-[20px] transition-colors",
      "hover:bg-neutral-600 cursor-pointer",
      active && "bg-neutral-800 font-semibold",
      disabled && "opacity-60 pointer-events-none cursor-not-allowed",
    ]
      .filter(Boolean)
      .join(" ");

  const handleLogout = async () => {
    await logout("/"); 
  };

  return (
    <aside className="fixed inset-y-0 left-0 w-[300px] h-screen bg-blue-900 text-white p-6 space-y-6 overflow-y-auto z-30">
      <Image src={logo} alt="Logo NCM" width={200} priority />

      <div className="flex flex-col items-start">
        <ul className="flex flex-col gap-2 w-full">
          {NAV.map(({ label, slug, requiresId }) => {
            const disabled: boolean = !!(requiresId && !id);
            const href = hrefFor(slug);
            const active: boolean = isActive(slug);

            return (
              <li key={slug}>
                <Link
                  href={href}
                  aria-disabled={disabled}
                  aria-current={active ? "page" : undefined}
                  className={itemCls(active, disabled)}
                  prefetch={!disabled}
                >
                  {label}
                </Link>
              </li>
            );
          })}
        </ul>
        <div className="mt-[430px] px-3  w-full">
          <div className="flex items-start gap-2">
            <Image
              src={(userCandidate?.profilePictureUrl as any) || avatar}
              alt="Avatar"
              width={40}
              height={40}
              className="rounded-full"
            />
            <Link href={`/br/candidato/oportunidades/perfil/${userCandidate?.id}`} className="flex flex-col leading-tight">
              <div className="flex items-center gap-1">
                <p className="font-semibold">{userCandidate?.firstName}</p>
                <p>{userCandidate?.lastName}</p>
              </div>
              <p className="text-[10px]">{userCandidate?.email}</p>
            </Link>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            disabled={isLoggingOut}
            aria-busy={isLoggingOut}
            className="mt-4 inline-flex items-center gap-2 rounded-md bg-white/10 px-3 py-2 text-sm font-medium hover:bg-white/20 disabled:opacity-60 disabled:cursor-not-allowed w-full cursor-pointer"
            title="Sair da conta"
          >
            {isLoggingOut ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Saindo...
              </>
            ) : (
              <>
                <LogOut className="h-4 w-4" />
                Sair
              </>
            )}
          </button>
        </div>
      </div>
    </aside>
  );
}
