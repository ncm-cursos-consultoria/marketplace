import { toast } from "sonner";
import { Button } from "../ui/button";
import { useSimulateCandidate } from "@/context/simulate-candidate-context";

interface Job {
  id: number;
  title: string;
  company: string;
  location: string;
  type: string;
  salary: string;
}

interface JobCardProps {
  jobs: Job[];
}

export function JobCard({ jobs }: JobCardProps) {
  const { candidate,setCandidate } = useSimulateCandidate();

  const onClickCandidate = (job: Job) => {
    setCandidate((prev) => [...(prev || []), job]);
    toast.success(`Sucesso ao canditar a vaga`);
  };

  console.log(candidate);
  

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {jobs.map((job) => (
        <div
          key={job.id}
          className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition border border-neutral-300"
        >
          <h2 className="text-xl font-semibold text-blue-800 mb-2">
            {job.title}
          </h2>
          <p className="text-gray-600">
            {job.company} — {job.location}
          </p>
          <p className="text-gray-500 text-sm mt-1">Tipo: {job.type}</p>
          <p className="text-gray-500 text-sm">Salário: {job.salary}</p>
          <Button
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-900 transition cursor-pointer"
            onClick={() => onClickCandidate(job)}
          >
            Candidatar-se
          </Button>
        </div>
      ))}
    </div>
  );
}
