"use client";

import { ApiModule } from "@/service/module/get-all-modules";
import { Eye, Lock, BookOpen, PlayCircle, ArrowRight } from "lucide-react";
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
                
                {/* --- CONTAINER DA IMAGEM --- */}
                <div className="relative aspect-video w-full bg-gray-100 overflow-hidden">
                    {/* A imagem agora só fica com blur se estiver bloqueado */}
                    <div className={isAccessBlocked ? "blur-[4px] scale-105" : ""}>
                        <Image
                            src={imageUrl}
                            alt={title}
                            fill
                            sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
                            className="object-contain p-8 transition-transform duration-500 group-hover:scale-105"
                        />
                    </div>

                    {/* --- OVERLAY DE BLOQUEIO APENAS NA IMAGEM --- */}
                    {isAccessBlocked && (
                        <div
                            onClick={() => setIsUpgradeModalOpen(true)}
                            className="absolute inset-0 z-20 bg-black/40 grid place-items-center cursor-pointer hover:bg-black/50 transition-colors"
                        >
                            <div className="flex flex-col items-center gap-1 text-white">
                                <Lock className="h-6 w-6 text-yellow-400" />
                                <span className="text-[10px] font-bold uppercase tracking-widest">Premium</span>
                            </div>
                        </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none" />
                </div>

                {/* --- CONTEÚDO DO CARD (Sempre Visível) --- */}
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

                    {/* RODAPÉ DO CARD - Muda o comportamento se estiver bloqueado */}
                    <div className="mt-auto pt-4 border-t border-gray-50">
                        {isAccessBlocked ? (
                            <Button 
                                onClick={() => setIsUpgradeModalOpen(true)}
                                variant="ghost" 
                                size="sm" 
                                className="w-full justify-between text-blue-900 font-bold hover:bg-blue-50 h-8"
                            >
                                <span className="flex items-center gap-2">
                                    <Lock className="h-3.5 w-3.5" /> Fazer Upgrade
                                </span>
                                <ArrowRight className="h-4 w-4" />
                            </Button>
                        ) : (
                            <div className="flex items-center justify-between text-xs font-medium text-blue-900/60">
                                <span className="inline-flex items-center gap-1">
                                    <BookOpen className="h-4 w-4" /> Acessar Módulo
                                </span>
                                <PlayCircle className="h-5 w-5 opacity-0 -translate-x-2 transition-all group-hover:opacity-100 group-hover:translate-x-0" />
                            </div>
                        )}
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