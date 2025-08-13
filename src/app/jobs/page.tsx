'use client'

export default function JobsPage() {
  const jobs = [
    {
      title: "Desenvolvedor Front-end Pleno",
      company: "TechParnaíba",
      location: "Santana de Parnaíba, SP",
      type: "Híbrido",
      salary: "R$ 5.000,00",
    },
    {
      title: "Analista de Suporte Técnico",
      company: "Parnaíba Systems",
      location: "Santana de Parnaíba, SP",
      type: "Presencial",
      salary: "R$ 3.200,00",
    },
    {
      title: "Engenheiro de Software",
      company: "InovaTech",
      location: "Santana de Parnaíba, SP",
      type: "Remoto",
      salary: "R$ 8.000,00",
    },
    {
      title: "Desenvolvedor Back-end Júnior",
      company: "CodeParnaíba",
      location: "Santana de Parnaíba, SP",
      type: "Híbrido",
      salary: "R$ 4.200,00",
    },
  ];

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-blue-900 text-white p-6 space-y-6">
        <h2 className="text-2xl font-bold">Menu</h2>
        <ul className="space-y-4">
          <li><a href="/home" className="hover:underline">Início</a></li>
          <li><a href="/courses" className="hover:underline">Cursos</a></li>
          <li><a href="/jobs" className="hover:underline">Vagas</a></li>
          <li><a href="#" className="hover:underline">Sobre</a></li>
        </ul>
      </aside>

      {/* Conteúdo principal */}
      <main className="flex-1 bg-gray-100 p-8 space-y-10">
        <h1 className="text-3xl font-bold mb-4">Vagas de Tecnologia em Santana de Parnaíba</h1>
        <p className="text-gray-700 text-lg mb-10">
          Confira as oportunidades de tecnologia disponíveis na cidade e candidate-se.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {jobs.map((job, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition border border-neutral-300"
            >
              <h2 className="text-xl font-semibold text-blue-800 mb-2">{job.title}</h2>
              <p className="text-gray-600">{job.company} — {job.location}</p>
              <p className="text-gray-500 text-sm mt-1">Tipo: {job.type}</p>
              <p className="text-gray-500 text-sm">Salário: {job.salary}</p>
              <button className="mt-4 px-4 py-2 bg-blue-800 text-white rounded hover:bg-blue-700 transition cursor-pointer">
                Candidatar-se
              </button>
            </div>
          ))}
        </div>

        {/* Footer */}
        <footer className="text-center text-gray-500 text-sm pt-6 border-t mt-10">
          &copy; {new Date().getFullYear()} Marketplace das Oportunidades. Todos os direitos reservados.
        </footer>
      </main>
    </div>
  );
}
