export const formatDate = (iso?: string) => {
  if (!iso) return "—";
  const d = new Date(iso);
  return new Intl.DateTimeFormat("pt-BR", { dateStyle: "long" }).format(d);
};