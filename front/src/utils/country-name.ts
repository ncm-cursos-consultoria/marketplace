export const countryName = (code?: string) => {
  if (!code) return "—";
  try {
    return new Intl.DisplayNames(["pt-BR"], { type: "region" }).of(code) ?? code;
  } catch {
    return code;
  }
};