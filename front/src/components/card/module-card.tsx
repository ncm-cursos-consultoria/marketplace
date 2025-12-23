"use client";

import { ApiModule } from "@/service/module/get-all-modules";
import { Eye, Lock, BookOpen, PlayCircle } from "lucide-react";
import Image from "next/image";
import { Button } from "../ui/button";
import { UpgradeCandidateModal } from "../candidate/upgrade-candidate-modal";
import { useState } from "react";
// Certifique-se de importar o logo horizontal que a Empresa usa
import ncmHorizontal from "@/assets/logo-ncm-horizontal.svg"; 

interface ModuleCardProps {
    module: ApiModule;
    isUserPermitted: boolean;
    userId: string;
}

export function ModuleCard({ module, isUserPermitted, userId }: ModuleCardProps) {
    const { title, description, freePlan, view } = module;
    const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);
    const isAccessBlocked = !isUserPermitted && !freePlan;
    
    // Define a imagem: Prioriza a capa, senão usa o logo horizontal
    const imageUrl = ncmHorizontal;

    return (
        <>
            <div className="group relative flex w-full flex-col overflow-hidden rounded-2xl border bg-white text-left shadow-sm transition hover:shadow-md">
                
                {/* --- OVERLAY DE BLOQUEIO (Paywall) --- */}
                {isAccessBlocked && (
                    <div
                        onClick={() => setIsUpgradeModalOpen(true)}
                        className="absolute inset-0 z-20 bg-black/60 grid place-items-center cursor-pointer hover:bg-black/70 transition-colors rounded-2xl"
                    >
                        <div className="text-center p-6 bg-white rounded-xl shadow-2xl max-w-[85%] animate-in fade-in zoom-in duration-300">
                            <Lock className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
                            <p className="font-bold text-gray-900">Conteúdo Exclusivo</p>
                            <p className="text-xs text-gray-600 mt-2 mb-4 leading-relaxed">
                                Este módulo exige um plano superior. <br />
                                <strong>Faça o upgrade para acessar.</strong>
                            </p>
                            <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white w-full">
                                Desbloquear Agora
                            </Button>
                        </div>
                    </div>
                )}

                {/* --- CONTEÚDO DO CARD --- */}
                <div className={`flex flex-col h-full ${isAccessBlocked ? "blur-[2px] pointer-events-none" : ""}`}>
                    
                    {/* CONTAINER DA IMAGEM (16:9 igual ao Enterprise) */}
                    <div className="relative aspect-video w-full bg-gray-100 overflow-hidden">
                        <Image
                            src={imageUrl}
                            alt={title}
                            fill
                            sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
                            className={`${'object-contain p-8'} transition-transform duration-500 group-hover:scale-105`}
                        />
                        {<div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />}
                    </div>

                    {/* INFOS DO CARD */}
                    <div className="flex flex-1 flex-col gap-2 p-4">
                        <div className="flex items-start justify-between gap-2">
                            <h3 className="line-clamp-1 text-base font-semibold text-gray-900 group-hover:text-blue-900 transition-colors">
                                {title}
                            </h3>
                            <div className="flex items-center gap-1 text-sm text-muted-foreground shrink-0">
                                <Eye className="h-4 w-4" />
                                <span>{view ?? 0}</span>
                            </div>
                        </div>

                        <p className="line-clamp-2 text-sm text-muted-foreground leading-relaxed">
                            {description || "Sem descrição disponível."}
                        </p>

                        {/* RODAPÉ DO CARD (Estilo Enterprise) */}
                        <div className="mt-auto flex items-center justify-between pt-4 text-xs font-medium text-blue-900/60 border-t border-gray-50">
                            <span className="inline-flex items-center gap-1">
                                <BookOpen className="h-4 w-4" /> Acessar Módulo
                            </span>
                            <PlayCircle className="h-5 w-5 opacity-0 -translate-x-2 transition-all group-hover:opacity-100 group-hover:translate-x-0" />
                        </div>
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