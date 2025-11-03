// components/enterprise/profile/terms-modal.tsx
"use client";

import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { EnterpriseData } from "@/types/enterprise";
import { ApiAddress } from "@/types/address";
import { formatAddress, formatCNPJ } from "@/utils/formatters";
import { UseUserEnteprise } from "@/context/user-enterprise.context";

interface TermsModalProps {
    isOpen: boolean;
    setIsOpen: (open: boolean) => void;
    onAccept: () => void;
    enterprise: EnterpriseData; // <-- MUDANÇA 1: Recebe o objeto
    address?: ApiAddress;      // <-- MUDANÇA 2: Recebe o endereço
}

interface ContractContentProps {
    enterprise: EnterpriseData;
    address?: ApiAddress;
}

// -----------------------------------------------------------------
// --- COLOQUE SEU CONTRATO AQUI ---
// -----------------------------------------------------------------
// -----------------------------------------------------------------
// --- COLOQUE SEU CONTRATO AQUI ---
// -----------------------------------------------------------------
function ContractContent({ enterprise, address }: ContractContentProps) {
    // Pré-formatar os dados para usar no JSX
    const cnpjFormatado = formatCNPJ(enterprise.cnpj);
    const enderecoFormatado = formatAddress(address);

    // Tente pegar o nome do usuário logado (se disponível no context)
    // Se não, deixe como placeholder
    const nomeResponsavel = "[Nome do Responsável Legal]"; // Você pode tentar pegar isso do seu UseUserEnteprise() se ele tiver

    return (
        <div className="space-y-4 text-sm text-neutral-700">
            <h2 className="text-lg font-bold text-center mb-6">
                CONTRATO DE ASSINATURA MENSAL DE SERVIÇOS
                <br />
                PLATAFORMA MARKETPLACE DAS OPORTUNIDADES
            </h2>

            <p>Pelo presente instrumento particular de contrato, as partes a seguir identificadas:</p>

            {/* --- CONTRATADA --- */}
            <div>
                <h3 className="font-semibold text-base">CONTRATADA:</h3>
                <p className="pl-2">
                    <strong>NCM SISTEMAS E CONSULTORIA LTDA</strong>, inscrita no CNPJ sob o nº
                    08.631.537/0001-61, com sede na cidade de São Paulo/SP, doravante
                    denominada “CONTRATADA”, responsável pela plataforma digital
                    Marketplace das Oportunidades.
                </p>
            </div>

            {/* --- CONTRATANTE --- */}
            <div>
                <h3 className="font-semibold text-base">CONTRATANTE:</h3>
                <p className="pl-2">
                    <strong>{enterprise.tradeName || "[Nome Fantasia]"}</strong>, inscrita no CNPJ sob o nº
                    {' '}{cnpjFormatado}, com sede em {enderecoFormatado}, neste ato representada
                    por seu responsável legal, doravante denominada “CONTRATANTE”.
                </p>
            </div>

            <p>
                Têm entre si, de forma justa e contratada, o presente Contrato de
                Assinatura Mensal de Serviços, que será regido pelas cláusulas e
                condições seguintes:
            </p>

            {/* --- CLÁUSULA 1 --- */}
            <div>
                <h3 className="font-semibold text-base">CLÁUSULA 1 – DO OBJETO</h3>
                <p>
                    1.1. O presente contrato tem por objeto a assinatura mensal do plano
                    corporativo da plataforma Marketplace das Oportunidades, que concede à
                    CONTRATANTE o direito de:
                </p>
                <ol className="list-alpha list-inside pl-4 space-y-1 mt-2">
                    <li>
                        Publicar vagas de emprego para profissionais da área de Tecnologia da
                        Informação (TI);
                    </li>
                    <li>
                        Ter acesso aos relatórios de assessment comportamental dos candidatos
                        que realizarem o teste disponibilizado na plataforma;
                    </li>
                    <li>
                        Ter acesso aos cursos livres e treinamentos disponíveis na
                        plataforma;
                    </li>
                    <li>
                        Participar do processo de recrutamento, seleção e contratação de
                        profissionais por meio da intermediação digital da CONTRATADA.
                    </li>
                </ol>
                <p className="mt-2">
                    1.2. Os serviços prestados compreendem a disponibilização de ambiente
                    virtual seguro, recursos de triagem de candidatos, ferramentas de
                    análise comportamental, e suporte técnico.
                </p>
            </div>

            {/* --- CLÁUSULA 2 --- */}
            <div>
                <h3 className="font-semibold text-base">CLÁUSULA 2 – DO PRAZO DE VIGÊNCIA</h3>
                <p>
                    2.1. O presente contrato terá vigência de 12 (doze) meses, contados a
                    partir da data de ativação da assinatura.
                </p>
                <p>
                    2.2. O contrato será renovado automaticamente por igual período, salvo
                    manifestação contrária por qualquer das partes, com antecedência
                    mínima de 30 (trinta) dias do término da vigência.
                </p>
            </div>

            {/* --- CLÁUSULA 3 --- */}
            <div>
                <h3 className="font-semibold text-base">CLÁUSULA 3 – DO VALOR E FORMA DE PAGAMENTO</h3>
                <p>
                    3.1. Pela assinatura mensal, a CONTRATANTE pagará à CONTRATADA o
                    valor de <strong>R$ 499,00 (quatrocentos e noventa e nove reais)</strong> por mês.
                </p>
                <p>
                    3.2. O pagamento será realizado por Cartão de Crédito, através do
                    gateway de pagamento internacional <strong>Stripe</strong>, conforme opção
                    escolhida no momento da contratação.
                </p>
                <p>
                    3.3. O não pagamento de qualquer mensalidade no prazo estipulado
                    implicará suspensão automática do acesso à plataforma, sem prejuízo
                    da cobrança dos valores devidos.
                </p>
            </div>

            {/* --- CLÁUSULA 4 --- */}
            <div>
                <h3 className="font-semibold text-base">CLÁUSULA 4 – DO REPASSE SOBRE CONTRATAÇÕES</h3>
                <p>
                    4.1. A CONTRATANTE reconhece que, para cada candidato contratado
                    através da intermediação da plataforma Marketplace das Oportunidades,
                    deverá efetuar o repasse de <strong>40% (quarenta por cento)</strong> do valor
                    bruto do primeiro salário do candidato contratado à CONTRATADA.
                </p>
                <p>
                    4.2. O pagamento desse repasse poderá ser parcelado em até 6 (seis)
                    vezes, por meio de Mercado Pago, PIX ou outro meio eletrônico
                    indicado pela CONTRATADA.
                </p>
                <p>
                    4.3. O repasse constitui a remuneração pelos serviços de
                    intermediação, divulgação de vagas, assessment comportamental e
                    indicação de candidatos.
                </p>
                <p>
                    4.4. O inadimplemento dessa obrigação autoriza a CONTRATADA a
                    suspender o acesso da CONTRATANTE à plataforma e inscrever o débito
                    em cobrança administrativa ou judicial, conforme o caso.
                </p>
            </div>

            {/* --- CLÁUSULA 5 --- */}
            <div>
                <h3 className="font-semibold text-base">CLÁUSULA 5 – DAS OBRIGAÇÕES DA CONTRATADA</h3>
                <ol className="list-alpha list-inside pl-4 space-y-1">
                    <li>
                        Disponibilizar à CONTRATANTE acesso à plataforma digital Marketplace
                        das Oportunidades;
                    </li>
                    <li>Manter a plataforma em ambiente seguro, estável e funcional;</li>
                    <li>Garantir sigilo e confidencialidade dos dados tratados;</li>
                    <li>
                        Oferecer suporte técnico remoto e atendimento eletrônico durante o
                        horário comercial.
                    </li>
                </ol>
            </div>

            {/* --- CLÁUSULA 6 --- */}
            <div>
                <h3 className="font-semibold text-base">CLÁUSULA 6 – DAS OBRIGAÇÕES DA CONTRATANTE</h3>
                <ol className="list-alpha list-inside pl-4 space-y-1">
                    <li>Efetuar os pagamentos nas condições previstas neste contrato;</li>
                    <li>
                        Utilizar os serviços exclusivamente para recrutamento, seleção e
                        capacitação profissional;
                    </li>
                    <li>
                        Informar à CONTRATADA quando houver contratação de candidatos
                        originados da plataforma;
                    </li>
                    <li>Manter sigilo sobre dados, relatórios e informações obtidas;</li>
                    <li>
                        Não reproduzir ou comercializar os materiais, relatórios ou cursos da
                        plataforma sem autorização prévia e expressa da CONTRATADA.
                    </li>
                </ol>
            </div>

            {/* --- CLÁUSULA 7 --- */}
            <div>
                <h3 className="font-semibold text-base">CLÁUSULA 7 – DA RESCISÃO</h3>
                <p>7.1. O presente contrato poderá ser rescindido:</p>
                <ol className="list-alpha list-inside pl-4 space-y-1 mt-2">
                    <li>Por qualquer das partes, mediante aviso prévio de 30 (trinta) dias;</li>
                    <li>De pleno direito, em caso de inadimplemento contratual;</li>
                    <li>
                        Por iniciativa da CONTRATADA, caso a CONTRATANTE utilize dados de
                        forma indevida ou ilícita.
                    </li>
                </ol>
                <p className="mt-2">
                    7.2. Em caso de rescisão antecipada sem justa causa por parte da
                    CONTRATANTE, esta deverá quitar as mensalidades vincendas até o
                    término do período contratado, a título de compensação contratual.
                </p>
            </div>

            {/* --- CLÁUSULA 8 --- */}
            <div>
                <h3 className="font-semibold text-base">CLÁUSULA 8 – CONFIDENCIALIDADE E PROTEÇÃO DE DADOS</h3>
                <p>
                    8.1. As partes comprometem-se a observar as disposições da Lei Geral
                    de Proteção de Dados (Lei nº 13.709/2018), zelando pela segurança e
                    confidencialidade das informações pessoais tratadas.
                </p>
                <p>
                    8.2. A CONTRATANTE reconhece que os relatórios comportamentais, perfis
                    de candidatos e demais dados disponibilizados são informações
                    confidenciais e de uso restrito.
                </p>
            </div>

            {/* --- CLÁUSULA 9 --- */}
            <div>
                <h3 className="font-semibold text-base">CLÁUSULA 9 – DISPOSIÇÕES GERAIS</h3>
                <p>
                    9.1. Este contrato não estabelece vínculo empregatício, societário ou
                    de representação entre as partes.
                </p>
                <p>
                    9.2. A adesão ao contrato é efetivada eletronicamente, no ato da
                    confirmação do pagamento da primeira mensalidade, equivalendo à
                    assinatura digital para todos os fins legais.
                </p>
                <p>
                    9.3. A CONTRATADA poderá atualizar os termos deste contrato mediante
                    comunicação prévia de 30 (trinta) dias à CONTRATANTE.
                </p>
                <p>
                    9.4. Todos os valores previstos neste contrato poderão ser reajustados
                    anualmente, conforme o índice oficial de inflação (IGP-M ou IPCA).
                </p>
            </div>

            {/* --- CLÁUSULA 10 --- */}
            <div>
                <h3 className="font-semibold text-base">CLÁUSULA 10 – DO FORO</h3>
                <p>
                    Fica eleito o foro da Comarca de São Paulo/SP, com renúncia expressa a
                    qualquer outro, por mais privilegiado que seja, para dirimir
                    quaisquer controvérsias oriundas deste contrato.
                </p>
            </div>

            {/* --- ENCERRAMENTO --- */}
            <p className="italic pt-4">
                E, por estarem justas e contratadas, as partes firmam o presente
                instrumento em meio eletrônico, com validade jurídica nos termos da
                legislação vigente.
            </p>

            <p className="pt-2">São Paulo, {new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })}.</p>

            {/* --- ASSINATURAS (Dinâmico) --- */}
            <div className="pt-4 space-y-1">
                <h4 className="font-semibold">CONTRATADA:</h4>
                <p>NCM SISTEMAS E CONSULTORIA LTDA</p>
                <p>CNPJ: 08.631.537/0001-61</p>
                <p>Representante: Nivaldo Costa Menezes – CEO</p>
            </div>

            <div className="pt-4 space-y-1">
                <h4 className="font-semibold">CONTRATANTE:</h4>
                <p>Nome: {enterprise.tradeName || "[Nome Fantasia]"}</p>
                <p>CNPJ: {cnpjFormatado}</p>
                <p>Responsável: {nomeResponsavel}</p>
            </div>
        </div>
    );
}
// -----------------------------------------------------------------
// -----------------------------------------------------------------

export function TermsModal({
    isOpen,
    setIsOpen,
    onAccept,
    enterprise, // <-- MUDANÇA 3: Recebe a prop
    address     // <-- MUDANÇA 4: Recebe a prop
}: TermsModalProps) {
    const [hasScrolledToEnd, setHasScrolledToEnd] = useState(false);
    const [isAccepted, setIsAccepted] = useState(false);
    const { userEnterprise } = UseUserEnteprise();

    // 1. Detecta a rolagem até o fim
    const handleScroll = (event: React.UIEvent<HTMLDivElement>) => {
        if (hasScrolledToEnd) return; // Otimização: não verificar mais

        const { scrollTop, scrollHeight, clientHeight } = event.currentTarget;

        // Verifica se chegou ao final (com uma margem de 10px)
        if (scrollTop + clientHeight >= scrollHeight - 10) {
            setHasScrolledToEnd(true);
        }
    };

    // 2. Função de aceite
    const handleAcceptClick = () => {
        if (isAccepted && hasScrolledToEnd) {
            onAccept(); // Chama a função do pai (que vai abrir o modal de pagamento)
        }
    };

    // 3. Reseta o estado interno se o modal for fechado (ex: pelo "X")
    const handleOpenChange = (open: boolean) => {
        if (!open) {
            setHasScrolledToEnd(false);
            setIsAccepted(false);
        }
        setIsOpen(open);
    };

    return (
        <Dialog open={isOpen} onOpenChange={handleOpenChange}>
            {/* Recomendo um modal maior para contratos */}
            <DialogContent className="sm:max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Termos de Serviço - Plano Standard</DialogTitle>
                    <DialogDescription>
                        Para continuar, leia o contrato abaixo e aceite os termos.
                    </DialogDescription>
                </DialogHeader>

                {/* 4. O Contrato Rolável */}
                <div
                    className="h-[350px] w-full rounded-md border p-4 bg-muted/30 overflow-y-auto"
                    onScroll={handleScroll}
                >
                    {/* A div duplicada foi removida */}
                    <ContractContent enterprise={enterprise} address={address} />
                </div>

                {/* 5. O Checkbox de Aceite */}
                <div className="flex items-center space-x-2 pt-2">
                    <Checkbox
                        id="terms"
                        disabled={!hasScrolledToEnd} // <--- Desabilitado até rolar
                        checked={isAccepted}
                        onCheckedChange={(checked) => setIsAccepted(checked as boolean)}
                    />
                    <label
                        htmlFor="terms"
                        className={`text-sm ${!hasScrolledToEnd
                            ? "text-muted-foreground"
                            : "text-primary font-medium"
                            }`}
                    >
                        {!hasScrolledToEnd
                            ? "Role até o final do contrato para habilitar"
                            : "Eu li e aceito os Termos de Serviço."}
                    </label>
                </div>

                <DialogFooter>
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => handleOpenChange(false)}
                    >
                        Cancelar
                    </Button>
                    <Button
                        type="button"
                        onClick={handleAcceptClick}
                        disabled={!isAccepted || !hasScrolledToEnd} // <--- Só habilita se tudo estiver OK
                    >
                        Continuar para Pagamento
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}