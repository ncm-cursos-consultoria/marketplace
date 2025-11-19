"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "./card";
import { CardHeader } from "./card-header";
import { Star, ArrowUpCircle, AlertTriangle, Loader2 } from "lucide-react"; // Adicionei AlertTriangle e Loader2
import { UpgradeModal } from "./upgrade-modal"; // 1. IMPORTE O MODAL AQUI
import { TermsModal } from "./terms-modal";
import { EnterpriseData } from "@/types/enterprise";
import { ApiAddress } from "@/types/address";
import { cancelSubscription } from "@/service/subscription/cancel-subscription"; // Importe a função de cancelamento
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"; // Importes do Dialog
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

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

// --- 1. COMPONENTE DO MODAL DE CANCELAMENTO ---
interface CancelSubscriptionModalProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  onConfirm: () => void;
  isPending: boolean;
}

function CancelSubscriptionModal({ isOpen, setIsOpen, onConfirm, isPending }: CancelSubscriptionModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-2 text-red-600 mb-2">
            <AlertTriangle className="h-6 w-6" />
            <DialogTitle>Cancelar Assinatura?</DialogTitle>
          </div>
          <DialogDescription className="pt-2">
            Tem certeza que deseja cancelar o plano <strong>Standard</strong> da sua empresa?
            <br /><br />
            Ao cancelar, você perderá os recursos premium ao final do ciclo de faturamento atual.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="gap-2 sm:gap-0 mt-4">
          <Button
            variant="outline"
            onClick={() => setIsOpen(false)}
            disabled={isPending}
          >
            Manter Plano
          </Button>

          <Button
            variant="destructive"
            onClick={onConfirm}
            disabled={isPending}
            className="bg-red-600 hover:bg-red-700"
          >
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Cancelando...
              </>
            ) : (
              "Sim, Cancelar"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function PlanCard({ enterprise, address, enterpriseId }: PlanCardProps) {
  // Estado para controlar a abertura do modal de upgrade
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);
  const [isTermsModalOpen, setIsTermsModalOpen] = useState(false);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const queryClient = useQueryClient();

  const { mutate: cancelPlan, isPending: isCanceling } = useMutation({
    mutationFn: () => cancelSubscription(enterpriseId), // Chama o serviço passando o ID
    onSuccess: () => {
      toast.success("Assinatura cancelada com sucesso.");
      // Invalida a query da empresa logada para atualizar a UI (mudar de volta para Basic ou mostrar status Cancelado)
      queryClient.invalidateQueries({ queryKey: ['authEnterprise'] });
      setTimeout(() => {
        window.location.reload();
      }, 1500);
      setIsCancelModalOpen(false);
    },
    onError: (error) => {
      console.error(error);
      toast.error("Erro ao cancelar assinatura. Tente novamente.");
      setIsCancelModalOpen(false);
    }
  });

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

        {/* --- PLANO BÁSICO (Fluxo de Upgrade) --- */}
        {plan === 'BASIC' && (
          <>
            <Button
              size="sm"
              onClick={() => setIsTermsModalOpen(true)}
              className="bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700"
            >
              <ArrowUpCircle className="h-4 w-4 mr-2" />
              Fazer upgrade para Standard
            </Button>

            <TermsModal
              isOpen={isTermsModalOpen}
              setIsOpen={setIsTermsModalOpen}
              onAccept={handleTermsAccepted}
              enterprise={enterprise}
              address={address}
            />

            <UpgradeModal
              isOpen={isUpgradeModalOpen}
              setIsOpen={setIsUpgradeModalOpen}
              enterpriseId={enterpriseId}
            />

            <div>
              <p className="text-xs text-neutral-500">
                Desbloqueie mais recursos e alcance mais candidatos com o plano Standard.
              </p>
              <p className="text-xs text-blue-500">
                *Teste por 30 dias grátis.
              </p>
            </div>
          </>
        )}

        {/* --- PLANO STANDARD (Fluxo de Cancelamento) --- */}
        {plan === 'STANDARD' && (
          <div className="w-full p-4 bg-blue-50 border border-blue-100 rounded-lg space-y-4">
            <div className="flex items-start justify-between">
              <p className="text-sm text-blue-800 font-medium">
                Você está aproveitando os benefícios do plano Standard.
              </p>
            </div>

            <div className="border-t border-blue-200 pt-3 flex justify-between items-center">
              <span className="text-xs text-blue-600">Deseja alterar seu plano?</span>
              <Button
                variant="destructive"
                size="sm"
                className="h-8 text-xs"
                onClick={() => setIsCancelModalOpen(true)} // Abre o modal
                disabled={isCanceling}
              >
                Cancelar Assinatura
              </Button>
            </div>
          </div>
        )}

        {plan === 'PREMIUM' && (
          <p className="text-sm text-neutral-600">
            Você possui todos os benefícios do plano Premium.
          </p>
        )}
      </div>

      {/* --- 4. RENDERIZAÇÃO DO MODAL DE CANCELAMENTO --- */}
      <CancelSubscriptionModal
        isOpen={isCancelModalOpen}
        setIsOpen={setIsCancelModalOpen}
        onConfirm={() => cancelPlan()}
        isPending={isCanceling}
      />
    </Card>
  );
}