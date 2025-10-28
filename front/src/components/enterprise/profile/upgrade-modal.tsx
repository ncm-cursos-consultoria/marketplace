"use client";

import { useState, useEffect, useRef } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Modal } from '@/components/modal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
// O Select do shadcn/ui não é usado mais para os campos do MP,
// pois a biblioteca precisa de <select> HTML puro.
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Lock, CreditCard } from 'lucide-react';
import { api } from '@/service/api';

// Importa do NOVO pacote Core JS
import { loadMercadoPago } from '@mercadopago/sdk-js';

// Adicione esta declaração logo abaixo dos seus imports
declare global {
    interface Window {
        MercadoPago: any; // Informa ao TypeScript que window.MercadoPago existe
    }
}

// Chave pública
const MERCADO_PAGO_PUBLIC_KEY = process.env.NEXT_PUBLIC_MERCADO_PAGO_PUBLIC_KEY;

// Função para chamar o backend (sem alterações)
async function subscribeToStandardPlan(enterpriseId: string, cardTokenId: string): Promise<void> {
    await api.post(`/payment/enterprise/${enterpriseId}/subscribe`, null, {
        params: { cardTokenId }
    });
}

interface UpgradeModalProps {
    isOpen: boolean;
    setIsOpen: (open: boolean) => void;
    enterpriseId: string;
}

export function UpgradeModal({ isOpen, setIsOpen, enterpriseId }: UpgradeModalProps) {
    const queryClient = useQueryClient();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [mercadoPagoError, setMercadoPagoError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true); // Loading para o formulário do MP

    // Ref para guardar a instância do CardForm
    const cardFormRef = useRef<any>(null);

    // --- Mutação (sem alterações na lógica, apenas como é chamada) ---
    const { mutate, isPending } = useMutation({
        mutationFn: (cardTokenId: string) => subscribeToStandardPlan(enterpriseId, cardTokenId),
        onSuccess: () => {
            toast.success("Upgrade realizado com sucesso!", { description: "Seu plano foi atualizado para Standard." });
            queryClient.invalidateQueries({ queryKey: ["enterprise-profile", enterpriseId] });
            queryClient.invalidateQueries({ queryKey: ["enterprise", enterpriseId] });
            setIsOpen(false);
        },
        onError: (error: any) => {
            console.error("Erro na assinatura:", error);
            const message = error?.response?.data?.message || error.message || "Falha ao processar o upgrade.";
            setMercadoPagoError(message);
        },
        onSettled: () => {
            setIsSubmitting(false);
        }
    });

    // --- useEffect para inicializar e destruir o CardForm ---
    useEffect(() => {
        // Não faz nada se o modal estiver fechado ou a chave não existir
        const isPublicKeyMissing = !MERCADO_PAGO_PUBLIC_KEY || MERCADO_PAGO_PUBLIC_KEY === "SUA_PUBLIC_KEY_AQUI";
        if (!isOpen || isPublicKeyMissing) {
            if (isPublicKeyMissing) {
                setMercadoPagoError("Configuração de pagamento indisponível.");
                setIsLoading(false);
            }
            return;
        }

        // Função async para carregar e inicializar o SDK
        const initMercadoPagoForm = async () => {
            setIsLoading(true);
            setMercadoPagoError(null);

            try {
                // 1. Carrega o SDK
                await loadMercadoPago();

                // 2. Configura credenciais
                const mp = new window.MercadoPago(MERCADO_PAGO_PUBLIC_KEY);

                // 3. Inicializa o CardForm
                const cardForm = mp.cardForm({
                    // TODO: MUITO IMPORTANTE!
                    // Substitua este valor pelo valor real do seu plano.
                    // O CardForm PRECISA de um 'amount' para gerar o token.
                    amount: "100.5", // Ex: "59.90"
                    iframe: true,
                    form: {
                        id: "form-checkout",
                        cardNumber: {
                            id: "form-checkout__cardNumber",
                            placeholder: "Número do cartão",
                        },
                        expirationDate: {
                            id: "form-checkout__expirationDate",
                            placeholder: "MM/YY",
                        },
                        securityCode: {
                            id: "form-checkout__securityCode",
                            placeholder: "Código de segurança",
                        },
                        cardholderName: {
                            id: "form-checkout__cardholderName",
                            placeholder: "Titular do cartão",
                        },
                        issuer: {
                            id: "form-checkout__issuer",
                            placeholder: "Banco emissor",
                        },
                        installments: {
                            id: "form-checkout__installments",
                            placeholder: "Parcelas",
                        },
                        identificationType: {
                            id: "form-checkout__identificationType",
                            placeholder: "Tipo de documento",
                        },
                        identificationNumber: {
                            id: "form-checkout__identificationNumber",
                            placeholder: "Número do documento",
                        },
                        cardholderEmail: {
                            id: "form-checkout__cardholderEmail",
                            placeholder: "E-mail",
                        },
                    },
                    callbacks: {
                        onFormMounted: (error: any) => {
                            if (error) {
                                console.warn("Form Mounted handling error: ", error);
                                setMercadoPagoError("Não foi possível carregar o formulário de pagamento.");
                                setIsLoading(false);
                                return;
                            }
                            setIsLoading(false);
                        },
                        // Este 'onSubmit' intercepta o 'submit' do formulário
                        onSubmit: (event: any) => {
                            event.preventDefault();
                            setIsSubmitting(true); // Você pode até remover essa linha se quiser
                            setMercadoPagoError(null);

                            const {
                                token,
                            } = cardFormRef.current.getCardFormData();

                            if (token) {
                                // Antigo: mutation.mutate(token);
                                mutate(token); // Novo
                            } else {
                                setMercadoPagoError("Não foi possível gerar o token do cartão. Verifique os dados.");
                                setIsSubmitting(false); // E essa
                            }
                        },
                        onFetching: (resource: any) => {
                            // Anima a barra de progresso
                            const progressBar = document.querySelector(".progress-bar") as HTMLProgressElement;
                            if (progressBar) {
                                progressBar.removeAttribute("value");
                            }

                            return () => {
                                if (progressBar) {
                                    progressBar.setAttribute("value", "0");
                                }
                            };
                        },
                        onError: (error: any) => {
                            // Callback para erros de validação (ex: CVC inválido)
                            console.warn("CardForm error: ", error);
                            const errorMessages = error.map((err: any) => err.message).join(' | ');
                            setMercadoPagoError(errorMessages || "Verifique os dados do cartão.");
                            setIsSubmitting(false); // Libera o botão
                        }
                    },
                });

                // Salva a instância do formulário na Ref
                cardFormRef.current = cardForm;

            } catch (e) {
                console.error("Falha ao inicializar MercadoPago:", e);
                setMercadoPagoError("Falha ao carregar o serviço de pagamento.");
                setIsLoading(false);
            }
        };

        initMercadoPagoForm();

        // --- Função de Limpeza (Cleanup) ---
        // Isso é CRUCIAL para evitar leaks de memória
        return () => {
            if (cardFormRef.current) {
                cardFormRef.current.unmount();
                cardFormRef.current = null;
            }
        };
        // A 'mutation' é uma dependência para que o callback 'onSubmit'
        // sempre tenha a referência mais recente da função.
    }, [isOpen, enterpriseId, mutate, queryClient]); // <-- MUDE AQUI: de 'mutation' para 'mutate'

    const isPublicKeyMissing = !MERCADO_PAGO_PUBLIC_KEY || MERCADO_PAGO_PUBLIC_KEY === "SUA_PUBLIC_KEY_AQUI";
    const showLoadingState = isLoading && !isPublicKeyMissing;

    // Estilo para os <select> ficarem parecidos com os <Input>
    const selectClassName = "flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50";

    return (
        <Modal
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            title="Upgrade para o Plano Standard"
            headerTitle="Atualize seu Plano"
            className="w-full max-w-md"
        >
            {/* O 'id' é ESSENCIAL para o mp.cardForm */}
            {/* Removemos o onSubmit={handleSubmit} daqui */}
            <form id="form-checkout">
                <div className="p-6 space-y-4">
                    {(process.env.NODE_ENV === 'development' && isPublicKeyMissing) && (
                        <div className="p-3 text-xs text-yellow-800 bg-yellow-50 border border-yellow-200 rounded-md">
                            <strong>Aviso DEV:</strong> Chave pública MP não configurada.
                        </div>
                    )}

                    <p className="text-sm text-gray-600">
                        Preencha os dados do seu cartão para atualizar seu plano.
                    </p>

                    {/* Container do Formulário de Pagamento */}
                    <div className="relative min-h-[100px] space-y-4">
                        {isPublicKeyMissing ? (
                            <div className="p-3 text-sm text-red-700 bg-red-50 border border-red-200 rounded-md">
                                {mercadoPagoError || "Configuração indisponível."}
                            </div>
                        ) : (
                            // Estes são os campos do formulário da documentação
                            // Estilizei para se parecer com seu código antigo
                            <>
                                {/* 1. Número do Cartão (DIV) */}
                                <div id="form-checkout__cardNumber" className="p-3 border rounded-md min-h-[50px]"></div>

                                <div className="flex gap-4">
                                    {/* 2. Data de Expiração (DIV) */}
                                    <div id="form-checkout__expirationDate" className="w-1/2 p-3 border rounded-md min-h-[50px]"></div>
                                    {/* 3. Código de Segurança (DIV) */}
                                    <div id="form-checkout__securityCode" className="w-1/2 p-3 border rounded-md min-h-[50px]"></div>
                                </div>

                                {/* 4. Nome do Titular (INPUT) */}
                                <Input id="form-checkout__cardholderName" />

                                {/* 5. E-mail (INPUT) */}
                                <Input type="email" id="form-checkout__cardholderEmail" />

                                <div className="flex gap-4">
                                    {/* 6. Tipo de Documento (SELECT) */}
                                    {/* Deve ser um <select> HTML puro */}
                                    <select id="form-checkout__identificationType" className={selectClassName}></select>

                                    {/* 7. Número do Documento (INPUT) */}
                                    <div className="w-2/3">
                                        <Input id="form-checkout__identificationNumber" />
                                    </div>
                                </div>

                                {/* 8. Banco Emissor (SELECT) */}
                                <select id="form-checkout__issuer" className={selectClassName}></select>

                                {/* 9. Parcelas (SELECT) */}
                                <select id="form-checkout__installments" className={selectClassName}></select>
                            </>
                        )}

                        {/* Indicador de loading do formulário */}
                        {showLoadingState && (
                            <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/80 backdrop-blur-sm rounded-md">
                                <div className="flex items-center justify-center text-gray-500 text-sm">
                                    <Loader2 className="h-5 w-5 animate-spin mr-2" />
                                    Carregando formulário...
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Barra de Progresso */}
                    <progress value="0" className="progress-bar w-full h-2 rounded-full overflow-hidden [&::-webkit-progress-bar]:bg-gray-200 [&::-webkit-progress-value]:bg-blue-500 [&::-moz-progress-bar]:bg-blue-500">
                        Carregando...
                    </progress>

                    {/* Exibição de Erros (Formulário ou Backend) */}
                    {mercadoPagoError && (
                        <div className="p-3 text-sm text-red-700 bg-red-50 border border-red-200 rounded-md">
                            {mercadoPagoError}
                        </div>
                    )}

                    <p className="flex items-center gap-2 text-xs text-gray-500"> <Lock className="h-3 w-3" /> Pagamento seguro processado pelo Mercado Pago.</p>

                    {/* Botão de Submit (agora é type="submit") */}
                    <Button
                        type="submit"
                        id="form-checkout__submit" // ID da documentação
                        disabled={isLoading || isPending || !!mercadoPagoError || isPublicKeyMissing}
                        className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white"
                    >
                        {isPending ? ( // <--- Simplificado
                            <><Loader2 className="h-4 w-4 animate-spin mr-2" /> Processando...</>
                        ) : (
                            <><CreditCard className="h-4 w-4 mr-2" /> Pagar e fazer upgrade</>
                        )}
                    </Button>

                    <Button variant="ghost" onClick={() => setIsOpen(false)} className="w-full" disabled={isPending}>
                        Cancelar
                    </Button>
                </div>
            </form>
        </Modal>
    );
}