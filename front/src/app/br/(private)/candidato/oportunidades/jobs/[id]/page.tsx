"use client";

import { useState } from "react"; // 1. Importar useState
import { useQuery } from "@tanstack/react-query";
import { useDebounce } from "use-debounce"; // 2. Importar o hook de debounce
import { toast } from "sonner";
import { Search, Loader2 } from "lucide-react"; // 3. Importar ícones

import { JobCardList } from "@/components/card/job-card";
import { Input } from "@/components/ui/input"; // 4. Importar o Input do shadcn

// 5. Importar o serviço ATUALIZADO e os tipos
import { 
  getAllJobs, 
  JobFilters,
  ApiJob 
} from "@/service/job/get-all-jobs";

export default function JobsPage() {
  // 6. Estado para o que o usuário digita no input
  const [searchQuery, setSearchQuery] = useState("");

  // 7. Estado "atrasado" (debounced)
  // O 'useQuery' vai usar este valor.
  // Ele só atualiza 500ms *depois* que o usuário para de digitar.
  const [debouncedSearchQuery] = useDebounce(searchQuery, 500);

  // 8. O useQuery agora depende do 'debouncedSearchQuery'
  const { data: jobs, isLoading } = useQuery({
    // 9. A queryKey PRECISA incluir o valor da busca
    // Isso garante que o React Query buscará novamente quando o valor mudar
    queryKey: ['jobs', debouncedSearchQuery], 
    
    queryFn: () => {
      // 10. Monta o objeto de parâmetros para a API
      const params: JobFilters = {
        searchQuery: debouncedSearchQuery || undefined, // Envia undefined se for vazio
        affinity: true,
      };
      return getAllJobs(params);
    }
  });

  return (
    <div className="flex min-h-screen">
      <main className="flex-1 bg-gray-100 p-8 space-y-10">
        <h1 className="text-3xl font-bold mb-4">
          Vagas
        </h1>
        <p className="text-gray-700 text-lg mb-6">
          Confira as oportunidades de tecnologia disponíveis e candidate-se.
        </p>

        {/* --- 11. CAMPO DE PESQUISA --- */}
        <div className="relative w-full max-w-lg">
          <Input
            placeholder="Pesquisar por cargo, tecnologia ou palavra-chave..."
            className="pl-10 h-11 text-base" // Aumentei o texto
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-400" />
        </div>
        {/* --- FIM DA PESQUISA --- */}


        <div className="">
          {/* 12. Feedback de Carregamento e "Nenhum resultado" */}
          {isLoading && (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
              <p className="ml-3 text-neutral-600">Buscando vagas...</p>
            </div>
          )}

          {!isLoading && !jobs?.length && (
            <div className="text-center text-neutral-600 py-20">
              <h3 className="text-lg font-semibold">Nenhuma vaga encontrada</h3>
              <p>Tente ajustar seus termos de busca.</p>
            </div>
          )}

          {/* 13. Lista de Resultados */}
          {!isLoading && jobs && jobs.length > 0 && (
            <JobCardList 
              jobs={jobs} 
              onApply={(job) => toast.message("Aplicação enviada", { description: job.title })}
            />
          )}
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