"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "./card";
import { CardHeader } from "./card-header";
import { Star, ArrowUpCircle } from "lucide-react";
import { UpgradeModal } from "./upgrade-modal"; // 1. IMPORTE O MODAL AQUI
import { TermsModal } from "./terms-modal";
import { EnterpriseData } from "@/types/enterprise";
import { ApiAddress } from "@/types/address";

type PlanType = 'BASIC' | 'STANDARD' | 'PREMIUM';

interface PlanCardProps {
  enterprise: EnterpriseData; // <-- MUDANÇA 1: Recebe o objeto
  address?: ApiAddress;      // <-- MUDANÇA 2: Recebe o endereço (opcional '?')
  enterpriseId: string;
}

// Mapeamento de estilos para os badges
const planStyles: Record<PlanType, string> = {
  BASIC: "bg-gray-100 text-gray-800 border-gray-200",
  STANDARD: "bg-blue-100 text-blue-800 border-blue-200",
  PREMIUM: "bg-purple-100 text-purple-800 border-purple-200",
};

// Mapeamento de nomes amigáveis
const planTranslations: Record<PlanType, string> = {
  BASIC: "Básico",
  STANDARD: "Standard",
  PREMIUM: "Premium",
};

export function PlanCard({ enterprise, address, enterpriseId }: PlanCardProps) {
  // Estado para controlar a abertura do modal de upgrade
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);
  const [isTermsModalOpen, setIsTermsModalOpen] = useState(false);

  const handleTermsAccepted = () => {
    setIsTermsModalOpen(false);  // Fecha o modal de Termos
    setIsUpgradeModalOpen(true); // Abre o modal de Pagamento
  };

  const plan = enterprise.plan;
  const planLabel = planTranslations[plan] || plan;

  return (
    <Card>
      <CardHeader title="Plano de Assinatura" />
      <div className="mt-4 flex flex-col items-start gap-4">
        <div className="flex items-center gap-2">
          <p className="text-sm text-neutral-600">Seu plano atual:</p>
          <Badge variant="secondary" className={`border ${planStyles}`}>
            <Star className="h-3 w-3 mr-1.5" />
            {planLabel}
          </Badge>
        </div>

        {/* Botão de Upgrade - Condicional */}
        {plan === 'BASIC' && (
          <>
            <Button
              size="sm"
              // 1. O ONCLICK (deve abrir os TERMOS)
              onClick={() => setIsTermsModalOpen(true)}
              className="bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700"
            >
              <ArrowUpCircle className="h-4 w-4 mr-2" />
              Fazer upgrade para Standard
            </Button>

            {/* 2. RENDERIZE OS DOIS MODAIS (sem 'if' em volta)
              A prop 'isOpen' de cada um cuida de mostrar/esconder.
            */}

            <TermsModal
              isOpen={isTermsModalOpen}
              setIsOpen={setIsTermsModalOpen}
              onAccept={handleTermsAccepted}
              enterprise={enterprise} // <-- MUDANÇA 4: Passe para o TermsModal
              address={address}       // <-- MUDANÇA 5: Passe para o TermsModal
            />

            <UpgradeModal
              isOpen={isUpgradeModalOpen} // <--- Controlado pelo seu estado
              setIsOpen={setIsUpgradeModalOpen}
              enterpriseId={enterpriseId}
            />

            <p className="text-xs text-neutral-500">
              Desbloqueie mais recursos e alcance mais candidatos com o plano Standard.
            </p>
          </>
        )}

        {plan === 'STANDARD' && (
          <p className="text-sm text-neutral-600">
            Você está aproveitando os benefícios do plano Standard.
          </p>
        )}
        {plan === 'PREMIUM' && (
          <p className="text-sm text-neutral-600">
            Você possui todos os benefícios do plano Premium.
          </p>
        )}
      </div>
    </Card>
  );
}

