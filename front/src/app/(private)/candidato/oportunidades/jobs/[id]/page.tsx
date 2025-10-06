"use client";

import { JobCardList } from "@/components/card/job-card";
import { getAllCourses } from "@/service/course/get-all";
import { getAllJobs } from "@/service/job/get-all-jobs";

import { jobs } from "@/utils/jobs-simulate";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

export default function JobsPage() {

  const {data: jobs, isLoading} = useQuery({
    queryKey: ['job'],
    queryFn: () => getAllJobs()
  })

  console.log(jobs);
  

  return (
    <div className="flex min-h-screen">

      <main className="flex-1 bg-gray-100 p-8 space-y-10">
        <h1 className="text-3xl font-bold mb-4">
          Vagas de Tecnologia em Santana de Parnaíba
        </h1>
        <p className="text-gray-700 text-lg mb-10">
          Confira as oportunidades de tecnologia disponíveis na cidade e
          candidate-se.
        </p>

        <div className="">
          <JobCardList jobs={jobs} onApply={(job) => toast.message("Aplicação enviada", { description: job.title })}/>
        </div>

        {/* Footer */}
        <footer className="text-center text-gray-500 text-sm pt-6 border-t mt-10">
          &copy; {new Date().getFullYear()} Marketplace das Oportunidades. Todos
          os direitos reservados.
        </footer>
      </main>
    </div>
  );
}
