"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import logo from "@/assets/ncm-logo.png"
import Image from "next/image";

export function Aside() {
  const path = usePathname();

  return (
    <aside className="w-[300px] p-6 bg-blue-900 text-white space-y-6">
      <Image src={logo} alt="Logo ncm" width={200}/>
      <ul className="flex flex-col gap-4">
        <li>
          <Link
            href="/oportunidades/home"
            className={`block rounded-md hover:bg-neutral-600 hover:p-2 cursor-pointer text-[20px] ${
              path === "/oportunidades/home"
                ? "bg-neutral-800 p-2 w-full font-semibold text-[20px]"
                : ""
            }`}
          >
            Início
          </Link>
        </li>
        <li>
          <Link
            href="/oportunidades/courses"
            className={`block rounded-md hover:bg-neutral-600 hover:p-2 cursor-pointer text-[20px] ${
              path === "/oportunidades/courses"
                ? "bg-neutral-800 p-2 w-full font-semibold text-[20px]"
                : ""
            }`}
          >
            Cursos
          </Link>
        </li>
        <li>
          <Link
            href="/oportunidades/jobs"
            className={`block rounded-md hover:bg-neutral-600 hover:p-2 cursor-pointer text-[20px] ${
              path === "/oportunidades/jobs"
                ? "bg-neutral-800 p-2 w-full font-semibold text-[20px]"
                : ""
            }`}
          >
            Vagas
          </Link>
        </li>
                <li>
          <Link
            href="/oportunidades/user"
            className={`block rounded-md hover:bg-neutral-600 hover:p-2 cursor-pointer text-[20px] ${
              path === "/oportunidades/user"
                ? "bg-neutral-800 p-2 w-full font-semibold text-[20px]"
                : ""
            }`}
          >
            Minhas Candidaturas
          </Link>
        </li>
      </ul>
    </aside>
  );
}
