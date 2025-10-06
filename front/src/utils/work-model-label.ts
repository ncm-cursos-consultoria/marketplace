export function workModelLabel(w?: string) {
  switch (w) {
    case "ON_SITE": return "Presencial";
    case "HYBRID":  return "Híbrido";
    case "REMOTE":  return "Remoto";
    default:        return "—";
  }
}