import React from "react";

export function PartnerTermsOfUse() {
  return (
    <div className="space-y-4 text-sm text-gray-700 max-h-[60vh] overflow-y-auto p-2 pr-4 text-justify">
      <h2 className="font-bold text-lg text-center text-black mb-4">
        CONTRATO DE PRESTAÇÃO DE SERVIÇOS E TERMOS DE USO
        DASHBOARD PARCEIRO
      </h2>

      <p>
        Pelo presente instrumento, <strong>NCM SISTEMAS E CONSULTORIA LTDA</strong> (CNPJ 08.631.537/0002-42), 
        doravante denominada <strong>CONTRATADA</strong>, estabelece as condições de acesso ao Dashboard Analítico 
        para o ente público ou entidade parceira que aderir a estes termos, doravante denominada <strong>PARCEIRO</strong>.
      </p>

      <h3 className="font-bold text-md text-black mt-4">1. OBJETO E ACESSO</h3>
      <p>1.1. O presente termo concede licença de uso do <strong>Dashboard Analítico</strong> para visualização de indicadores de empregabilidade, incluindo:</p>
      <ul className="list-disc pl-5 space-y-1">
        <li>Empresas ativas e vagas abertas;</li>
        <li>Candidatos cadastrados e contratados;</li>
        <li>Índice geral de empregabilidade;</li>
        <li><strong>Versão Completa:</strong> Relatórios detalhados, cursos e trilhas personalizadas.</li>
      </ul>

      <h3 className="font-bold text-md text-black mt-4">2. OBRIGAÇÕES DAS PARTES</h3>
      <p>
        2.1. A <strong>CONTRATADA</strong> deve manter a estabilidade do sistema e prestar suporte técnico em horário comercial.
      </p>
      <p>
        2.2. O <strong>PARCEIRO</strong> compromete-se a utilizar os dados exclusivamente para fins institucionais e manter sigilo das credenciais.
      </p>

      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-2 my-2">
        <h3 className="font-bold text-md text-black">3. VALOR E PAGAMENTO (Plano Completo)</h3>
        <p className="text-black font-semibold mt-1">
          3.1. O acesso básico é gratuito. Caso opte pela <strong>Versão Completa</strong>, o PARCEIRO pagará 
          o valor mensal de <strong>R$ 4.800,00 (quatro mil e oitocentos reais)</strong>.
        </p>
        <p className="mt-1">
          3.2. O pagamento será realizado via boleto ou transferência na data estipulada mensalmente.
        </p>
        <p className="mt-1">
          3.3. A inadimplência superior a <strong>30 (trinta) dias</strong> resultará na suspensão automática do acesso às funcionalidades completas.
        </p>
      </div>

      <h3 className="font-bold text-md text-black mt-4">4. VIGÊNCIA E RESCISÃO</h3>
      <p>
        4.1. O presente contrato tem vigência de <strong>12 (doze) meses</strong>, renovado automaticamente por iguais períodos.
      </p>
      <p>
        4.2. Poderá ser rescindido por qualquer das partes mediante aviso prévio de <strong>30 (trinta) dias</strong>.
      </p>

      <h3 className="font-bold text-md text-black mt-4">5. PROTEÇÃO DE DADOS (LGPD)</h3>
      <p>
        5.1. Ambas as partes comprometem-se a observar integralmente a Lei nº 13.709/2018 (LGPD). A CONTRATADA atua como operadora dos dados para fins de análise, e o PARCEIRO deve garantir a segurança no acesso às informações dos munícipes.
      </p>

      <h3 className="font-bold text-md text-black mt-4">6. FORO</h3>
      <p>
        6.1. Fica eleito o foro da Comarca de <strong>São Paulo/SP</strong> para dirimir quaisquer questões oriundas deste contrato.
      </p>

      <div className="mt-6 pt-4 border-t border-gray-200 text-xs text-gray-500 text-center">
        Atualizado em: {new Date().getFullYear()} | NCM SISTEMAS E CONSULTORIA LTDA
      </div>
    </div>
  );
}