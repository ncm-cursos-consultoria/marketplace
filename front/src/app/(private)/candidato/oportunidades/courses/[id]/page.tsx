"use client";

import { CourseCard } from "@/components/card/course-card";
import { getAllModules } from "@/service/module/get-all-modules";
import { useQuery } from "@tanstack/react-query";
import ncm from "@/assets/logo-ncm-horizontal.svg";
import Link from "next/link";

export default function CoursesPage() {
  const { data, isLoading } = useQuery({
    queryKey: [],
    queryFn: () => getAllModules(),
  });

  return (
    <div className="flex min-h-screen">
      <main className="flex-1 bg-gray-100 p-8 space-y-16">
        <h1 className="text-3xl font-bold mb-4">Cursos Disponíveis</h1>
        <p className="text-gray-700 text-lg mb-10">
          Explore os cursos por tema e escolha o que mais combina com seus
          objetivos.
        </p>
        <section>
          <h2 className="text-2xl font-semibold mb-6">
            Modeulo de Cursos Marketplace das Oportunidades
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {Array.isArray(data) &&
              data.map((course: any) => (
                <Link key={course.id} href={`/candidato/oportunidades/curso/${course.id}`}>
                  <CourseCard
                    key={course.id}
                    title={course.title}
                    description={course.description}
                    image={ncm}
                  />
                </Link>
              ))}
          </div>
        </section>
        <footer className="text-center text-gray-500 text-sm pt-6 border-t mt-10">
          &copy; {new Date().getFullYear()} Marketplace das Oportunidades. Todos
          os direitos reservados.
        </footer>
      </main>
    </div>
  );
}
