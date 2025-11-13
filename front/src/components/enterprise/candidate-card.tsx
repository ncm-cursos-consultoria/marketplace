"use client";

import { useMemo, useState } from "react";
import type { JobCandidate } from "@/service/user/get-job-candidates";
import type { Tag } from "@/types/domain";
import {
  ChevronDown, FileText, User, BarChart2, Briefcase, Link as LinkIcon,
  Linkedin, Github, Phone, Mail, MapPin, Tag as TagIcon, Hash, Calendar, ExternalLink,
  Lock,
  Loader2
} from "lucide-react";
import { getAddress, type Address } from "@/service/address/get-address";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { DiscResultResponse, getUniqueDisc } from "@/service/user/disc/get-unique-disc";
import { ApplicationStatus, updateCandidateStatus } from "@/service/user/update-candidate-status";
// 1. Importe 'statusApplicationMap' E 'getApplicationStatusStyle'
import { statusApplicationMap, getApplicationStatusStyle, StatusStyle } from "@/utils/status-applciation-class"; // Verifique este path
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface CandidateCardProps {
  candidate: JobCandidate;
  jobTags: Tag[];
  canViewTests: boolean;
  jobId: string;
}

type ActiveTab = "general" | "disc" | "cv";

const statusOptionsWithStyle: (StatusStyle & { value: ApplicationStatus })[] =
  Object.keys(statusApplicationMap).map(key => {
    const status = key as ApplicationStatus;
    return {
      value: status,
      ...getApplicationStatusStyle(status)
    }
  });

export function CandidateCard({ candidate, jobTags, canViewTests, jobId }: CandidateCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  // Estado para controlar a aba ativa DENTRO do card
  const [activeTab, setActiveTab] = useState<ActiveTab>("general");
  const queryClient = useQueryClient();

  // Lógica de Negócio: Calcula as tags em comum
  const commonTags = useMemo(() => {
    const jobTagIds = new Set(jobTags.map(tag => tag.id));
    // CORREÇÃO AQUI: Verifica se candidate.tags é um array antes de filtrar
    if (!Array.isArray(candidate.tags)) {
      return []; // Retorna um array vazio se não houver tags
    }
    return candidate.tags.filter(tag => jobTagIds.has(tag.id));
  }, [candidate.tags, jobTags]);

  const fullName = `${candidate.firstName} ${candidate.lastName}`;

  const { mutate: changeStatus, isPending: isUpdatingStatus } = useMutation({
    mutationFn: updateCandidateStatus,
    onSuccess: () => {
      toast.success("Status do candidato atualizado!");
      queryClient.invalidateQueries({ queryKey: ["jobCandidates", jobId] });
    },
    onError: (err) => {
      toast.error("Falha ao atualizar o status.");
    }
  });

  // 9. Handler para o <Select>
  const handleStatusChange = (newStatus: ApplicationStatus) => {
    if (newStatus !== candidate.myApplicationStatus) {
      changeStatus({
        jobId: jobId,
        userId: candidate.id,
        jobOpeningUserCandidateStatus: newStatus
      });
    }
  };

  const currentStatusStyle = getApplicationStatusStyle(candidate.myApplicationStatus || "UNDER_REVIEW");
  const Icon = currentStatusStyle.icon;

  return (
    <div className="border rounded-lg overflow-hidden transition-all duration-300 bg-white shadow-sm">
      {/* --- O SNIPPET (ATUALIZADO) --- */}
      <div className="w-full p-4 flex flex-col md:flex-row md:items-center gap-4 text-left">

        {/* Imagem */}
        <img
          src={candidate.profilePictureUrl || `https://ui-avatars.com/api/?name=${fullName}&background=random`}
          alt={fullName}
          className="h-16 w-16 rounded-full bg-gray-200 object-cover"
        />

        {/* Info (Nome, Email, DISC) */}
        <div className="flex-1">
          <h4 className="font-semibold text-gray-900">{fullName}</h4>
          <p className="text-sm text-gray-500">{candidate.email}</p>
          {candidate.discTag && (
            <span className="mt-1 inline-flex items-center rounded-md bg-purple-100 px-2 py-0.5 text-xs font-medium text-purple-700">
              Perfil DISC: {candidate.discTag}
            </span>
          )}
        </div>

        {/* Tags em Comum */}
        <div className="w-full md:w-48 mt-2 md:mt-0 flex-shrink-0">
          {commonTags.length > 0 ? (
            <div className="flex flex-wrap items-center justify-start md:justify-end gap-2">
              {commonTags.slice(0, 3).map(tag => (
                <span key={tag.id} className="text-xs bg-emerald-100 text-emerald-800 font-medium px-2 py-1 rounded-full">
                  {tag.name || tag.title}
                </span>
              ))}
              {commonTags.length > 3 && (
                <span className="text-xs font-medium text-gray-500">
                  + {commonTags.length - 3}
                </span>
              )}
            </div>
          ) : (
            <p className="text-sm text-gray-500 text-left md:text-right">Nenhuma habilidade em comum</p>
          )}
        </div>
        <div className="w-full md:w-48 flex-shrink-0">
          <Select
            value={candidate.myApplicationStatus || "UNDER_REVIEW"}
            onValueChange={(value: ApplicationStatus) => handleStatusChange(value)}
            disabled={isUpdatingStatus}
          >
            <SelectTrigger className={currentStatusStyle.selectClassName}>
              <SelectValue asChild>
                {/* 8.1 Mostra o ícone e o texto do status ATUAL */}
                <span className="flex items-center gap-2">
                  {isUpdatingStatus ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Icon className="h-4 w-4" />
                  )}
                  {currentStatusStyle.text}
                </span>
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {/* 8.2 Mapeia as opções com ícones e cores */}
              {statusOptionsWithStyle.map(opt => {
                const ItemIcon = opt.icon;
                return (
                  <SelectItem
                    key={opt.value}
                    value={opt.value}
                    className={opt.selectClassName} // Aplica a cor no item
                  >
                    <span className="flex items-center gap-2">
                      <ItemIcon className="h-4 w-4" />
                      {opt.text}
                    </span>
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        </div>

        {/* Botão de Expandir */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="p-2 -m-2 text-gray-400 hover:text-gray-600"
        >
          <ChevronDown
            className={`h-5 w-5 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}
          />
        </button>
      </div>

      {/* --- O CONTEÚDO EXPANSÍVEL (sem alteração) --- */}
      {isExpanded && (
        <div className="border-t p-4 md:p-6">
          {/* As Abas Internas */}
          <div className="flex border-b mb-4">
            <TabButton label="Geral" icon={User} isActive={activeTab === 'general'} onClick={() => setActiveTab('general')} />
            <TabButton
              label="Perfil DISC"
              icon={canViewTests ? BarChart2 : Lock}
              isActive={activeTab === 'disc'}
              onClick={() => setActiveTab('disc')}
            />
            <TabButton label="Currículo" icon={FileText} isActive={activeTab === 'cv'} onClick={() => setActiveTab('cv')} />
          </div>

          {/* O Conteúdo das Abas */}
          <div>
            {activeTab === 'general' && <GeneralInfoTab candidate={candidate} />}
            {activeTab === 'disc' && <DiscProfileTab candidate={candidate} canViewTests={canViewTests} />}
            {activeTab === 'cv' && <CurriculumVitaeTab candidate={candidate} />}
          </div>
        </div>
      )}
    </div>
  );
}


// --- Componentes Internos das Abas ---

// Botão de Aba
function TabButton({ label, icon: Icon, isActive, onClick }: { label: string; icon: React.ElementType, isActive: boolean; onClick: () => void; }) {
  return (
    <button onClick={onClick} className={`flex items-center gap-2 px-3 py-2 text-sm font-medium ${isActive ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}>
      <Icon className="h-4 w-4" />
      {label}
    </button>
  );
}

function AddressDisplay({ addressId }: { addressId: string | null }) {
  const { data: address, isLoading, isError } = useQuery<Address>({
    queryKey: ["address", addressId],
    queryFn: () => getAddress(addressId!),
    enabled: !!addressId, // Só busca se o ID existir
  });

  if (!addressId) {
    return <InfoItem icon={MapPin} label="Endereço" value="Não informado" />;
  }

  if (isLoading) {
    return <InfoItem icon={MapPin} label="Endereço" value="Carregando..." />;
  }

  if (isError || !address) {
    return <InfoItem icon={MapPin} label="Endereço" value="Erro ao carregar" />;
  }

  const fullAddress = `${address.street}, ${address.number} - ${address.district}, ${address.city} - ${address.state}`;
  return <InfoItem icon={MapPin} label="Endereço" value={fullAddress} />;
}

function GeneralInfoTab({ candidate }: { candidate: JobCandidate }) {
  const fullName = `${candidate.firstName} ${candidate.lastName}`;

  // Função para formatar a data de aniversário
  const formatBirthday = (dateString: string | null) => {
    if (!dateString) return "Não informada";
    return new Intl.DateTimeFormat("pt-BR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
      timeZone: 'UTC',
    }).format(new Date(dateString));
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

      {/* --- COLUNA ESQUERDA (Dados Pessoais) --- */}
      <div className="lg:col-span-2 space-y-6">
        <div className="flex flex-col sm:flex-row items-start gap-6 bg-gray-50 p-6 rounded-lg">
          <img
            src={candidate.profilePictureUrl || `https://ui-avatars.com/api/?name=${fullName}&background=random&size=128`}
            alt={fullName}
            className="h-32 w-32 rounded-full bg-gray-200 object-cover flex-shrink-0"
          />
          <div className="space-y-2">
            <h3 className="text-2xl font-bold text-gray-900">{fullName}</h3>
            <p className="text-md text-gray-600">{candidate.subTitle || "Candidato"}</p>
            <dl className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4 text-sm">
              <InfoItem icon={Hash} label="CPF" value={candidate.cpf || "Não informado"} simple />
              <InfoItem icon={Calendar} label="Data de Nascimento" value={formatBirthday(candidate.birthday)} simple />
            </dl>
          </div>
        </div>

        <AddressDisplay addressId={candidate.addressId} />

        {candidate.about && (
          <InfoItem icon={User} label="Sobre" value={candidate.about} />
        )}

        {candidate.tags && candidate.tags.length > 0 && (
          <div>
            <h4 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
              <TagIcon className="h-5 w-5" /> Habilidades
            </h4>
            <div className="flex flex-wrap gap-2">
              {candidate.tags.map(tag => (
                <span key={tag.id} className="inline-flex items-center rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-700">
                  {tag.name || tag.title}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* --- COLUNA DIREITA (Contato) --- */}
      <div className="lg:col-span-1">
        <div className="bg-gray-50 p-4 rounded-lg space-y-3">
          <h4 className="font-semibold text-gray-800 border-b pb-2">Contato e Links</h4>
          <InfoItem icon={Mail} label="Email" value={<a href={`mailto:${candidate.email}`} className="text-blue-600 hover:underline break-all">{candidate.email}</a>} simple />
          <InfoItem icon={Phone} label="Telefone" value={candidate.phoneNumber || "Não informado"} simple />
          <InfoItem icon={Linkedin} label="LinkedIn" value={candidate.linkedInUrl ? <a href={candidate.linkedInUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline break-all">Ver perfil</a> : "Não informado"} simple />
          <InfoItem icon={Github} label="GitHub" value={candidate.githubUrl ? <a href={candidate.githubUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline break-all">Ver perfil</a> : "Não informado"} simple />
          <InfoItem icon={LinkIcon} label="Site Pessoal" value={candidate.mySiteUrl ? <a href={candidate.mySiteUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline break-all">Visitar site</a> : "Não informado"} simple />
        </div>
      </div>
    </div>
  );
}

// InfoItem atualizado para aceitar um modo 'simple' sem fundo
function InfoItem({ icon: Icon, label, value, simple = false }: { icon: React.ElementType, label: string, value: React.ReactNode, simple?: boolean }) {
  const containerClasses = simple ? "" : "flex items-start gap-3 rounded-lg bg-gray-50 p-3";
  return (
    <div className={containerClasses}>
      <div className="flex items-start gap-3">
        <Icon className="h-4 w-4 flex-shrink-0 text-gray-500 mt-0.5" />
        <div>
          <dt className="font-semibold text-gray-800">{label}</dt>
          <dd className="text-gray-600">{value}</dd>
        </div>
      </div>
    </div>
  );
}

const discProfileTranslations: Record<string, string> = {
  DOMINANCE: "Dominante",
  INFLUENCING: "Influente",
  STEADINESS: "Estável",
  COMPLIANCE: "Conforme",
};

// Componente auxiliar para as seções do DISC
function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="bg-white p-4 sm:p-6 border rounded-lg shadow-sm">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
        <span className="inline-flex items-center rounded-md bg-gray-100 px-2 py-1 text-xs font-medium text-gray-600">
        </span>
      </div>
      <div className="mt-4">{children}</div>
    </section>
  );
}

/**
 * ABA TOTALMENTE REFEITA: DiscProfileTab
 */
function DiscProfileTab({ candidate, canViewTests }: { candidate: JobCandidate, canViewTests: boolean }) {
  // --- 7. VERIFICAÇÃO DE PERMISSÃO ---
  if (!canViewTests) {
    return (
      <div className="p-8 text-center border rounded-lg bg-gray-50">
        <div className="flex justify-center mb-4">
          <div className="p-3 bg-yellow-100 rounded-full">
            <Lock className="h-6 w-6 text-yellow-700" />
          </div>
        </div>
        <h5 className="font-semibold text-lg">Função não disponível</h5>
        <p className="mt-1 text-sm text-gray-600">
          A visualização do perfil comportamental DISC não está incluída no seu plano atual.
        </p>
        {/* Opcional: Adicionar um botão de upgrade */}
        {/* <Button className="mt-4" size="sm">
                Fazer Upgrade
            </Button>
            */}
      </div>
    );
  }

  const { data: result, isLoading, isError } = useQuery<DiscResultResponse>({
    queryKey: ["discResult", candidate.discId],
    queryFn: () => getUniqueDisc(candidate.discId!),
    enabled: !!candidate.discId, // A query só roda se o candidato tiver um discId
  });

  if (!candidate.discId) {
    return (
      <div className="p-4 text-center border rounded-lg bg-gray-50">
        <h5 className="font-semibold">Teste não realizado</h5>
        <p className="mt-1 text-sm text-gray-600">Este candidato ainda não completou o teste comportamental.</p>
      </div>
    );
  }

  if (isLoading) {
    return <div className="p-4 text-center">Carregando relatório DISC...</div>;
  }

  if (isError || !result) {
    return <div className="p-4 text-center text-red-600">Falha ao carregar o relatório DISC.</div>;
  }

  const mainProfile = discProfileTranslations[result.main] || result.main;

  return (
    <div className="space-y-6">
      <header className="text-center">
        <h2 className="text-2xl font-bold text-gray-900">
          Resultado Comportamental
        </h2>
        <p className="mt-1 text-2xl uppercase font-bold text-purple-700">
          {mainProfile}
        </p>
      </header>

      <div className="space-y-4">
        <Section title="Você no DISC">
          <p className="text-sm text-gray-700 italic">
            {result.yourDiscProfile || "Carregando..."}
          </p>
        </Section>
        <Section title="Máscara Postural">
          <p className="text-sm text-gray-700 italic">
            {result.publicProfile || "Carregando..."}
          </p>
        </Section>
        <Section title="Íntimo">
          <p className="text-sm text-gray-700 italic">
            {result.privateSelf || "Carregando..."}
          </p>
        </Section>
        <Section title="Postura Usual">
          <p className="text-sm text-gray-700 italic">
            {result.naturalBehavior || "Carregando..."}
          </p>
        </Section>
        <Section title="Aconselhamento Adicional">
          <p className="text-sm text-gray-700 italic">
            {result.developmentTips || "Carregando..."}
          </p>
        </Section>
      </div>
    </div>
  );
}

// Aba do Currículo (PDF)
function CurriculumVitaeTab({ candidate }: { candidate: JobCandidate }) {
  if (!candidate.curriculumVitaeUrl) {
    return (
      <div className="p-4 text-center border rounded-lg bg-gray-50">
        <h5 className="font-semibold">Currículo não disponível</h5>
        <p className="mt-1 text-sm text-gray-600">O candidato não enviou um currículo.</p>
      </div>
    );
  }

  return (
    <div>
      <a
        href={candidate.curriculumVitaeUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-blue-600 hover:underline"
      >
        <ExternalLink className="h-4 w-4" />
        Abrir currículo em uma nova aba
      </a>
      <div className="aspect-w-4 aspect-h-5 lg:aspect-w-3 lg:aspect-h-4">
        <iframe
          src={candidate.curriculumVitaeUrl}
          title={`Currículo de ${candidate.firstName}`}
          className="w-full h-[70vh] border rounded-lg"
        />
      </div>
    </div>
  );
}

