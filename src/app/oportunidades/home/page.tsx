"use client";

import { CourseCard } from "@/components/card/course-card";
import { jobs } from "@/utils/jobs-simulate";

export default function Home() {
  return (
    <div className="flex min-h-screen">

      {/* Conteúdo principal */}
      <main className="flex-1 bg-gray-100 p-8 space-y-16">
        {/* Section 1: Boas-vindas */}
        <section>
          <h1 className="text-3xl font-bold mb-4">
            Bem-vindo ao Marketplace das Oportunidades
          </h1>
          <p className="text-gray-700 text-lg">
            Encontre cursos, vagas e informações para transformar sua vida
            profissional.
          </p>
        </section>

        {/* Section 2: Cursos */}
        <section>
          <h2 className="text-2xl font-semibold mb-6">Cursos disponíveis</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            <CourseCard
              title="Módulo 1"
              description="Introdução"
              video="https://www.youtube.com/embed/3YyWO-lO4rM"
            />
            <CourseCard
              title="Módulo 2"
              description="Nossos serviços"
              video="https://www.youtube.com/embed/UlH6-T7xwEw"
            />
            <CourseCard
              title="Módulo 3"
              description="Comportamento Empreendedor para Startups"
              video="https://www.youtube.com/embed/Cfh0weATucA"
            />
          </div>
        </section>

        {/* Section 3: Vagas */}
        <section>
          <h2 className="text-2xl font-semibold mb-6">Vagas de emprego</h2>
          <ul className="space-y-4">
            {jobs.slice(0, 3).map((job) => (
              <li className="bg-white p-4 rounded shadow" key={job.id}>
                <h3 className="font-semibold">{job.title}</h3>
                <p className="text-[14px]">{job.location}</p>
                <p className="text-[14px]">{job.salary}</p>
              </li>
            ))}
          </ul>
        </section>

        {/* Section 4: Informações gerais */}
        <section className="bg-white p-6 rounded shadow">
          <h2 className="text-xl font-semibold mb-2">
            Informações importantes
          </h2>
          <p className="text-gray-700">
            Nosso sistema conecta talentos com oportunidades reais. Aproveite
            todos os recursos disponíveis: capacitação, apoio e muito mais.
          </p>
        </section>

        {/* Footer */}
        <footer className="text-center text-gray-500 text-sm pt-6 border-t mt-10">
          &copy; {new Date().getFullYear()} Marketplace das Oportunidades. Todos
          os direitos reservados.
        </footer>
      </main>
    </div>
  );
}
