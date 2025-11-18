import { Lock } from "lucide-react";
import { Button } from "@/components/ui/button";

export function AccessDenied() {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-4 text-center bg-white rounded-xl border border-neutral-200 shadow-sm">
      <div className="p-4 bg-neutral-100 rounded-full mb-4">
        <Lock className="h-8 w-8 text-neutral-500" />
      </div>
      <h2 className="text-xl font-semibold text-gray-900 mb-2">
        Acesso ao Banco de Talentos Bloqueado
      </h2>
      <p className="text-gray-600 max-w-md mb-6">
        O seu plano atual não permite a busca ativa de candidatos em nossa base. 
        Faça um upgrade para desbloquear o acesso a milhares de currículos.
      </p>
      <Button className="bg-blue-600 hover:bg-blue-700">
        Fazer Upgrade do Plano
      </Button>
    </div>
  );
}