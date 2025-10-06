"use client";

import { ModuleSection } from "./modules";
import { PostedJobs } from "./posted-job";
import { RecentApplication } from "./recent-applications";

export default function EmpresaDashboardPage() {
  return (
    <div className="bg-gray-50">
      <div className="flex">
        <main className="w-full">
          <header className="mb-6">
            <h1 className="text-2xl md:text-3xl font-bold">
              Bem-vindo ao Painel da Empresa
            </h1>
            <p className="text-gray-600 mt-1">
              Publique vagas, gerencie candidaturas e acompanhe os resultados em
              um só lugar.
            </p>
          </header>
          <PostedJobs />
          <ModuleSection />
          {/* <RecentApplication /> */}
        </main>
      </div>
    </div>
  );
}
