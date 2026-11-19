import Link from "next/link";
import { Header } from "@/components/header/__header";
import { HeaderResponsive } from "@/components/header/header-responsive/header-responsive";
import { TermsOfUseContent } from "@/components/candidate/terms-of-use";
import { EnterpriseTermsOfUse } from "@/components/enterprise/enterprise-terms-of-use";

export default function TermsAndConditionsPage() {
  return (
    <main className="min-h-screen bg-gray-50 text-gray-900">
      <div className="lg:block hidden"><Header /></div>
      <div className="lg:hidden"><HeaderResponsive /></div>

      <header className="bg-gradient-to-r from-blue-600 to-blue-400 px-4 py-12 text-center text-white">
        <h1 className="text-3xl font-bold md:text-4xl">Termos e condições</h1>
        <p className="mt-3 text-lg">Consulte os termos de uso para candidatos e empresas.</p>
      </header>

      <div className="mx-auto max-w-5xl space-y-8 px-4 py-10">
        <section aria-labelledby="candidate-terms" className="rounded-lg bg-white p-6 shadow-sm md:p-8">
          <h2 id="candidate-terms" className="mb-4 text-2xl font-bold text-blue-700">Termos de uso para candidatos</h2>
          <TermsOfUseContent fullPage />
        </section>

        <section aria-labelledby="enterprise-terms" className="rounded-lg bg-white p-6 shadow-sm md:p-8">
          <h2 id="enterprise-terms" className="mb-4 text-2xl font-bold text-blue-700">Termos de uso para empresas</h2>
          <EnterpriseTermsOfUse fullPage />
        </section>

        <div className="text-center">
          <Link href="/br" className="font-semibold text-blue-700 underline hover:text-blue-900">
            Voltar para a página inicial
          </Link>
        </div>
      </div>
    </main>
  );
}
