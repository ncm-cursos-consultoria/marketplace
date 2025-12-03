import { ApiModule } from "@/service/module/get-all-modules";
import { Eye, Lock } from "lucide-react";
import Image from "next/image";
import { Button } from "../ui/button";
import { UpgradeCandidateModal } from "../candidate/upgrade-candidate-modal";
import { useState } from "react";

// 3. A interface do componente recebe as flags
interface ModuleCardProps {
    module: ApiModule;
    isUserPermitted: boolean;
    userId: string;
}

export function ModuleCard({
    module,
    isUserPermitted,
    userId,
}: ModuleCardProps) {

    const { title, description, freePlan } = module;
    const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);
    const isAccessBlocked = !isUserPermitted && !freePlan;

    return (
        <>
            <div className="bg-white rounded-xl shadow-md overflow-hidden relative">

                {/* --- 5. OVERLAY DE BLOQUEIO (Paywall) --- */}
                {isAccessBlocked && (
                    <div
                        // <--- 5.1 TORNAR CLICÁVEL: Ao clicar no overlay, abre o modal
                        onClick={() => setIsUpgradeModalOpen(true)}
                        className="absolute inset-0 z-10 bg-black/60 grid place-items-center cursor-pointer hover:bg-black/70 transition-colors"
                    >
                        <div className="text-center p-4 rounded-lg bg-white shadow-xl">
                            <Lock className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
                            <p className="font-semibold text-gray-900">
                                Conteúdo Exclusivo
                            </p>
                            <p className="text-sm text-gray-600 mt-2 mb-4">
                                Este módulo não está incluído no seu plano atual.
                                <br />
                                <strong>Faça o upgrade para desbloquear o acesso total.</strong>
                            </p>
                            <Button
                                size="sm"
                                className="bg-blue-600 hover:bg-blue-700 text-white w-full"
                            >
                                Fazer Upgrade Agora
                            </Button>
                        </div>
                    </div>
                )}

                {/* 6. CONTEÚDO (Borro e Desabilitado se houver bloqueio) */}
                <div className={isAccessBlocked ? "blur-sm pointer-events-none" : ""}>

                    {/* 7. SUBSTITUÍMOS IMAGE/VIDEO PELO SEU CÓDIGO LITERAL PARA MANTER COMPATIBILIDADE */}
                    {/* Usamos o seu logo original como placeholder de imagem */}
                    <Image src={require("@/assets/ncm-logo.png")} alt={title} className=" object-cover p-10 bg-neutral-200" />

                    <div className="p-4">
                        <div className="mb-2 flex items-center justify-between">
                            <h3 className="text-lg font-semibold">{title}</h3>
                            <div className="flex items-center gap-1 text-sm text-muted-foreground" title="Visualizações">
                                <Eye className="h-4 w-4" />
                                <span>{module.view ?? 0}</span>
                            </div>
                        </div>
                        <p className="text-sm text-gray-600">{description}</p>
                    </div>
                </div>
            </div>

            <UpgradeCandidateModal
                isOpen={isUpgradeModalOpen}
                setIsOpen={setIsUpgradeModalOpen}
                userId={userId}
            />
        </>
    );
}