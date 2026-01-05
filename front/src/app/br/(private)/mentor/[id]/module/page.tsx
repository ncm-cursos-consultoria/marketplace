"use client";

import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import {
  BookOpen,
  Plus,
  Users,
  Layers,
  MoreVertical,
  ArrowRight,
  Search,
  Eye
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import Image from "next/image";
import ncmHorizontal from "@/assets/logo-ncm-horizontal.svg";
import { ApiModule, getAllModules } from "@/service/module/get-all-modules";
import { useMemo, useState } from "react";
import { EditModuleModal } from "@/components/mentor/module/edit-module-modal";
import { AddModuleModal } from "@/components/mentor/module/add-module-modal";

export default function MentorModulesPage() {
  const { id: mentorId } = useParams();
  const [selectedModule, setSelectedModule] = useState<ApiModule | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const handleEditClick = (module: ApiModule) => {
    setSelectedModule(module);
    setIsEditModalOpen(true);
  };

  // Dentro do componente MentorModulesPage
  const { data: modules, isLoading } = useQuery({
    queryKey: ["mentor-modules", mentorId],
    queryFn: () => getAllModules({ mentorIds: [mentorId as string] })
  });

  // Dentro de MentorModulesPage
  const [searchTerm, setSearchTerm] = useState("");

  // Lógica de filtro
  const filteredModules = useMemo(() => {
    if (!modules) return [];
    return modules.filter((mod: ApiModule) =>
      mod.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [modules, searchTerm]);


  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <AddModuleModal
        mentorId={mentorId as string}
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />
      <EditModuleModal
        module={selectedModule}
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
      />
      {/* Header com Ações Principais */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Layers className="h-6 w-6 text-blue-900" /> Meus Módulos
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Gerencie o conteúdo dos seus cursos e acompanhe o engajamento dos alunos.
          </p>
        </div>

        <Button
          onClick={() => setIsAddModalOpen(true)}
          className="bg-blue-900 hover:bg-blue-800 text-white rounded-xl gap-2 h-11 px-6 shadow-md"
        >
          <Plus className="h-5 w-5" /> Criar Novo Módulo
        </Button>
      </header>

      {/* Barra de Filtros */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Filtrar por nome do curso..."
            className="pl-9 h-11 rounded-xl"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)} // Atualiza o termo ao digitar
          />
        </div>
      </div>

      {/* Grid de Módulos */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredModules.length > 0 ? (
          filteredModules.map((module: ApiModule) => (
            <MentorModuleCard
              key={module.id}
              mentorId={mentorId as string}
              module={module}
              onEdit={() => handleEditClick(module)} // << ESTA LINHA FALTAVA
            />
          ))
        ) : (
          <p className="col-span-full text-center py-10 text-gray-400">
            Nenhum módulo encontrado para "{searchTerm}"
          </p>
        )}
      </div>
    </div>
  );
}

interface MentorModuleCardProps {
  mentorId: string;
  module: ApiModule;
  onEdit: () => void; // Adicione esta prop
}

function MentorModuleCard({ mentorId, module, onEdit }: MentorModuleCardProps) {
  // Definimos a imagem (capa ou logo padrão) conforme a lógica estabelecida anteriormente
  const imageUrl = ncmHorizontal;

  return (
    <Card className="group flex flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-all hover:shadow-md">
      {/* Container da Imagem 16:9 */}
      <div className="relative aspect-video w-full bg-gray-100 overflow-hidden shrink-0">
        <Image
          src={imageUrl}
          alt={`Capa do módulo ${module.title}`}
          fill
          className="object-contain p-8 transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute top-3 right-3">
          <Badge className="bg-white/90 text-blue-900 hover:bg-white backdrop-blur-sm border-none shadow-sm font-bold">
            {module.courseCount ?? 0} Aula(s)
          </Badge>
        </div>
      </div>

      {/* Conteúdo do Card */}
      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="font-bold text-gray-900 text-lg line-clamp-1">
            {module.title}
          </h3>

          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg shrink-0">
            <MoreVertical className="h-4 w-4 text-gray-400" />
          </Button>
        </div>

        <p className="text-sm text-gray-500 line-clamp-2 mb-4 leading-relaxed">
          {module.description || "Sem descrição disponível."}
        </p>

        {/* Estatísticas e Flags */}
        <div className="grid grid-cols-2 gap-4 py-4 border-y border-gray-50 mb-4">
          <div className="flex items-center gap-2">
            <Eye className="h-4 w-4 text-blue-600" />
            <div className="flex flex-col">
              <span className="text-xs font-bold text-gray-900">{module.view ?? 0}</span>
              <span className="text-[10px] text-gray-400 uppercase tracking-wider">Visualizações</span>
            </div>
          </div>

          {/* Flag de Plano Gratuito opcional para visualização do mentor */}
          <div className="flex items-center gap-2">
            <div className={`h-2 w-2 rounded-full ${module.freePlan ? "bg-green-500" : "bg-amber-500"}`} />
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-gray-900 uppercase">
                {module.freePlan ? "Plano Gratuito" : "Plano Premium"}
              </span>
            </div>
          </div>
        </div>

        {/* Rodapé de Ações */}
        <div className="mt-auto flex items-center justify-between gap-2">
          {/* Clique para ver as aulas/cursos do módulo */}
          <Link
            href={`/br/mentor/${mentorId}/course/${module.id}`}
            className="flex-1 text-center bg-gray-50 hover:bg-gray-100 text-blue-900 font-bold py-2 rounded-xl text-sm transition-colors border border-gray-100"
          >
            Ver Aulas
          </Link>

          {/* Botão de abrir o modal de edição que já tínhamos */}
          <Button
            variant="outline"
            onClick={(e) => {
              e.preventDefault(); // Evita qualquer comportamento de link se houver
              onEdit();
            }}
            className="rounded-xl border-blue-200 text-blue-900 hover:bg-blue-50"
          >
            Editar
          </Button>
        </div>
      </div>
    </Card>
  );
}
