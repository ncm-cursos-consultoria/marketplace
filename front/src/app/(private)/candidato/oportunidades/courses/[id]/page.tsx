"use client";

import { CourseCard } from "@/components/card/course-card";
import { getAllCourses } from "@/service/course/get-all";
import { useQuery } from "@tanstack/react-query";

export default function CoursesPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["job"],
    queryFn: () => getAllCourses(),
  });

  console.log("teste", data);

  return (
    <div className="flex min-h-screen">
      <main className="flex-1 bg-gray-100 p-8 space-y-16">
        <h1 className="text-3xl font-bold mb-4">Cursos Disponíveis</h1>
        <p className="text-gray-700 text-lg mb-10">
          Explore os cursos por tema e escolha o que mais combina com seus
          objetivos.
        </p>
        <section>
          <h2 className="text-2xl font-semibold mb-6">Tecnologia</h2>
          {Array.isArray(data) &&
            data.map((course: any) => (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6" key={course.id}>
                <CourseCard
                  title={course.title}
                  description={course.description}
                  image="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQc-gvg0WjYVtXhQnbfQf-Y_-QRIuyYWrPa-A&s"
                />
              </div>
            ))}
        </section>

        {/* Tema 2: Negócios */}
        <section>
          <h2 className="text-2xl font-semibold mb-6">Negócios</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            <CourseCard
              title="Marketing Digital"
              description="Domine estratégias de marketing nas redes."
              image="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQc-gvg0WjYVtXhQnbfQf-Y_-QRIuyYWrPa-A&s"
            />
            <CourseCard
              title="SEO e Otimização"
              description="Aprenda a posicionar sites no Google."
              image="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQc-gvg0WjYVtXhQnbfQf-Y_-QRIuyYWrPa-A&s"
            />
            <CourseCard
              title="Branding e Identidade Visual"
              description="Construa marcas memoráveis."
              image="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQc-gvg0WjYVtXhQnbfQf-Y_-QRIuyYWrPa-A&s"
            />
          </div>
        </section>

        {/* Tema 3: Marketing */}

        {/* Footer */}
        <footer className="text-center text-gray-500 text-sm pt-6 border-t mt-10">
          &copy; {new Date().getFullYear()} Marketplace das Oportunidades. Todos
          os direitos reservados.
        </footer>
      </main>
    </div>
  );
}
