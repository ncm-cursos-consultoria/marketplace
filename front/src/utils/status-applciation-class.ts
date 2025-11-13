import { CheckCircle2, XCircle, Send, Eye, UserCheck2, Loader2 } from "lucide-react";

export type ApplicationStatus = "UNDER_REVIEW" | "SELECTED" | "NOT_SELECTED" | "APPROVED" | "REJECTED";

// 1. Defina um tipo para o nosso mapa de estilos
export type StatusStyle = {
  text: string;
  icon: React.ElementType; // <-- Aceita um componente de ícone
  className: string; // <-- Classes para o Badge
  selectClassName: string; // <-- Classes para o item do Select
};

// 2. Crie o mapa completo
export const statusApplicationMap: Record<ApplicationStatus, StatusStyle> = {
  UNDER_REVIEW: { 
    text: "Em Análise", 
    icon: Eye,
    className: "bg-yellow-100 text-yellow-800 border-yellow-200",
    selectClassName: "text-yellow-800 focus:bg-yellow-100" // Cor no <Select>
  },
  SELECTED: { 
    text: "Selecionado", 
    icon: UserCheck2,
    className: "bg-blue-100 text-blue-800 border-blue-200",
    selectClassName: "text-blue-800 focus:bg-blue-100"
  },
  APPROVED: { 
    text: "Aprovado", 
    icon: CheckCircle2,
    className: "bg-green-100 text-green-800 border-green-200",
    selectClassName: "text-green-800 focus:bg-green-100"
  },
  REJECTED: { 
    text: "Rejeitado", 
    icon: XCircle,
    className: "bg-red-100 text-red-800 border-red-200",
    selectClassName: "text-red-800 focus:bg-red-100"
  },
  NOT_SELECTED: { 
    text: "Não Selecionado", 
    icon: XCircle, // Ícone similar a Rejeitado
    className: "bg-gray-100 text-gray-800 border-gray-200",
    selectClassName: "text-gray-800 focus:bg-gray-100"
  },
};

// 3. Função helper (sem alteração, mas agora retorna StatusStyle)
export const getApplicationStatusStyle = (status: ApplicationStatus | string) => {
  return statusApplicationMap[status as ApplicationStatus] || { 
    text: "Em Análise", // Fallback padrão
    icon: Loader2, 
    className: "bg-gray-100 text-gray-800",
    selectClassName: "text-gray-800"
  };
};

// 4. Lista de Opções (sem alteração)
export const statusOptions = Object.entries(statusApplicationMap).map(([value, { text }]) => ({
  value: value as ApplicationStatus,
  label: text,
}));