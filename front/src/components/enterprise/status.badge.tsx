export function StatusBadge({ value }: { value: string }) {
  const palette: Record<string, string> = {
    Ativa: "bg-green-100 text-green-800",
    "Em revisão": "bg-amber-100 text-amber-800",
    Pausada: "bg-gray-200 text-gray-800",
    Novo: "bg-blue-100 text-blue-800",
    "Em triagem": "bg-purple-100 text-purple-800",
    Entrevista: "bg-indigo-100 text-indigo-800",
  };
  const cls = palette[value] ?? "bg-gray-100 text-gray-800";
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${cls}`}
    >
      {value}
    </span>
  );
}
