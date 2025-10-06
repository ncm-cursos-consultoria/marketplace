"use client";

import Image from "next/image";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import logo from "@/assets/ncm-logo.png";
import avatar from "@/assets/avatar.png";
import { UseUserCandidate } from "@/context/user-candidate.context";

type NavItem = {
  label: string;
  slug: "home" | "courses" | "jobs" | "user";
  requiresId?: boolean;
};

const NAV: NavItem[] = [
  { label: "Início", slug: "home", requiresId: true },
  { label: "Cursos", slug: "courses", requiresId: true },
  { label: "Vagas", slug: "jobs", requiresId: true },
  { label: "Minhas Candidaturas", slug: "user", requiresId: true },
];

export function Aside() {
  const { userCandidate } = UseUserCandidate();
  const pathnameRaw = usePathname();
  const pathname = pathnameRaw || ""; 
  const params = useParams();

  const idFromContext = userCandidate?.id;
  const idFromParams = (params?.id as string | undefined) ?? undefined;
  const id: string | undefined = idFromContext ?? idFromParams;

  const base = "/candidato/oportunidades";

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

  return (
    <aside className="fixed inset-y-0 left-0 w-[300px] h-screen bg-blue-900 text-white p-6 space-y-6 overflow-y-auto z-30">
      <Image src={logo} alt="Logo NCM" width={200} priority />
      <div className="flex flex-col items-start">
        <ul className="flex flex-col gap-2">
          {NAV.map(({ label, slug, requiresId }) => {
            const disabled: boolean = !!(requiresId && !id); // força boolean
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

        <div className="mt-[470px] px-3 py-2">
          <div className="flex items-start gap-2">
            <Image
              src={(userCandidate?.profilePicture as any) || avatar}
              alt="Avatar"
              width={40}
              height={40}
              className="rounded-full"
            />
            <div className="flex flex-col leading-tight">
              <div className="flex items-center gap-1">
                <p className="font-semibold">{userCandidate?.firstName}</p>
                <p>{userCandidate?.lastName}</p>
              </div>
              <p className="text-[10px]">{userCandidate?.email}</p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
