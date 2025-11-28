import React from "react";

export function TermsOfUseContent() {
  return (
    <div className="space-y-4 text-sm text-gray-700 max-h-[60vh] overflow-y-auto p-2 pr-4 text-justify">
      <h2 className="font-bold text-lg text-center text-black mb-4">
        TERMOS E CONDIÇÕES DE USO DA PLATAFORMA MARKETPLACE DAS OPORTUNIDADES
      </h2>

      <p>
        Pelo presente instrumento, <strong>NCM SISTEMAS E CONSULTORIA LTDA</strong>,
        inscrita no CNPJ nº 08.631.537/0001-61, doravante denominada <strong>PLATAFORMA</strong>,
        estabelece as condições de uso para qualquer pessoa física, doravante denominada <strong>CANDIDATO</strong>,
        que se cadastrar para utilizar os serviços oferecidos.
      </p>

      <h3 className="font-bold text-md text-black mt-4">1. OBJETO</h3>
      <p>
        1.1. O presente termo regula a prestação de serviços da PLATAFORMA para apoio ao desenvolvimento
        profissional do CANDIDATO, incluindo acesso a vagas, conteúdo educacional e funcionalidades de qualificação.
      </p>
      <p>
        1.2. A PLATAFORMA oferece ao CANDIDATO:
      </p>
      <ul className="list-disc pl-5 space-y-1">
        <li><strong>Acesso gratuito</strong> às vagas de emprego disponibilizadas;</li>
        <li><strong>Acesso gratuito a 02 (dois) cursos</strong> de capacitação;</li>
        <li>Acesso opcional a cursos adicionais e mentorias especializadas, mediante contratação de planos pagos.</li>
      </ul>
      <p>
        1.3. Não há cobrança pela obtenção de emprego, recolocação ou contratação do CANDIDATO por empresa parceira.
      </p>

      <h3 className="font-bold text-md text-black mt-4">2. PLANOS E SERVIÇOS PAGOS</h3>
      <p>
        2.1. A contratação de planos de assinatura, cursos extras ou mentorias é totalmente <strong>opcional</strong>.
      </p>
      <p>
        2.2. Valores e condições de pagamento serão apresentados de forma clara na PLATAFORMA antes de qualquer contratação efetiva.
      </p>

      <h3 className="font-bold text-md text-black mt-4">3. NATUREZA DO VÍNCULO</h3>
      <p>
        3.1. O aceite destes termos <strong>não estabelece qualquer vínculo empregatício</strong>, trabalhista ou societário
        entre o CANDIDATO e a PLATAFORMA.
      </p>
      <p>
        3.2. A PLATAFORMA atua exclusivamente como facilitadora tecnológica.
      </p>

      <h3 className="font-bold text-md text-black mt-4">4. OBRIGAÇÕES E RESPONSABILIDADES</h3>
      <p><strong>Da PLATAFORMA:</strong> Garantir acesso às vagas, manter ambiente seguro e proteger dados pessoais conforme a LGPD.</p>
      <p><strong>Do CANDIDATO:</strong> Preencher informações verdadeiras no perfil, utilizar a PLATAFORMA de forma ética e realizar pagamentos apenas se contratar serviços opcionais.</p>

      <h3 className="font-bold text-md text-black mt-4">5. PRIVACIDADE E DADOS (LGPD)</h3>
      <p>
        5.1. O CANDIDATO autoriza o tratamento de seus dados pessoais para fins de intermediação de vagas, execução de funcionalidades
        da plataforma e comunicações sobre cursos e mentorias, em conformidade com a Lei nº 13.709/2018 (LGPD).
      </p>
      <p>
        5.2. A PLATAFORMA compromete-se a não compartilhar dados sem finalidade legítima e respeitar os direitos do titular (acesso, correção, exclusão).
      </p>

      <h3 className="font-bold text-md text-black mt-4">6. ACEITE E VALIDADE</h3>
      <p>
        6.1. O aceite destes termos ocorre eletronicamente ao clicar no botão "Criar Conta" ou "Aceitar", possuindo validade jurídica
        conforme MP nº 2.200-2/2001 e Lei nº 14.063/2020.
      </p>
      <p>
        6.2. O CANDIDATO declara ter lido e concordado com todas as cláusulas aqui descritas.
      </p>

      <div className="mt-6 pt-4 border-t border-gray-200 text-xs text-gray-500 text-center">
        Atualizado em: {new Date().getFullYear()} | NCM SISTEMAS E CONSULTORIA LTDA
      </div>
    </div>
  );
}