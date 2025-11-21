import { ApiModule } from "@/service/module/get-all-modules";
import { Eye, Lock } from "lucide-react";
import Image from "next/image";

// 3. A interface do componente recebe as flags
interface ModuleCardProps {
    module: ApiModule;
    isUserPermitted: boolean;
}

export function ModuleCard({
    module,
    isUserPermitted,
}: ModuleCardProps) {

    const { title, description, freePlan } = module;

    // 4. Lógica de Bloqueio
    const isAccessBlocked = !isUserPermitted && !freePlan;

    return (
        <div className="bg-white rounded-xl shadow-md overflow-hidden relative">

            {/* --- 5. OVERLAY DE BLOQUEIO (Paywall) --- */}
            {isAccessBlocked && (
                <div className="absolute inset-0 z-10 bg-black/60 grid place-items-center cursor-not-allowed">
                    <div className="text-center p-4 rounded-lg bg-white shadow-xl">
                        <Lock className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
                        <p className="font-semibold text-gray-900">
                            Conteúdo Exclusivo
                        </p>
                        <p className="text-sm text-gray-600 mt-1">
                            Seu plano atual não inclui este módulo.
                        </p>
                        {/* Você pode adicionar um link para o upgrade aqui */}
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
    );
}