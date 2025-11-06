/**
 * Retorna as classes de cor do Tailwind com base no score de afinidade.
 * @param affinity - O score (0 a 100)
 * @returns Uma string de classes CSS do Tailwind.
 */
export const affinityClass = (affinity: number): string => {
  if (affinity <= 0) {
    return ""; // Score 0 ou inválido não mostra nada
  }

  if (affinity = 100) {
    // Verde (Alta Afinidade)
    return "bg-blue-100 text-blue-800 border-blue-200";
  }
  
  if (affinity >= 75) {
    // Verde (Alta Afinidade)
    return "bg-green-100 text-green-800 border-green-200";
  }
  
  if (affinity >= 50) {
    // Azul (Boa Afinidade)
    return "bg-yellow-100 text-yellow-800 border-yellow-200";
  }
  
  if (affinity >= 25) {
    // Amarelo (Média Afinidade)
    return "bg-red-100 text-red-800 border-red-200";
  }
  
  // Vermelho (Baixa Afinidade)
  return ""
};