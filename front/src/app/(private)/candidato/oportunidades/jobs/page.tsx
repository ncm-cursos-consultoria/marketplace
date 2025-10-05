"use client";

import { JobCard } from "@/components/card/job-card";
import { jobs } from "@/utils/jobs-simulate";

export default function JobsPage() {

  return (
    <div className="flex min-h-screen">

      {/* Conteúdo principal */}
      <main className="flex-1 bg-gray-100 p-8 space-y-10">
        <h1 className="text-3xl font-bold mb-4">
          Vagas de Tecnologia em Santana de Parnaíba
        </h1>
        <p className="text-gray-700 text-lg mb-10">
          Confira as oportunidades de tecnologia disponíveis na cidade e
          candidate-se.
        </p>

        <div className="">
          <JobCard jobs={jobs}/>
        </div>

        {/* Footer */}
        <footer className="text-center text-gray-500 text-sm pt-6 border-t mt-10">
          &copy; {new Date().getFullYear()} Marketplace das Oportunidades. Todos
          os direitos reservados.
        </footer>
      </main>
    </div>
  );
}
