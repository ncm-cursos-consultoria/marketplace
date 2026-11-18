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
import carreiras from "@/assets/Imagem do WhatsApp de 2025-10-03 à(s) 10.01.05_4b03cd40.jpg";

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
            href="/br/auth/sign-up"
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
            Uma plataforma desenvolvida para conectar profissionais de TI a oportunidades 
            reais de desenvolvimento profissional e pessoal. Empresas, Prefeituras e Talentos 
            de Tecnologia se encontram para a Transformação Social.
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

          <Image
            src={carreiras}
            alt="Fábrica de Programadores"
            width={200}
            height={90}
            unoptimized
          />
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
            href="/br/auth/sign-up"
            className="bg-white text-blue-600 font-semibold px-6 py-3 rounded-full shadow hover:bg-gray-100 transition"
          >
            Criar Conta Gratuita
          </a>
        </motion.div>
      </section>

      {/* Informações comerciais, legais e de contato */}
      <section className="py-16 bg-gray-50 px-4">
        <div className="max-w-5xl mx-auto space-y-10">
          <div>
            <h2 className="text-3xl font-bold text-center mb-4">Serviços, contratação e valores</h2>
            <p className="text-gray-600 text-center max-w-3xl mx-auto">
              O Marketplace das Oportunidades conecta candidatos, empresas e parceiros. O cadastro
              permite acessar as funcionalidades disponíveis para cada perfil; serviços pagos são
              opcionais e suas condições são apresentadas antes da contratação.
            </p>
            <div className="grid md:grid-cols-2 gap-6 mt-8">
              <article className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-xl font-semibold mb-3">Para candidatos</h3>
                <ul className="list-disc pl-5 space-y-2 text-gray-600">
                  <li>Acesso gratuito às vagas publicadas e a cursos de capacitação.</li>
                  <li>A assinatura Standard é opcional e custa R$ 19,99 por mês no cartão de crédito ou R$ 200,00 no plano anual, pago via Pix.</li>
                  <li>Cursos adicionais são opcionais; preço e condições são informados na plataforma antes da compra.</li>
                  <li>Mentorias são contratadas pela plataforma após a escolha do módulo, mentor, horário disponível e valor por hora informado. A solicitação depende da aprovação do mentor; o pagamento é realizado após a aprovação e antes da sessão.</li>
                  <li>Não há cobrança do candidato por conseguir emprego ou ser contratado por empresa parceira.</li>
                </ul>
              </article>
              <article className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-xl font-semibold mb-3">Para empresas</h3>
                <ul className="list-disc pl-5 space-y-2 text-gray-600">
                  <li>A publicação de vagas e o uso das ferramentas de recrutamento seguem as condições aceitas no cadastro empresarial.</li>
                  <li>O acesso premium a relatórios comportamentais e cursos corporativos custa R$ 499,00 por mês, conforme os termos de adesão.</li>
                  <li>Em caso de contratação de candidato intermediado pela plataforma, aplica-se taxa de sucesso de 40% do primeiro salário bruto, independentemente da assinatura premium.</li>
                  <li>As condições completas, inclusive vigência e rescisão, constam nos termos apresentados no cadastro e devem ser conferidas antes do aceite.</li>
                </ul>
              </article>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 md:p-8">
            <h2 className="text-3xl font-bold text-center mb-6">Termos e condições</h2>
            <div className="space-y-4 text-gray-600">
              <p>O uso da plataforma depende da criação de uma conta e do aceite dos termos aplicáveis ao perfil de candidato, empresa ou parceiro, apresentados durante o cadastro.</p>
              <p>Vagas podem ser consultadas gratuitamente. Cursos extras, assinaturas e mentorias são opcionais. Para contratar uma mentoria, o candidato escolhe a oferta e horário, envia uma solicitação e aguarda a aprovação do mentor. Após a aprovação, o pagamento deve ser concluído para confirmar a sessão. O preço da mentoria é informado antes da solicitação.</p>
              <p>Os preços e condições de serviços pagos são exibidos antes da confirmação da compra. Assinaturas e serviços empresariais seguem também os prazos, cobranças e regras de cancelamento descritos nos termos apresentados à empresa no cadastro.</p>
              <p>A plataforma facilita o encontro entre candidatos e oportunidades; não garante contratação. Não existe cobrança do candidato por conseguir emprego. O tratamento de dados pessoais segue a legislação aplicável e as finalidades informadas no uso da plataforma.</p>
              <p>Ao criar uma conta, cada usuário declara que leu e aceitou os termos aplicáveis ao seu perfil.</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <article className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-2xl font-bold mb-4">Identificação da empresa</h2>
              <p className="text-gray-600"><strong>Razão social:</strong> NCM Sistemas e Consultoria Ltda</p>
              <p className="text-gray-600 mt-2"><strong>CNPJ / identificação fiscal:</strong> 08.631.537/0002-42</p>
            </article>
            <article className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-2xl font-bold mb-4">Fale conosco</h2>
              <p className="text-gray-600">Para dúvidas sobre a plataforma, serviços ou contratação, entre em contato pelo e-mail ou pelo WhatsApp (exclusivo para mensagens):</p>
              <a className="inline-block mt-3 text-blue-700 font-semibold underline" href="mailto:suporte@ncmconsultoria.com.br">suporte@ncmconsultoria.com.br</a>
              <a className="inline-block mt-2 text-blue-700 font-semibold underline" href="https://wa.me/5511948233217" target="_blank" rel="noopener noreferrer">WhatsApp: +55 11 94823-3217</a>
            </article>
          </div>
        </div>
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
