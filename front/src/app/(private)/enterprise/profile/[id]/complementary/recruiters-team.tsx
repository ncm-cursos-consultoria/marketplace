import { Card } from "@/components/enterprise/profile/card";
import { CardHeader } from "@/components/enterprise/profile/card-header";

type recruiter = {
  name: string;
  id: string;
  email: string;
  role: string;
};

type Recruiters = {
  recruiters: recruiter[]
};

interface recruitersTeamProps {
  company: Recruiters;
}

export function RecruitersTeam({ company }: recruitersTeamProps) {
  return (
    <Card>
      <CardHeader title="Equipe de recrutamento" />
      <ul className="space-y-3">
        {/* {company.recruiters.map((r) => (
          <li key={r.id} className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-semibold">
                {r.name
                  .split(" ")
                  .map((n) => n[0])
                  .slice(0, 2)
                  .join("")}
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">{r.name}</p>
                <p className="text-xs text-gray-600">{r.role}</p>
              </div>
            </div>
            <a
              className="text-xs text-indigo-700 hover:underline"
              href={`mailto:${r.email}`}
            >
              Enviar e-mail
            </a>
          </li>
        ))} */}
      </ul>
    </Card>
  );
}
