"use client";

import { motion } from "framer-motion";
import "bootstrap-icons/font/bootstrap-icons.css";
import { Header } from "@/components/header/__header";
import computerLp from "@/assets/landing-page-oportunidades.jpeg";
import Image from "next/image";
import fabricaDeProgramadores from "@/assets/fabrica-de-programadores.png";
import santanaDeParnaiba from "@/assets/santa-parnaiba.png";
import logo from "@/assets/logo-ncm-horizontal.svg";
import { HeaderResponsive } from "@/components/header/header-responsive/header-responsive";

const MotionImage = motion(Image);

export default function Home() {
  return (
    <main className="bg-white text-gray-900">
      <div>
        <div className="lg:block hidden">
          <Header />
        </div>
        <div className="lg:hidden">
          <HeaderResponsive />
        </div>
      </div>

      {/* Hero */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-400 text-white text-center py-16 md:py-24 px-4">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-3xl mx-auto"
        >
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 leading-tight">
            Marketplace das Oportunidades
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl mb-6 leading-relaxed">
            Conectando talentos, empresas e prefeituras de forma simples e
            eficaz
          </p>
          <a
            href="/auth/sign-up"
            className="bg-white text-black font-semibold px-6 py-3 rounded-md shadow hover:bg-gray-100 transition"
          >
            Crie sua conta agora
          </a>
        </motion.div>
      </section>

      {/* Sobre o projeto */}
      <section className="py-16 bg-white text-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl mx-auto"
        >
          <h2 className="text-4xl font-bold mb-4">Sobre o projeto</h2>
          <p className="text-gray-600 text-[20px]">
            Uma plataforma feita para conectar pessoas a oportunidades reais de
            crescimento profissional e social. Empresas, prefeituras e talentos
            se encontram aqui para mudar realidades.
          </p>
        </motion.div>
      </section>

      {/* Benefícios */}
      <section className="py-16 bg-gray-50 px-4">
        <div className="text-center mb-10">
          <h2 className="text-4xl font-bold">Benefícios para todos</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {[
            {
              icon: "bi-briefcase-fill",
              title: "Vagas Reais",
              desc: "Conecte-se a empresas verificadas e oportunidades de verdade.",
            },
            {
              icon: "bi-mortarboard-fill",
              title: "Capacitação Profissional",
              desc: "Cursos gratuitos e pagos para você se destacar no mercado.",
            },
            {
              icon: "bi-building",
              title: "Apoio às Prefeituras",
              desc: "Ferramentas para impulsionar o emprego nas cidades brasileiras.",
            },
          ].map((item, index) => (
            <motion.div
              key={index}
              whileInView={{ opacity: 1, y: 0 }}
              initial={{ opacity: 0, y: 40 }}
              transition={{ delay: index * 0.2, duration: 0.5 }}
              className="bg-white rounded-lg shadow-md p-6 text-center"
            >
              <i className={`bi ${item.icon} text-4xl text-blue-600 mb-4`} />
              <h4 className="font-semibold text-xl mb-2">{item.title}</h4>
              <p className="text-gray-600">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Como funciona */}
      <section className="py-16 bg-white px-4">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10 items-center">
          <MotionImage
            src={computerLp}
            alt="Ilustração"
            className="rounded-lg shadow-md"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
          />
          <motion.ul
            className="space-y-4 text-lg"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <li>
              <i className="bi bi-person-circle text-blue-600 me-2" /> Crie seu
              perfil
            </li>
            <li>
              <i className="bi bi-search text-blue-600 me-2" /> Busque vagas e
              cursos
            </li>
            <li>
              <i className="bi bi-send-check text-blue-600 me-2" /> Candidate-se
              ou entre em contato
            </li>
            <li>
              <i className="bi bi-bar-chart-line text-blue-600 me-2" />{" "}
              Acompanhe seu progresso
            </li>
          </motion.ul>
        </div>
      </section>

      {/* Parceiros */}
      <section className="py-16 bg-gray-50 px-4">
        <div className="text-center mb-10">
          <h2 className="text-4xl font-medium text-blue-600">
            Nossas parcerias com empresas e prefeituras
          </h2>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          viewport={{ once: true }}
          className="flex flex-col md:flex-row justify-center items-center gap-10 md:gap-40 px-4 md:px-0"
        >
          <Image
            src={fabricaDeProgramadores}
            alt="Fábrica de Programadores"
            width={200}
            height={90}
            unoptimized
          />

          <div className="flex flex-col items-center mt-6 md:mt-0">
            <Image
              src={santanaDeParnaiba}
              alt="Prefeitura de Santana de Parnaíba"
              width={130}
              height={90}
              unoptimized
            />
            <span className="mt-2 text-center text-sm md:text-base">
              Prefeitura de Santana de Parnaíba
            </span>
          </div>
        </motion.div>
      </section>

      {/* CTA Final */}
      <section className="py-16 text-white text-center bg-gradient-to-r from-blue-600 to-blue-400 px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-xl mx-auto"
        >
          <h2 className="text-3xl font-bold mb-4">Junte-se à comunidade</h2>
          <p className="text-lg mb-6">
            Comece agora mesmo sua jornada profissional com o apoio certo
          </p>
          <a
            href="/auth/sign-up"
            className="bg-white text-blue-600 font-semibold px-6 py-3 rounded-full shadow hover:bg-gray-100 transition"
          >
            Criar Conta Gratuita
          </a>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="text-center text-gray-500 text-sm py-6 border-t bg-white flex items-center justify-center">
        <div className="flex items-center gap-2">
          <p>
            © {new Date().getFullYear()} Marketplace das oportunidades.
            Desenvolvido por{" "}
          </p>
          <Image src={logo} alt="Logo ncm" width={50} />
        </div>
      </footer>
    </main>
  );
}
