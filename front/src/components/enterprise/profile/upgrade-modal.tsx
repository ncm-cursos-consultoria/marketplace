"use client";

import React, { useState } from "react";
// Importações padrão do NPM
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { toast } from "sonner"; // 1. IMPORTADO O TOAST (ex: sonner)

// --- IMPORTAÇÕES SHADCN/UI ---
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

// --- ÍCONES ---
import { Loader2 } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postSubscriptionEnterprise } from "@/service/subscription/post-subscription-enterprise";
import { UserEnterpriseProvider, UseUserEnteprise } from "@/context/user-enterprise.context";

// --- IMPORTANTE ---
// Lê a Chave Publicável (Publishable Key) do Stripe
// A partir do seu ficheiro .env.local (deve começar com NEXT_PUBLIC_ em Next.js)
const NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "";

if (NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY === "") {
  console.error("Stripe: Chave publicável não configurada. Verifique seu arquivo .env.local e a variável NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY.");
  // Não mostre um toast aqui, pois pode ser chamado antes do provider do toast estar pronto
} else if (!NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY.startsWith("pk_test_")) {
  console.warn("Você está usando uma chave publicável do Stripe em modo LIVE. Certifique-se de que isso é intencional.");
}

const stripePromise = loadStripe(NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

// Estilização básica para o CardElement do Stripe se adequar ao shadcn/ui
const CARD_ELEMENT_OPTIONS = {
  style: {
    base: {
      color: "hsl(var(--foreground))", // Cor do texto do shadcn
      fontFamily: "inherit",
      fontSmoothing: "antialiased",
      fontSize: "16px",
      "::placeholder": {
        color: "hsl(var(--muted-foreground))", // Cor do placeholder do shadcn
      },
    },
    invalid: {
      color: "hsl(var(--destructive))", // Cor de erro do shadcn
      iconColor: "hsl(var(--destructive))",
    },
  },
  hidePostalCode: true, // Oculta o campo de CEP (comum no Brasil)
};

// --- Componente Interno do Formulário de Checkout ---
interface CheckoutFormProps {
  enterpriseId: string;
  onSuccess: () => void; // Função para fechar o modal
}

function CheckoutForm({ enterpriseId, onSuccess }: CheckoutFormProps) {
  const stripe = useStripe();
  const { userEnterprise } = UseUserEnteprise();
  const elements = useElements();
  // const [isPending, setLoading] = useState(false); // 1. REMOVIDO: Substituído por isPending

  // --- CONFIGURAÇÃO DO REACT QUERY ---
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    // A função que faz a chamada à API
    mutationFn: postSubscriptionEnterprise,

    // O que fazer em caso de SUCESSO
    onSuccess: () => {
      toast.success("Upgrade realizado com sucesso!");

      // 2. INVALIDAR A KEY (como solicitado)
      queryClient.invalidateQueries({ queryKey: ["enterprise-profile", enterpriseId] });

      setTimeout(() => {
        onSuccess(); // Fecha o modal
        // window.location.reload();
      }, 2000);
    },

    // O que fazer em caso de ERRO
    onError: (backendError: any) => {
      // Reutiliza a sua lógica de tratamento de erro
      const errorMessage =
        backendError.response?.data?.message ||
        backendError.message ||
        "Falha ao se comunicar com o servidor. Tente novamente.";

      toast.error(errorMessage);
    },
  });

  // Alerta de configuração no checkout, se necessário
  if (NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY === "") {
    toast.error("Erro: Configuração de pagamento inválida.", { duration: 10000 });
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      toast.error("Stripe não foi inicializado. Tente recarregar a página.");
      return;
    }

    const cardElement = elements.getElement(CardElement);

    if (!cardElement) {
      toast.error("Componente de cartão não encontrado.");
      return;
    }

    // 1. Criar o PaymentMethod no Stripe (permanece igual)
    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: "card",
      card: cardElement,
    });

    if (error) {
      toast.error(error.message || "Ocorreu um erro ao validar seu cartão.");
      return;
    }

    // 2. Enviar para o backend (AGORA USANDO O MUTATE)
    if (paymentMethod) {
      try {
        const payload = {
          id: userEnterprise?.id || "",
          paymentMethodId: paymentMethod.id,
        };

        // 3. CHAMA A MUTATION (substitui o try/catch e o await)
        mutate(payload);

      } catch (backendError: any) {
        // O bloco catch foi removido, pois o 'onError' do useMutation
        // já cuida disso. Deixei o 'try' aqui por segurança caso
        // a criação do 'payload' falhe (o que é raro).
        // Se 'payload' falhar, podemos adicionar um toast aqui.
        toast.error("Erro ao preparar os dados para envio.");
      }
    }
    // setLoading(false); // REMOVIDO (isPending cuida disso)
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Container para o Elemento do Cartão do Stripe */}
      <div className="p-4 border rounded-md bg-transparent">
        <CardElement options={CARD_ELEMENT_OPTIONS} />
      </div>

      <DialogFooter>
        <Button
          type="submit"
          disabled={!stripe || isPending || NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY === ""} // Desabilita se a chave estiver em falta
          className="w-full"
        >
          {isPending ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : null}
          {isPending ? "Processando..." : "Confirmar Upgrade (R$ 499,90)"}
        </Button>
      </DialogFooter>
      <p className="text-xs text-center text-neutral-500">
        Pagamento seguro processado por Stripe.
      </p>
    </form>
  );
}

// --- Componente Principal do Modal (Exportado) ---

interface UpgradeModalProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  enterpriseId: string;
}

export function UpgradeModal({ isOpen, setIsOpen, enterpriseId }: UpgradeModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Upgrade para o Plano Standard</DialogTitle>
          <DialogDescription>
            Insira seus dados de pagamento para desbloquear todos os recursos.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          {/* O Provider <Elements> deve envolver o formulário de checkout */}
          {/* Adicionada verificação para não renderizar se a chave estiver em falta */}
          {NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ? (
            <Elements stripe={stripePromise}>
              <CheckoutForm
                enterpriseId={enterpriseId}
                onSuccess={() => setIsOpen(false)}
              />
            </Elements>
          ) : (
            <div className="text-center text-sm text-destructive">
              Erro: A configuração de pagamentos não foi carregada.
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

