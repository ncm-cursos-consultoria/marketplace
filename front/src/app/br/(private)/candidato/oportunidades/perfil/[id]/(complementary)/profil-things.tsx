"use client";

import { MapPin, Edit3 } from "lucide-react";
import { ProfileImg } from "./profile-img";
import { ModalUpdateUser } from "./modal-update-user";
import { UserCandidateResponse } from "@/service/user/update-candidate-tags"; // Ajuste o path se necessário
import { ApiAddress } from "@/types/address";

interface profileThingsProps {
  user?: UserCandidateResponse;
  address?: ApiAddress;
  isLoading: boolean;
}

// Skeleton (carregamento) para o banner
function ProfileThingsSkeleton() {
  return (
    <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
      <div className="h-36 sm:h-48 bg-gray-200 animate-pulse"></div>
      <div className="px-6 pb-6 -mt-10 flex items-end justify-between">
        <div className="flex items-end gap-4">
          <div className="h-24 w-24 rounded-full bg-gray-300 border-4 border-white animate-pulse"></div>
          <div className="pb-4">
            <div className="h-7 w-48 bg-gray-300 rounded animate-pulse"></div>
            <div className="h-4 w-64 bg-gray-200 rounded mt-2 animate-pulse"></div>
            <div className="h-4 w-32 bg-gray-200 rounded mt-3 animate-pulse"></div>
          </div>
        </div>
      </div>
    </div>
  );
}


export function ProfileThings({ user, address, isLoading }: profileThingsProps) {

  if (isLoading || !user) {
    return <ProfileThingsSkeleton />;
  }

  // Formata o endereço (pode mover para utils)
  const location = address 
    ? `${address.city}, ${address.state}` 
    : "Localização não informada";

  return (
    <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
      <div className="h-36 sm:h-48 bg-gradient-to-r from-blue-900 to-white"></div>
      <div className="px-6 pb-6 -mt-10 flex flex-wrap items-end justify-between gap-4">
        <div className="flex items-end gap-4">
          <ProfileImg />
          <div className="pb-4">
            <div className="flex items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-semibold text-white">
                {user.firstName} {user.lastName}
              </h2>
            </div>
            <p className="text-neutral-600 text-sm">
              {user.subTitle || "Sem subtítulo"}
            </p>
            <div className="mt-2 flex flex-wrap items-center gap-3 text-neutral-600 text-sm">
              <span className="inline-flex items-center gap-1">
                <MapPin className="h-4 w-4" /> {location}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1 border border-neutral-300 p-2 rounded-md shadow-md cursor-pointer hover:bg-neutral-200">
          <Edit3 size={20} />
          <ModalUpdateUser />
        </div>
      </div>
    </div>
  );
}