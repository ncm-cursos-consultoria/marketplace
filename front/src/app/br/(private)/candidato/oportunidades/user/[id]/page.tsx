"use client";

import { useSimulateCandidate } from "@/context/candidate.context";

export default function UserPage() {
  const { candidate } = useSimulateCandidate();

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold mb-6">Minhas Candidaturas</h1>

      {candidate && candidate.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {candidate.map((job) => (
            <div
              key={job.id}
              className="bg-white p-6 rounded-lg shadow border border-neutral-300"
            >
              <h2 className="text-xl font-semibold text-blue-800 mb-2">
                {job.title}
              </h2>
              <p className="text-gray-600">
                {job.company} — {job.location}
              </p>
              <p className="text-gray-500 text-sm mt-1">Tipo: {job.type}</p>
              <p className="text-gray-500 text-sm">Salário: {job.salary}</p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-700">Você ainda não se candidatou a nenhuma vaga.</p>
      )}
    </div>
  );
}
