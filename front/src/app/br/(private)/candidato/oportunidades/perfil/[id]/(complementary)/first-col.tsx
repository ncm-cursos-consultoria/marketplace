import { Globe2, Linkedin, Mail, Phone, Users2 } from "lucide-react";
import Image from "next/image";

interface firstColProps {
  firstName: string;
  lastName: string;
  firstLink: string;
  secondLink: string;
  email: string;
  profileImg: string
}

export function FirstCol() {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-5">
        <div className="bg-white rounded-2xl shadow-sm p-6 h-[35vh] w-[35vw]">
          <h3 className="text-sm font-semibold text-neutral-700">Sobre</h3>
          <p className="mt-3 text-sm text-neutral-700 leading-6">
            Sou desenvolvedor full‑stack com foco em experiências bem acabadas
            no front‑end e APIs escaláveis no back‑end. Curto TypeScript,
            arquitetura limpa e automações com DevOps.
          </p>
          <dl className="mt-5 space-y-3 text-sm text-neutral-700">
            <div className="flex items-center gap-2">
              <Globe2 className="h-4 w-4" />{" "}
              <a className="text-blue-600 hover:underline" href="#">
                lutm.dev
              </a>
            </div>
            <div className="flex items-center gap-2">
              <Linkedin className="h-4 w-4" />{" "}
              <a className="text-blue-600 hover:underline" href="#">
                /in/levi‑utima
              </a>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4" /> levi.utima@mediq.com.br
            </div>
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4" /> +55 (11) 90000‑0000
            </div>
          </dl>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-6 h-[35vh]">
          <div className="flex items-start justify-between">
            <h3 className="text-sm font-semibold text-neutral-700">
              Status do Perfil
            </h3>
            <span className="text-[11px] px-2 py-1 rounded-full bg-emerald-100 text-emerald-700">
              ACTIVE
            </span>
          </div>
          <p className="mt-3 text-sm text-neutral-700">
            Seu perfil está visível para recrutadores e empresas parceiras.
          </p>
          <div className="mt-4 rounded-xl border p-4 flex items-center gap-3">
            <Users2 className="h-5 w-5 text-blue-600" />
            <div>
              <p className="text-sm font-medium">
                Preferências de oportunidade
              </p>
              <p className="text-xs text-neutral-600">
                Remoto • Pleno • React, NestJS, PostgreSQL
              </p>
            </div>
          </div>
          <button className="mt-4 w-full h-10 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-sm">
            Atualizar preferências
          </button>
        </div>
      </div>

      <div className="">
        <article className="bg-white rounded-2xl shadow-sm p-5 w-full">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full overflow-hidden bg-neutral-200">
              <Image src="/favicon.ico" alt="avatar" width={40} height={40} />
            </div>
            <div>
              <p className="text-sm font-medium">Levi Yuki Utima</p>
              <p className="text-xs text-neutral-500">Atualizado há 1 semana</p>
            </div>
          </div>
          <p className="mt-4 text-sm leading-6 text-neutral-800">
            Concluí o curso de Arquitetura Limpa com foco em NestJS e apliquei
            no serviço de verificação de posts (crawler + IA) — performance
            melhorou 38%.
          </p>
          <div className="mt-4 flex items-center gap-2 text-xs">
            <span className="px-2 py-1 rounded-full bg-blue-100 text-blue-700">
              Curso
            </span>
            <span className="px-2 py-1 rounded-full bg-neutral-100 text-neutral-700">
              NestJS
            </span>
          </div>
        </article>
      </div>
    </div>
  );
}
