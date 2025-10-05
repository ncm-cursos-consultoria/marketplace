import { Building2, MapPin } from "lucide-react";

export function EnterpriseProfileHeader() {
  return (
    <div className="flex items-start justify-between gap-4">
      <div className="flex items-start gap-4">
        <div className="h-16 w-16 rounded-xl bg-white shadow ring-1 ring-black/5 overflow-hidden flex items-center justify-center">
          <img src="" alt="" />
        </div>
        <div>
          <h1 className="text-2xl font-bold leading-tight text-gray-900">
            Perfil da Empresa
          </h1>
          <p className="text-sm text-gray-600">
            Gerencie as informações públicas da sua empresa.
          </p>

          <div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-gray-600">
            <span className="inline-flex items-center gap-1">
              <Building2 className="h-4 w-4" /> 51 - 100
            </span>
            <span className="inline-flex items-center gap-1">
              <MapPin className="h-4 w-4" /> São Paulo — sp
            </span>
            <span className="text-xs text-gray-500">CNPJ 019230/0001</span>
          </div>
        </div>
      </div>
    </div>
  );
}
