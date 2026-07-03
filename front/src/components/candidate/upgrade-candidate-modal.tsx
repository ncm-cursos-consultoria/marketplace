"use client";

import { Button } from "@/components/ui/button";
import { postSubscriptionUserCandidate, postSubscriptionUserCandidateProps } from "@/service/subscription/post-subscription-user-candidate";
import { CardElement, Elements, useElements, useStripe } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CheckCircle2, Copy, DollarSign, Loader2, Upload } from "lucide-react";
import React, { useState } from "react";
import { toast } from "sonner";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

const NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "";
const stripePromise = loadStripe(NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

const CARD_ELEMENT_OPTIONS = {
    style: {
        base: {
            color: "hsl(var(--foreground))",
            fontFamily: "inherit",
            fontSmoothing: "antialiased",
            fontSize: "16px",
            "::placeholder": {
                color: "hsl(var(--muted-foreground))",
            },
        },
        invalid: {
            color: "hsl(var(--destructive))",
            iconColor: "hsl(var(--destructive))",
        },
    },
    hidePostalCode: true,
};

type ManualPixPayment = {
    id: string;
    expectedAmount: number;
    status: string;
    txid: string;
    pixPayload: string;
    qrCodeImageUrl: string;
    beneficiaryName: string;
};

interface CandidateCheckoutFormProps {
    userId: string;
    onSuccess: () => void;
}

function CandidateCheckoutForm({ userId, onSuccess }: CandidateCheckoutFormProps) {
    const stripe = useStripe();
    const elements = useElements();
    const queryClient = useQueryClient();
    const [pixPayment, setPixPayment] = useState<ManualPixPayment | null>(null);
    const [receiptFile, setReceiptFile] = useState<File | null>(null);
    const [isCreatingPix, setIsCreatingPix] = useState(false);
    const [isUploadingReceipt, setIsUploadingReceipt] = useState(false);

    const { mutate, isPending } = useMutation({
        mutationFn: postSubscriptionUserCandidate,
        onSuccess: () => {
            toast.success("Upgrade para Plano Standard realizado!");
            queryClient.invalidateQueries({ queryKey: ["authUser"] });
            setTimeout(() => onSuccess(), 2000);
        },
        onError: (backendError: any) => {
            const errorMessage =
                backendError.response?.data?.message ||
                backendError.message ||
                "Falha na assinatura. Verifique os dados do cartao.";

            toast.error(errorMessage);
        },
    });

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        if (!stripe || !elements) {
            toast.error("Stripe nao foi inicializado.");
            return;
        }

        const cardElement = elements.getElement(CardElement);
        if (!cardElement) {
            toast.error("Componente de cartao nao encontrado.");
            return;
        }

        const { error, paymentMethod } = await stripe.createPaymentMethod({
            type: "card",
            card: cardElement,
        });

        if (error) {
            toast.error(error.message || "Ocorreu um erro ao validar seu cartao.");
            return;
        }

        if (paymentMethod) {
            const payload: postSubscriptionUserCandidateProps = {
                id: userId,
                paymentMethodId: paymentMethod.id,
            };
            mutate(payload);
        }
    };

    const handlePixPayment = async () => {
        setIsCreatingPix(true);
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/manual-pix/candidate/${userId}`, {
                method: "POST",
                credentials: "include",
            });

            if (!res.ok) {
                const errorData = await res.json().catch(() => ({}));
                throw new Error(errorData.message || `Erro ${res.status}`);
            }

            setPixPayment(await res.json());
        } catch (err: any) {
            toast.error(err.message || "Erro ao gerar pagamento via Pix.");
        } finally {
            setIsCreatingPix(false);
        }
    };

    const handleUploadReceipt = async () => {
        if (!pixPayment || !receiptFile) {
            toast.error("Selecione o comprovante antes de enviar.");
            return;
        }

        setIsUploadingReceipt(true);
        try {
            const formData = new FormData();
            formData.append("file", receiptFile);

            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/manual-pix/${pixPayment.id}/receipt`, {
                method: "POST",
                credentials: "include",
                body: formData,
            });

            if (!res.ok) {
                const errorData = await res.json().catch(() => ({}));
                throw new Error(errorData.message || `Erro ${res.status}`);
            }

            setPixPayment(await res.json());
            toast.success("Comprovante enviado. Seu pagamento ficou pendente de revisao.");
            queryClient.invalidateQueries({ queryKey: ["authUser"] });
        } catch (err: any) {
            toast.error(err.message || "Erro ao enviar comprovante.");
        } finally {
            setIsUploadingReceipt(false);
        }
    };

    return (
        <>
            <div className="mb-4">
                <Button
                    type="button"
                    onClick={handlePixPayment}
                    disabled={isCreatingPix}
                    className="w-full bg-green-600 hover:bg-green-700"
                >
                    {isCreatingPix ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
                    Pagar Pix anual R$ 200,00
                </Button>
                <p className="text-xs text-center text-neutral-500 mt-1">
                    Plano anual, com liberacao apos revisao do comprovante
                </p>
            </div>

            {pixPayment && (
                <div className="mb-4 space-y-3 rounded-md border p-3 text-sm">
                    <div className="flex justify-center">
                        <img src={pixPayment.qrCodeImageUrl} alt="QR Code Pix" className="h-44 w-44" />
                    </div>
                    <div className="space-y-1">
                        <p><strong>Beneficiario:</strong> {pixPayment.beneficiaryName}</p>
                        <p><strong>Valor:</strong> R$ {Number(pixPayment.expectedAmount).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</p>
                        <p><strong>TXID:</strong> {pixPayment.txid}</p>
                        <p><strong>Status:</strong> {pixPayment.status}</p>
                    </div>
                    <Button
                        type="button"
                        variant="outline"
                        className="w-full"
                        onClick={() => navigator.clipboard.writeText(pixPayment.pixPayload).then(() => toast.success("Pix copia e cola copiado."))}
                    >
                        <Copy className="h-4 w-4 mr-2" />
                        Copiar Pix copia e cola
                    </Button>
                    <input
                        type="file"
                        accept="image/png,image/jpeg,application/pdf"
                        onChange={(event) => setReceiptFile(event.target.files?.[0] || null)}
                        className="w-full rounded-md border p-2 text-sm"
                    />
                    <Button
                        type="button"
                        onClick={handleUploadReceipt}
                        disabled={isUploadingReceipt || !receiptFile || pixPayment.status === "PENDING_REVIEW"}
                        className="w-full"
                    >
                        {isUploadingReceipt ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Upload className="h-4 w-4 mr-2" />}
                        Enviar comprovante
                    </Button>
                </div>
            )}

            <div className="flex items-center gap-2 mb-4">
                <div className="flex-1 h-px bg-neutral-200" />
                <span className="text-xs text-neutral-400">ou pague com cartao</span>
                <div className="flex-1 h-px bg-neutral-200" />
            </div>

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
                                Confirmar Pagamento R$ 19,99/mes
                            </>
                        )}
                    </Button>
                </DialogFooter>
            </form>
        </>
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
            <DialogContent className="sm:max-w-sm">
                <DialogHeader>
                    <DialogTitle>Upgrade para Plano Standard</DialogTitle>
                    <DialogDescription>
                        Escolha entre Pix anual ou cartao mensal para desbloquear todos os recursos.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-6 p-4 text-center">
                    <div>
                        <p className="text-3xl font-extrabold text-green-700">R$ 19,99</p>
                        <p className="text-sm text-neutral-500">por mes no cartao, ou R$ 200,00 por ano no Pix</p>
                    </div>

                    <ul className="list-disc list-inside space-y-2 text-sm text-gray-700 text-left mx-auto max-w-xs">
                        <li className="flex items-center gap-2">
                            <CheckCircle2 className="h-4 w-4 text-blue-600 flex-shrink-0" />
                            Acesso Ilimitado ao Portfolio de Cursos.
                        </li>
                        <li className="flex items-center gap-2">
                            <CheckCircle2 className="h-4 w-4 text-blue-600 flex-shrink-0" />
                            Visualizacao liberada de todos os Modulos.
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
                            Erro: A configuracao de pagamentos nao foi carregada.
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}