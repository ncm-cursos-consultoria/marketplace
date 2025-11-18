"use client";

import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useDebounce } from "use-debounce";
import { Search, Loader2, Filter, X } from "lucide-react";

// Imports UI
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"; // Usaremos um Sheet (gaveta) para filtros mobile/desktop

// Imports Locais
import { UseUserEnteprise } from "@/context/user-enterprise.context";
import { getCandidateBase } from "@/service/user/get-candidate-base";
import { AccessDenied } from "@/components/enterprise/talent-base/access-denied";
import { TalentCard } from "@/components/enterprise/talent-base/talent-card";
import { getAllTags } from "@/service/tag/get-all-tags";

export default function TalentBasePage() {
  const { userEnterprise } = UseUserEnteprise();

  // --- Estados de Filtro ---
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch] = useDebounce(searchQuery, 500);
  const [tagSearch, setTagSearch] = useState(""); // 2. Busca de Tags (Local)
  const [selectedTagIds, setSelectedTagIds] = useState<string[]>([]);
  const [page, setPage] = useState(0);

  // --- Verificação de Permissão ---
  // Se o usuário ainda está carregando, mostramos loading. 
  // Se carregou e é false, mostramos bloqueio.
  const canView = userEnterprise?.canViewCurriculumVitaeBase;

  // --- Query de Tags (para o filtro) ---
  const { data: allTags } = useQuery({
    queryKey: ["tags"],
    queryFn: () => getAllTags(), // Busca todas as tags
    enabled: !!canView, // Só busca se tiver permissão
  });

  const filteredTags = useMemo(() => {
    if (!allTags) return [];
    if (!tagSearch) return allTags;
    return allTags.filter(tag =>
      tag.name.toLowerCase().includes(tagSearch.toLowerCase())
    );
  }, [allTags, tagSearch]);

  // --- Query de Candidatos ---
  const { data: pageData, isLoading, isError } = useQuery({
    queryKey: ["candidateBase", debouncedSearch, selectedTagIds, page],
    queryFn: () => getCandidateBase({
      searchQuery: debouncedSearch || undefined,
      tagIds: selectedTagIds.length > 0 ? selectedTagIds : undefined,
      page,
      size: 10
    }),
    enabled: !!canView, // Só busca se tiver permissão
    staleTime: 1000 * 60 * 2, // Cache de 2 min
  });

  // --- Handlers ---
  const handleTagToggle = (tagId: string) => {
    setPage(0); // Reseta paginação ao filtrar
    setSelectedTagIds(prev =>
      prev.includes(tagId)
        ? prev.filter(id => id !== tagId)
        : [...prev, tagId]
    );
  };

  // --- Renderizações Condicionais ---

  if (userEnterprise === null) {
    return <div className="p-10 text-center">Carregando permissões...</div>;
  }

  if (!canView) {
    return (
      <div className="p-6 lg:p-10">
        <h1 className="text-2xl font-bold mb-6">Banco de Talentos</h1>
        <AccessDenied />
      </div>
    );
  }

  return (
    <main className="p-6 lg:p-10 space-y-6">
      <header>
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">
          Banco de Talentos
        </h1>
        <p className="text-gray-600 mt-1">
          Busque e filtre candidatos qualificados para sua empresa.
        </p>
      </header>

      <div className="flex flex-col lg:flex-row gap-6">

        {/* --- SIDEBAR DE FILTROS --- */}
        <aside className="w-full lg:w-64 flex-shrink-0 space-y-4">

          {/* Busca de Candidatos (Server) */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Buscar candidatos por nome..."
              className="pl-9 bg-white"
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setPage(0); }}
            />
          </div>

          {/* Filtro de Habilidades (Desktop) */}
          <div className="bg-white p-4 rounded-lg border shadow-sm hidden lg:block">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-sm">Habilidades</h3>
              {selectedTagIds.length > 0 && (
                <button
                  onClick={() => setSelectedTagIds([])}
                  className="text-xs text-blue-600 hover:underline"
                >
                  Limpar ({selectedTagIds.length})
                </button>
              )}
            </div>

            {/* 4. Input de Busca de Tags (NOVO) */}
            <div className="relative mb-3">
              <Input
                placeholder="Filtrar tags..."
                value={tagSearch}
                onChange={(e) => setTagSearch(e.target.value)}
                className="h-8 text-xs pl-8 bg-neutral-50 border-neutral-200"
              />
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
              {tagSearch && (
                <button
                  onClick={() => setTagSearch("")}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X className="h-3 w-3" />
                </button>
              )}
            </div>

            {/* Lista de Tags (Agora usa 'filteredTags') */}
            <ScrollArea className="h-64 pr-3">
              <div className="space-y-3">
                {/* Feedback de vazio */}
                {filteredTags.length === 0 && (
                  <p className="text-xs text-gray-500 text-center py-4">
                    Nenhuma tag encontrada.
                  </p>
                )}

                {/* 5. Renderiza a lista filtrada */}
                {filteredTags.map((tag) => (
                  <div key={tag.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`filter-${tag.id}`}
                      checked={selectedTagIds.includes(tag.id)}
                      onCheckedChange={() => handleTagToggle(tag.id)}
                    />
                    <Label
                      htmlFor={`filter-${tag.id}`}
                      className="text-sm font-normal cursor-pointer leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {tag.name}
                    </Label>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>

          {/* Botão de Filtro Mobile (Sheet) */}
          <div className="lg:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" className="w-full">
                  <Filter className="h-4 w-4 mr-2" />
                  Filtrar por Habilidades
                  {selectedTagIds.length > 0 && (
                    <span className="ml-2 bg-blue-100 text-blue-700 text-xs px-2 py-0.5 rounded-full">
                      {selectedTagIds.length}
                    </span>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent side="left">
                <SheetHeader>
                  <SheetTitle>Filtros</SheetTitle>
                  <SheetDescription>Selecione as habilidades desejadas.</SheetDescription>
                </SheetHeader>
                <div className="mt-4">
                  {/* Reusar a lógica de lista de tags aqui para mobile */}
                  {/* ... */}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </aside>

        {/* --- LISTA DE RESULTADOS --- */}
        <section className="flex-1">
          {isLoading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            </div>
          ) : isError ? (
            <div className="text-center py-10 text-red-600">Erro ao carregar candidatos.</div>
          ) : pageData?.content.length === 0 ? (
            <div className="text-center py-20 border-2 border-dashed rounded-xl">
              <p className="text-gray-500">Nenhum candidato encontrado com os filtros atuais.</p>
              <Button
                variant="link"
                onClick={() => { setSearchQuery(""); setSelectedTagIds([]); }}
              >
                Limpar filtros
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="text-sm text-gray-500 mb-2">
                Encontrados <strong>{pageData?.totalElements}</strong> profissionais
              </div>

              {pageData?.content.map((candidate) => (
                <TalentCard key={candidate.id} candidate={candidate} />
              ))}

              {/* Paginação Simples */}
              {pageData && pageData.totalPages > 1 && (
                <div className="flex justify-center gap-2 pt-6">
                  <Button
                    variant="outline"
                    disabled={page === 0}
                    onClick={() => setPage(p => p - 1)}
                  >
                    Anterior
                  </Button>
                  <Button
                    variant="outline"
                    disabled={page + 1 >= pageData.totalPages}
                    onClick={() => setPage(p => p + 1)}
                  >
                    Próxima
                  </Button>
                </div>
              )}
            </div>
          )}
        </section>

      </div>
    </main>
  );
}