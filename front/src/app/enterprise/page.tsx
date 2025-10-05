"use client";

import Link from "next/link";
import { CardMaterial } from "@/components/card/material-card";
import { PostedJobs } from "./posted-job";
import { RecentApplication } from "./recent-applications";
import { AsideEnterprise } from "@/components/enterprise/aside";

export default function EmpresaDashboardPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        <AsideEnterprise />
        <main className="flex-1 md:ml-0 px-4 md:px-8 lg:px-12 py-6 w-full">
          <header className="mb-6">
            <h1 className="text-2xl md:text-3xl font-bold">
              Bem-vindo ao Painel da Empresa
            </h1>
            <p className="text-gray-600 mt-1">
              Publique vagas, gerencie candidaturas e acompanhe os resultados em
              um só lugar.
            </p>
          </header>
          <section className="mb-10">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-xl font-semibold">Materiais e tutoriais</h2>
              <Link
                href="#"
                className="text-sm text-indigo-700 hover:underline"
              >
                Ver todos
              </Link>
            </div>
            <CardMaterial />
          </section>
          <PostedJobs />
          <RecentApplication />
        </main>
      </div>
    </div>
  );
}
