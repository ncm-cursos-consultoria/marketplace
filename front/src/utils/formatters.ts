// lib/formatters.ts
import { ApiAddress } from "@/types/address"; // Importe seu tipo de endereço

// Sua função que já existia
export function formatCNPJ(cnpj?: string) {
  if (!cnpj) return "—";
  const digits = cnpj.replace(/\D/g, "");
  return digits.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2}).*$/, "$1.$2.$3/$4-$5");
}

// Nova função para formatar o endereço
export function formatAddress(address?: ApiAddress) {
  if (!address) return "Endereço não informado";
  
  // Constrói o endereço. Ex: "Rua das Flores, 123 - Centro, São Paulo - SP"
  let parts = [];
  if (address.street) parts.push(address.street);
  if (address.number) parts.push(address.number);
  if (address.district) parts.push(`- ${address.district}`);
  if (address.city) parts.push(`, ${address.city}`);
  if (address.state) parts.push(`- ${address.state}`);
  
  return parts.join(" ");
}