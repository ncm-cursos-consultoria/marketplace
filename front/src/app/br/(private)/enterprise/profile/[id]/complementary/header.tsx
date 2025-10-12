import { UseUserEnteprise } from "@/context/user-enterprise.context";
import { Building, Building2, MapPin } from "lucide-react";

interface enterpriseProfileHeaderProps {
  legalName: string,
  cnpj: string,
}

export function EnterpriseProfileHeader({cnpj,legalName}: enterpriseProfileHeaderProps) {

  return (
    <div className="flex items-start justify-between gap-4 border bg-white rounded-md p-2 shadow-md">
      <div className="flex items-start gap-4">
        <div className="p-5 rounded-xl bg-white shadow-md border border-neutral-200 ring-1 ring-black/5 overflow-hidden flex items-center justify-center">
          <Building/>
        </div>
        <div>
          <h1 className="text-2xl font-bold leading-tight text-gray-900">
            Perfil da Empresa
          </h1>
          <p>{legalName}</p>
          <p className="text-sm text-gray-600">
            Gerencie as informações públicas da sua empresa.
          </p>

          <div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-gray-600">
            {/* <span className="inline-flex items-center gap-1">
              <Building2 className="h-4 w-4" /> 51 - 100
            </span> */}
            {/* <span className="inline-flex items-center gap-1">
              <MapPin className="h-4 w-4" /> São Paulo — sp
            </span> */}
            <span className="text-xs text-gray-500">CNPJ {cnpj}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
