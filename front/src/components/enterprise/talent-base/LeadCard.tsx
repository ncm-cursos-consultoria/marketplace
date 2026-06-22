// components/enterprise/talent-base/lead-card.tsx
import { Badge } from "@/components/ui/badge";
import { Mail, User } from "lucide-react";
import { CandidateLeadProfile } from "@/service/user/get-candidate-leads";

export function LeadCard({ lead }: { lead: CandidateLeadProfile }) {
  return (
    <div className="flex flex-col sm:flex-row gap-4 p-5 border rounded-xl bg-white hover:shadow-md transition-shadow">
      <div className="flex-shrink-0 h-16 w-16 rounded-full bg-green-50 border border-green-200 flex items-center justify-center">
        <User className="h-7 w-7 text-green-600" />
      </div>
      <div className="flex-1 space-y-2">
        <h3 className="font-semibold text-lg text-gray-900">
          {lead.firstName} {lead.lastName}
        </h3>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Mail className="h-4 w-4" />
          {lead.email}
        </div>
        {lead.area && (
          <Badge variant="secondary" className="bg-green-100 text-green-700">
            {lead.area}
          </Badge>
        )}
      </div>
      <div className="flex items-center">
        <Badge className="bg-green-600 text-white text-xs">NCM Currículos</Badge>
      </div>
    </div>
  );
}