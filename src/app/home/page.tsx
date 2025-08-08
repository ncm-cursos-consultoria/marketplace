'use client'

import { CourseCard } from "@/components/Course-Card/course-card";


export default function Home() {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-blue-900 text-white p-6 space-y-6">
        <h2 className="text-2xl font-bold">Menu</h2>
        <ul className="space-y-4">
          <li><a href="#" className="hover:underline">Início</a></li>
          <li><a href="#" className="hover:underline">Cursos</a></li>
          <li><a href="#" className="hover:underline">Vagas</a></li>
          <li><a href="#" className="hover:underline">Sobre</a></li>
        </ul>
      </aside>

      {/* Conteúdo principal */}
      <main className="flex-1 bg-gray-100 p-8 space-y-16">
        {/* Section 1: Boas-vindas */}
        <section>
          <h1 className="text-3xl font-bold mb-4">Bem-vindo ao Marketplace das Oportunidades</h1>
          <p className="text-gray-700 text-lg">
            Encontre cursos, vagas e informações para transformar sua vida profissional.
          </p>
        </section>

        {/* Section 2: Cursos */}
        <section>
          <h2 className="text-2xl font-semibold mb-6">Cursos disponíveis</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            <CourseCard
              title="Curso de Programação"
              description="Aprenda lógica e programação do zero."
              image="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQc-gvg0WjYVtXhQnbfQf-Y_-QRIuyYWrPa-A&s"
            />
            <CourseCard
              title="Marketing Digital"
              description="Domine estratégias de marketing nas redes."
              image="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQc-gvg0WjYVtXhQnbfQf-Y_-QRIuyYWrPa-A&s"
            />
            <CourseCard
              title="Empreendedorismo"
              description="Torne-se seu próprio chefe com esse curso."
              image="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQc-gvg0WjYVtXhQnbfQf-Y_-QRIuyYWrPa-A&s"
            />
          </div>
        </section>

        {/* Section 3: Vagas */}
        <section>
          <h2 className="text-2xl font-semibold mb-6">Vagas de emprego</h2>
          <ul className="space-y-4">
            <li className="bg-white p-4 rounded shadow">
              <h3 className="font-semibold">Assistente Administrativo</h3>
              <p className="text-sm text-gray-600">Empresa XPTO — Fortaleza, CE</p>
            </li>
            <li className="bg-white p-4 rounded shadow">
              <h3 className="font-semibold">Desenvolvedor Front-end Júnior</h3>
              <p className="text-sm text-gray-600">TechDev — São Paulo, SP</p>
            </li>
            <li className="bg-white p-4 rounded shadow">
              <h3 className="font-semibold">Atendente de Loja</h3>
              <p className="text-sm text-gray-600">Loja Tal — Recife, PE</p>
            </li>
          </ul>
        </section>

        {/* Section 4: Informações gerais */}
        <section className="bg-white p-6 rounded shadow">
          <h2 className="text-xl font-semibold mb-2">Informações importantes</h2>
          <p className="text-gray-700">
            Nosso sistema conecta talentos com oportunidades reais. Aproveite todos os recursos disponíveis:
            capacitação, apoio e muito mais.
          </p>
        </section>

        {/* Footer */}
        <footer className="text-center text-gray-500 text-sm pt-6 border-t mt-10">
          &copy; {new Date().getFullYear()} Marketplace das Oportunidades. Todos os direitos reservados.
        </footer>
      </main>
    </div>
  )
}
