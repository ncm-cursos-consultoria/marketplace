export interface CandidateProps {
  id: number;
  title: string;
  company: string;
  location: string;
  type: string;
  salary: string;
}

export interface UserCandidateProps {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  cpf: string;
  profilePicture?: string;
  birthDate?: string;
}

export interface UserEnterpriseProps {
  id: string;
  legalName: string;
  tradeName: string;
  cnpj: string;
  profilesPictureUrl: string;
  addressId: string;
  type: string
}
