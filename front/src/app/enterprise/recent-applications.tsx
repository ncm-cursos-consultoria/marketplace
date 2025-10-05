import { MatchPill } from "@/components/enterprise/match-pill";
import { StatusBadge } from "@/components/enterprise/status.badge";
import { applicants } from "@/utils/jobs-simulate";
import Link from "next/link";

export function RecentApplication() {
  return (
    <section className="mb-10">
      <h2 className="text-xl font-semibold mb-3">Candidaturas recentes</h2>
      <div className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
        <ul className="divide-y divide-gray-100">
          {applicants.map((a) => (
            <li key={a.id} className="p-4 md:p-5">
              <div className="flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <p className="font-medium text-gray-900 truncate">{a.name}</p>
                  <p className="text-sm text-gray-600 truncate">
                    {a.position} • {a.city} - {a.uf}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <MatchPill value={a.match} />
                  <StatusBadge value={a.status} />
                  <Link
                    href={`#/candidato/${a.id}`}
                    className="text-indigo-700 text-sm font-medium hover:underline"
                  >
                    Ver perfil
                  </Link>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
