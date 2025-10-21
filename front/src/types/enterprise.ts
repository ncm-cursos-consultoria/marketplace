// Em src/types/enterprise.ts (novo arquivo)

// Exporte o tipo para que ele possa ser importado
export type EnterpriseData = {
  id: string;
  legalName: string;
  tradeName: string;
  cnpj: string;
  plan: string;
  profilePictureUrl?: string;
  missionStatement?: string;
  coreValues?: string;
  benefits?: string;
  email?: string;
  phone?: string;
  website?: string;
  addressId?: any;
};