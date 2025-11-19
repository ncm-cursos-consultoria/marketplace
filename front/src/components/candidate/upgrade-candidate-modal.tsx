"use client";

import { Modal } from "@/components/modal";
import { Button } from "@/components/ui/button";
import { UseUserCandidate } from "@/context/user-candidate.context";
import { postSubscriptionUserCandidate, postSubscriptionUserCandidateProps } from "@/service/subscription/post-subscription-user-candidate";
import { PlanType } from "@/utils/interfaces";
import { CardElement, Elements, useElements, useStripe } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { DollarSign, Zap, CheckCircle2, Loader2 } from "lucide-react"; // Importar CheckCircle2
import React from "react";
import { toast } from "sonner";
// ADICIONE ISSO
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";

const NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "";
const stripePromise = loadStripe(NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

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
interface CandidateCheckoutFormProps {
    userId: string; // ID do candidato
    onSuccess: () => void;
}

function CandidateCheckoutForm({ userId, onSuccess }: CandidateCheckoutFormProps) {
    const stripe = useStripe();
    // 1. Usa o contexto do Candidato
    const { userCandidate } = UseUserCandidate();
    const elements = useElements();
    const queryClient = useQueryClient();

    const { mutate, isPending } = useMutation({
        // 2. Usa o serviço do candidato
        mutationFn: postSubscriptionUserCandidate,
        onSuccess: () => {
            toast.success("Upgrade para Plano Standard realizado!");

            // Invalida a query de usuário logado para refletir o novo plano
            queryClient.invalidateQueries({ queryKey: ["authUser"] });

            setTimeout(() => {
                onSuccess(); // Fecha o modal
            }, 2000);
        },
        onError: (backendError: any) => {
            const errorMessage =
                backendError.response?.data?.message ||
                backendError.message ||
                "Falha na assinatura. Verifique os dados do cartão.";

            toast.error(errorMessage);
        },
    });

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        if (!stripe || !elements) {
            toast.error("Stripe não foi inicializado.");
            return;
        }

        const cardElement = elements.getElement(CardElement);

        if (!cardElement) {
            toast.error("Componente de cartão não encontrado.");
            return;
        }

        const { error, paymentMethod } = await stripe.createPaymentMethod({
            type: "card",
            card: cardElement,
        });

        if (error) {
            toast.error(error.message || "Ocorreu um erro ao validar seu cartão.");
            return;
        }

        if (paymentMethod) {
            // 3. Envia o payload correto (ID do Candidato)
            const payload: postSubscriptionUserCandidateProps = {
                id: userId,
                paymentMethodId: paymentMethod.id,
            };
            mutate(payload);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="p-4 border rounded-md bg-transparent">
                <CardElement options={CARD_ELEMENT_OPTIONS} />
            </div>

            <DialogFooter>
                <Button
                    type="submit"
                    disabled={!stripe || isPending || NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY === ""}
                    className="w-full bg-green-600 hover:bg-green-700"
                >
                    {isPending ? (
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                        <>
                            <DollarSign className="h-4 w-4 mr-2" />
                            Confirmar Pagamento R$ 19,99/mês
                        </>
                    )}
                </Button>
            </DialogFooter>
        </form>
    );
}

interface UpgradeCandidateModalProps {
    isOpen: boolean;
    setIsOpen: (open: boolean) => void;
    userId: string;
}

export function UpgradeCandidateModal({ isOpen, setIsOpen, userId }: UpgradeCandidateModalProps) {
    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent className="sm:max-w-sm"> {/* Tamanho reduzido */}
                <DialogHeader>
                    <DialogTitle>Upgrade para Plano Standard</DialogTitle>
                    <DialogDescription>
                        Insira seus dados de pagamento para desbloquear todos os recursos.
                    </DialogDescription>
                </DialogHeader>

                {/* --- CONTEÚDO VISUAL --- */}
                <div className="space-y-6 p-4 text-center">
                    <p className="text-3xl font-extrabold text-green-700">R$ 19,99</p>
                    <p className="text-sm text-neutral-500">por mês</p>

                    <ul className="list-disc list-inside space-y-2 text-sm text-gray-700 text-left mx-auto max-w-xs">
                        <li className="flex items-center gap-2">
                            <CheckCircle2 className="h-4 w-4 text-blue-600 flex-shrink-0" />
                            Acesso Ilimitado ao Portfólio de Cursos.
                        </li>
                        <li className="flex items-center gap-2">
                            <CheckCircle2 className="h-4 w-4 text-blue-600 flex-shrink-0" />
                            Visualização liberada de todos os Módulos.
                        </li>
                    </ul>
                </div>

                <div className="py-4">
                    {NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ? (
                        <Elements stripe={stripePromise}>
                            <CandidateCheckoutForm
                                userId={userId}
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