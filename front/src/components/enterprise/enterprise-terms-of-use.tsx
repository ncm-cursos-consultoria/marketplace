import React from "react";

export function EnterpriseTermsOfUse() {
  return (
    <div className="space-y-4 text-sm text-gray-700 max-h-[60vh] overflow-y-auto p-2 pr-4 text-justify">
      <h2 className="font-bold text-lg text-center text-black mb-4">
        CONTRATO DE ADESÃO E TERMOS DE USO PARA EMPRESAS
        MARKETPLACE DAS OPORTUNIDADES
      </h2>

      <p>
        Pelo presente instrumento, <strong>NCM SISTEMAS E CONSULTORIA LTDA</strong> (CNPJ 08.631.537/0001-61), 
        doravante denominada <strong>CONTRATADA</strong>, estabelece as condições para a prestação de serviços 
        à pessoa jurídica que aderir a estes termos, doravante denominada <strong>CONTRATANTE</strong>.
      </p>

      <h3 className="font-bold text-md text-black mt-4">1. OBJETO DO SERVIÇO</h3>
      <p>1.1. A CONTRATADA disponibiliza através da Plataforma:</p>
      <ul className="list-disc pl-5 space-y-1">
        <li>Publicação ilimitada de vagas de TI;</li>
        <li>Participação no processo de recrutamento e triagem;</li>
        <li><strong>Mediante Assinatura:</strong> Acesso a relatórios de Assessment Comportamental e Cursos Corporativos.</li>
      </ul>

      <h3 className="font-bold text-md text-black mt-4">2. ASSINATURA MENSAL (Recursos Premium)</h3>
      <p>
        2.1. Para ter acesso aos <strong>Relatórios Comportamentais</strong> e <strong>Cursos</strong>, a CONTRATANTE pagará 
        o valor mensal de <strong>R$ 499,00 (quatrocentos e noventa e nove reais)</strong>.
      </p>
      <p>
        2.2. O não pagamento acarreta a suspensão imediata do acesso a estes recursos específicos, mas não isenta a CONTRATANTE 
        das demais obrigações financeiras (como a Taxa de Sucesso).
      </p>

      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-2 my-2">
        <h3 className="font-bold text-md text-black">3. TAXA DE SUCESSO (Contratação)</h3>
        <p className="text-black font-semibold mt-1">
          3.1. A CONTRATANTE reconhece que, para CADA candidato contratado através da intermediação da plataforma, 
          deverá pagar à CONTRATADA o valor de 40% (quarenta por cento) do primeiro salário bruto do candidato.
        </p>
        <p className="mt-1">
          3.2. Esta taxa é devida <strong>independentemente</strong> da empresa possuir ou não a assinatura mensal ativa.
        </p>
        <p className="mt-1">
          3.3. A CONTRATANTE obriga-se a informar a contratação em até <strong>5 (cinco) dias úteis</strong>.
        </p>
      </div>

      <h3 className="font-bold text-md text-black mt-4">4. VIGÊNCIA E RESCISÃO</h3>
      <p>
        4.1. O contrato de assinatura tem vigência de <strong>12 (doze) meses</strong>, com renovação automática, salvo aviso 
        prévio de 30 dias.
      </p>
      <p>
        4.2. Em caso de rescisão antecipada sem justa causa pela CONTRATANTE, deverão ser quitadas as mensalidades vincendas 
        até o final do período contratado.
      </p>

      <h3 className="font-bold text-md text-black mt-4">5. RESPONSABILIDADES E LGPD</h3>
      <p>
        5.1. A CONTRATANTE compromete-se a utilizar os dados dos candidatos exclusivamente para fins de recrutamento, 
        mantendo sigilo absoluto e observando a Lei nº 13.709/2018 (LGPD), sendo vedada a comercialização ou redistribuição de dados.
      </p>

      <h3 className="font-bold text-md text-black mt-4">6. VALIDADE DO ACEITE</h3>
      <p>
        6.1. A adesão a este contrato ocorre eletronicamente no ato do "Aceite" ou do primeiro pagamento, possuindo plena validade 
        jurídica e constituindo título executivo extrajudicial para cobrança de valores devidos.
      </p>

      <div className="mt-6 pt-4 border-t border-gray-200 text-xs text-gray-500 text-center">
        Atualizado em: {new Date().getFullYear()} | NCM SISTEMAS E CONSULTORIA LTDA
      </div>
    </div>
  );
}