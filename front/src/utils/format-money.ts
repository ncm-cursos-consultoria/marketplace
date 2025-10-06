export function formatMoney(amount?: number, currency?: { code?: string; symbol?: string }) {
  if (typeof amount !== "number") return "—";
  const code = currency?.code || "BRL";
  try {
    return new Intl.NumberFormat("pt-BR", { style: "currency", currency: code }).format(amount);
  } catch {
    return `${currency?.symbol ?? ""} ${amount.toFixed(2)}`;
  }
}