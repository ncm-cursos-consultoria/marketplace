export function statusClass(s?: string) {
  switch (s) {
    case "ACTIVE": return "bg-emerald-100 text-emerald-700 border-emerald-200";
    case "PAUSED": return "bg-amber-100 text-amber-800 border-amber-200";
    case "CLOSED": return "bg-rose-100 text-rose-800 border-rose-200";
    default:       return "bg-gray-100 text-gray-700 border-gray-200";
  }
}