// utils/html-to-text.ts
export function htmlToText(html?: string) {
  if (!html) return "";
  // Como seu componente é "use client", dá pra usar o DOM no browser
  if (typeof window !== "undefined") {
    const div = document.createElement("div");
    div.innerHTML = html;
    const text = div.textContent || div.innerText || "";
    return text.replace(/\s+/g, " ").trim();
  }
  // Fallback simples para SSR (se algum dia usar):
  return html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}
