import { BadgeCheck, CalendarDays, Edit3, MapPin, Shield, User } from "lucide-react";
import Image from "next/image";
import { ProfileImg } from "./profile-img";
import { ModalUpdateUser } from "./modal-update-user";

interface profileThingsProps {
  firstName: string,
  lastName: string,
}

export function ProfileThings({firstName,lastName}: profileThingsProps) {

  return (
    <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
      <div className="h-36 sm:h-48 bg-gradient-to-r from-blue-600 to-blue-400"></div>
      <div className="px-6 pb-6 -mt-10 flex items-end justify-between">
        <div className="flex items-end gap-4">
          <ProfileImg />  
          <div className="pb-4">
            <div className="flex items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-semibold">
                {firstName} {lastName}
              </h2>
            </div>
            <p className="text-neutral-600 text-sm">
              Desenvolvedor Full‑Stack • NestJS • React (Next.js) • TypeScript
            </p>
            <div className="mt-2 flex flex-wrap items-center gap-3 text-neutral-600 text-sm">
              <span className="inline-flex items-center gap-1">
                <MapPin className="h-4 w-4" /> São Paulo, BR
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1 border border-neutral-300 p-2 rounded-md shadow-md cursor-pointer hover:bg-neutral-200">
          <Edit3 size={20}/>
          <ModalUpdateUser />
        </div>
      </div>
    </div>
  );
}
