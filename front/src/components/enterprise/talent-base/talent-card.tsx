import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, User } from "lucide-react";
import Link from "next/link";
import { CandidateBaseProfile } from "@/service/user/get-candidate-base";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { discProfileTranslations } from "../candidate-card";

export function TalentCard({ candidate }: { candidate: CandidateBaseProfile }) {
  const fullName = `${candidate.firstName} ${candidate.lastName}`;
  const initials = `${candidate.firstName[0]}${candidate.lastName[0]}`;

  return (
    <div className="flex flex-col sm:flex-row gap-4 p-5 border rounded-xl bg-white hover:shadow-md transition-shadow">
      {/* Avatar */}
      <div className="flex-shrink-0">
        <Avatar className="h-16 w-16 border">
          <AvatarImage src={candidate.profilePictureUrl} alt={fullName} />
          <AvatarFallback className="bg-blue-50 text-blue-700 font-bold">
            {initials}
          </AvatarFallback>
        </Avatar>
      </div>

      {/* Conteúdo */}
      <div className="flex-1 min-w-0 space-y-2">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-semibold text-lg text-gray-900 truncate">
              {fullName}
            </h3>
            <p className="text-sm text-gray-500 truncate">
              {candidate.subTitle || ""}
            </p>
          </div>
        </div>

        {candidate.discTag ? (
           <div className="flex">
             <span className="inline-flex items-center rounded-md bg-purple-100 px-2 py-0.5 text-xs font-medium text-purple-700 border border-purple-200">
               Perfil DISC: {discProfileTranslations[candidate.discTag] || candidate.discTag}
             </span>
           </div>
        ) : (
           // Opcional: Se não tiver DISC, você pode mostrar um placeholder ou nada
           <p className="text-xs text-gray-400 italic">Perfil comportamental não disponível</p>
        )}

        {/* Tags (Limitadas a 3 ou 4) */}
        <div className="flex flex-wrap gap-2 pt-1">
          {candidate.tags?.slice(0, 4).map((tag) => (
            <Badge key={tag.id} variant="secondary" className="font-normal bg-neutral-100 text-neutral-700">
              {tag.name}
            </Badge>
          ))}
          {(candidate.tags?.length || 0) > 4 && (
            <span className="text-xs text-gray-500 self-center">
              +{candidate.tags!.length - 4}
            </span>
          )}
        </div>
      </div>

      {/* Ações */}
      <div className="flex sm:flex-col justify-end sm:justify-center gap-2 border-t sm:border-t-0 sm:border-l pt-4 sm:pt-0 sm:pl-4">
        <Button asChild size="sm" variant="outline" className="w-full sm:w-auto">
          <Link href={`/br/enterprise/candidate/${candidate.id}`}>
            <User className="h-4 w-4 mr-2" />
            Ver Perfil
          </Link>
        </Button>
      </div>
    </div>
  );
}