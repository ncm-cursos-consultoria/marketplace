"use client";

import { CourseCard } from "@/components/card/course-card";

export default function CoursesPage() {
  return (
    <div className="flex min-h-screen">

      {/* Conteúdo principal */}
      <main className="flex-1 bg-gray-100 p-8 space-y-16">
        <h1 className="text-3xl font-bold mb-4">Cursos Disponíveis</h1>
        <p className="text-gray-700 text-lg mb-10">
          Explore os cursos por tema e escolha o que mais combina com seus
          objetivos.
        </p>

        {/* Tema 1: Tecnologia */}

        <section>
          <h2 className="text-2xl font-semibold mb-6">Comportamento Empreendedor para Startups</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            <iframe
              width="100%"
              height="250"
              src="https://www.youtube.com/embed/3YyWO-lO4rM"
              title="Vídeo 1 - Negócios"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              className="rounded shadow"
            ></iframe>
            <iframe
              width="100%"
              height="250"
              src="https://www.youtube.com/embed/UlH6-T7xwEw"
              title="Vídeo 2 - Negócios"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              className="rounded shadow"
            ></iframe>
            <iframe
              width="100%"
              height="250"
              src="https://www.youtube.com/embed/Cfh0weATucA"
              title="Vídeo 3 - Negócios"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              className="rounded shadow"
            ></iframe>
          </div>
        </section>
        <section>
          <h2 className="text-2xl font-semibold mb-6">Tecnologia</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            <CourseCard
              title="Curso de Programação"
              description="Aprenda lógica e programação do zero."
              image="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQc-gvg0WjYVtXhQnbfQf-Y_-QRIuyYWrPa-A&s"
            />
            <CourseCard
              title="Desenvolvimento Web"
              description="Crie sites e aplicações web modernas."
              image="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQc-gvg0WjYVtXhQnbfQf-Y_-QRIuyYWrPa-A&s"
            />
            <CourseCard
              title="Introdução à Ciência de Dados"
              description="Descubra como trabalhar com dados e análises."
              image="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQc-gvg0WjYVtXhQnbfQf-Y_-QRIuyYWrPa-A&s"
            />
          </div>
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
