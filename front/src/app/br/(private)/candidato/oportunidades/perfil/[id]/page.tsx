"use client";

import { UseUserCandidate } from "@/context/user-candidate.context";
import { FirstCol } from "./(complementary)/first-col";
import { ProfileThings } from "./(complementary)/profil-things";
import { useQuery } from "@tanstack/react-query";
import { getUniqueUser } from "@/service/user/get-unique-user";
import { getAddress } from "@/service/address/get-address"; // Importe o serviço de endereço
import { ApiAddress } from "@/types/address"; // Importe o tipo de endereço

export default function UserProfilePage() {
  const { userCandidate } = UseUserCandidate();

  // 1. Busca de dados do usuário
  const { data: user, isLoading: isLoadingUser } = useQuery({
    queryKey: ["authUser", userCandidate?.id],
    queryFn: () => getUniqueUser(userCandidate!.id),
    enabled: !!userCandidate?.id,
  });

  const addressId = user?.addressId;

  // 2. Busca de dados do endereço (aqui na página principal)
  const { data: address, isLoading: isLoadingAddress } = useQuery<ApiAddress>({
    queryKey: ["userAddress", addressId],
    queryFn: () => getAddress(addressId!),
    enabled: !!addressId, // Só executa se 'addressId' não for nulo
  });

  // 3. Combina o estado de carregamento
  const isLoading = isLoadingUser || (isLoadingAddress && !!addressId);

  return (
    // CORREÇÃO DE LAYOUT: w-full e min-h-screen já estão no main
    <main className="min-h-screen bg-neutral-200 text-neutral-900 w-full">
      {/* REMOVIDO: <div className="flex"> 
        A <main> já é o container. A <section> deve ser flex-1
      */}
      <section className="flex-1 flex flex-col">
        {/* O header agora é parte da seção de rolagem */}
        {/* <header className="px-6 lg:px-10 pt-6 border-b border-neutral-300 bg-neutral-200">
          <h1 className="text-2xl font-semibold">
            Olá {user?.firstName} {user?.lastName}
          </h1>
          <p className="text-neutral-600">Bem-vindo ao seu Perfil Pessoal</p>
        </header> */}

        {/* Container principal do conteúdo com padding
          w-full garante que ele se expanda
        */}
        <div className="px-6 lg:px-10 py-8 space-y-8 w-full">
          <ProfileThings
            user={user}
            address={address} // <-- Passa o endereço
            isLoading={isLoading}
          />
          <div className="flex xl:flex-row flex-col gap-5">
            <FirstCol
              user={user}
              address={address}
              isLoading={isLoading}
            />
            {/* <SecondCol /> */}
          </div>
        </div>
      </section>
    </main>
  );
}