"use client";

import { useState } from "react";
import { Modal } from "@/components/modal";
import { Button } from "@/components/ui/button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/service/api";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

interface Props {
    jobId: string;
    candidateId?: string; // Permitimos undefined aqui
    jobUrl?: string;      // Permitimos undefined aqui
}

export function ModalThirdPartyConfirm({ jobId, candidateId, jobUrl }: Props) {
    const [isOpen, setIsOpen] = useState(false);
    const qc = useQueryClient();

    const { mutate: confirmApplication, isPending } = useMutation({
        mutationFn: async () => {
            // Usamos uma verificação simples para garantir que temos o ID do candidato
            if (!candidateId) throw new Error("Candidato não identificado");
            return await api.post(`/job-opening/${jobId}/submit/${candidateId}`);
        },
        onSuccess: () => {
            toast.success("Candidatura registrada no NCM!");
            qc.invalidateQueries({ queryKey: ["job", jobId] });
            setIsOpen(false);
        }
    });

    const handleExternalClick = () => {
        // Só abre se a URL existir, evitando o erro de 'string | undefined'
        if (jobUrl) {
            window.open(jobUrl, "_blank", "noopener,noreferrer");
            setIsOpen(true);
        } else {
            toast.error("URL da vaga não disponível.");
        }
    };

    return (
        <>
            <Button
                onClick={handleExternalClick}
                className="bg-blue-600 hover:bg-blue-700 font-medium rounded-md p-2 text-white"
            >
                Candidatar-se
            </Button>

            <Modal
                isOpen={isOpen}
                setIsOpen={setIsOpen}
                title="Confirmação"
                headerTitle=""
                // RESOLUÇÃO DO ERRO: Passando a className obrigatória (mesmo que vazia)
                className=""
            >
                <div className="flex flex-col gap-4 py-4 text-center">
                    <p className="text-sm text-gray-600">
                        Você finalizou o cadastro no site da empresa?
                    </p>

                    <div className="flex flex-col gap-2">
                        <Button
                            onClick={() => confirmApplication()}
                            disabled={isPending || !candidateId} // Desabilita se não houver candidato
                            className="bg-green-600 hover:bg-green-700"
                        >
                            {isPending ? <Loader2 className="animate-spin" /> : "Sim, finalizei"}
                        </Button>
                    </div>
                </div>
            </Modal>
        </>
    );
}