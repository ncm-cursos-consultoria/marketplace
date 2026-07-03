"use client";

import React, { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Copy, DollarSign, Loader2, Upload } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postSubscriptionEnterprise } from "@/service/subscription/post-subscription-enterprise";
import { UseUserEnteprise } from "@/context/user-enterprise.context";

const NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "";

if (NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY === "") {
  console.error("Stripe: Chave publicavel nao configurada. Verifique NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY.");
} else if (!NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY.startsWith("pk_test_")) {
  console.warn("Voce esta usando uma chave publicavel do Stripe em modo LIVE. Certifique-se de que isso e intencional.");
}

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

interface CheckoutFormProps {
  enterpriseId: string;
  onSuccess: () => void;
}

function CheckoutForm({ enterpriseId, onSuccess }: CheckoutFormProps) {
  const stripe = useStripe();
  const { userEnterprise } = UseUserEnteprise();
  const elements = useElements();
  const queryClient = useQueryClient();
  const [pixPayment, setPixPayment] = useState<ManualPixPayment | null>(null);
  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const [isCreatingPix, setIsCreatingPix] = useState(false);
  const [isUploadingReceipt, setIsUploadingReceipt] = useState(false);

  const { mutate, isPending } = useMutation({
    mutationFn: postSubscriptionEnterprise,
    onSuccess: () => {
      toast.success("Upgrade realizado com sucesso!");
      queryClient.invalidateQueries({ queryKey: ["enterprise-profile", enterpriseId] });
      setTimeout(() => onSuccess(), 2000);
    },
    onError: (backendError: any) => {
      const errorMessage =
        backendError.response?.data?.message ||
        backendError.message ||
        "Falha ao se comunicar com o servidor. Tente novamente.";

      toast.error(errorMessage);
    },
  });

  if (NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY === "") {
    toast.error("Erro: Configuracao de pagamento invalida.", { duration: 10000 });
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      toast.error("Stripe nao foi inicializado. Tente recarregar a pagina.");
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
      mutate({
        id: userEnterprise?.id || "",
        paymentMethodId: paymentMethod.id,
      });
    }
  };

  const handlePixPayment = async () => {
    setIsCreatingPix(true);
    try {
      if (!userEnterprise?.id) {
       throw new Error("Usuario da empresa nao encontrado. Tente recarregar a pagina.");
      }
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/manual-pix/enterprise/${userEnterprise.id}`, {
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
      queryClient.invalidateQueries({ queryKey: ["enterprise-profile", enterpriseId] });
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
          Pagar Pix anual R$ 5.000,00
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
                Confirmar Pagamento R$ 500,00/mes
              </>
            )}
          </Button>
        </DialogFooter>
      </form>
    </>
  );
}

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
            Escolha entre Pix anual ou cartao mensal para desbloquear todos os recursos.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          {NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ? (
            <Elements stripe={stripePromise}>
              <CheckoutForm
                enterpriseId={enterpriseId}
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
