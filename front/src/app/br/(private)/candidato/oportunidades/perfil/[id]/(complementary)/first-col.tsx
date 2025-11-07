"use client";

import { useMemo, useState } from "react";
import {
  Github,
  Globe2,
  Linkedin,
  Mail,
  Phone,
  Users2,
  FileText,
  MapPin,
  Pencil,
  Loader2,
  Search
} from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { updateCandidateTags, UserCandidateResponse } from "@/service/user/update-candidate-tags"; // Ajuste o path se necessário
import { ApiAddress } from "@/types/address";
import { patchUserAddress } from "@/service/user/create-or-update-candidate-address";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { getAllTags, GetTagParams, TagResponse } from "@/service/tag/get-all-tags";
import { ScrollArea } from "@/components/ui/scroll-area"; // <-- CORREÇÃO AQUI
import { Checkbox } from "@/components/ui/checkbox";

// --- SKELETONS (Componentes de Carregamento) ---
function SkeletonCard() {
  return <div className="bg-white rounded-2xl shadow-sm p-6 h-48 w-full animate-pulse" />;
}
function SkeletonArticle() {
  return <div className="bg-white rounded-2xl shadow-sm p-6 h-32 w-full animate-pulse" />;
}

// --- Props do Componente Principal ---
interface FirstColProps {
  user?: UserCandidateResponse;
  address?: ApiAddress;
  isLoading: boolean;
}

// -----------------------------------------------------------------
// --- COMPONENTE INTERNO: AddressBlock ---
// -----------------------------------------------------------------
function AddressBlock({ address }: { address?: ApiAddress }) {
  if (!address) {
    return <span className="text-sm text-neutral-400">Endereço não informado</span>;
  }

  return (
    <div className="space-y-2 text-sm text-neutral-700">
      {/* Rua e Número */}
      {address.street && (
        <p className="flex items-start gap-2">
          <MapPin className="h-4 w-4 flex-shrink-0 text-neutral-500 mt-0.5" />
          <span>
            {address.street}
            {address.number ? `, ${address.number}` : ''}
          </span>
        </p>
      )}

      {/* Complemento */}
      {address.addressLine2 && (
        <p className="pl-6">{address.addressLine2}</p>
      )}

      {/* Bairro */}
      {address.district && (
        <p className="pl-6">{address.district}</p>
      )}

      {/* Cidade e Estado */}
      {address.city && (
        <p className="pl-6">
          {address.city}
          {address.state ? ` - ${address.state}` : ''}
        </p>
      )}

      {/* CEP */}
      {address.zip && (
        <p className="pl-6">CEP: {address.zip}</p>
      )}

      {/* País */}
      {address.country && (
        <p className="pl-6">{address.country}</p>
      )}
    </div>
  );
}

// -----------------------------------------------------------------
// --- LÓGICA DO MODAL (Schema e Tipo) ---
// -----------------------------------------------------------------
const addressSchema = z.object({
  country: z.string().min(1, "País é obrigatório"),
  state: z.string().min(1, "Estado é obrigatório"),
  city: z.string().min(1, "Cidade é obrigatória"),
  district: z.string().min(1, "Bairro é obrigatório"),
  zip: z.string().min(1, "CEP é obrigatório"),
  street: z.string().min(1, "Rua é obrigatória"),
  number: z.string().min(1, "Número é obrigatório"),
  addressLine2: z.string().optional(),
});

type AddressFormData = z.infer<typeof addressSchema>;

interface AddressModalProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  userId: string;
  currentAddress?: ApiAddress;
}

// -----------------------------------------------------------------
// --- COMPONENTE INTERNO: AddressModal ---
// -----------------------------------------------------------------
function AddressModal({ isOpen, setIsOpen, userId, currentAddress }: AddressModalProps) {
  const queryClient = useQueryClient();

  const form = useForm<AddressFormData>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      country: currentAddress?.country || "Brasil",
      state: currentAddress?.state || "",
      city: currentAddress?.city || "",
      district: currentAddress?.district || "",
      zip: currentAddress?.zip || "",
      street: currentAddress?.street || "",
      number: currentAddress?.number || "",
      addressLine2: currentAddress?.addressLine2 || "",
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: patchUserAddress,
    onSuccess: () => {
      toast.success("Endereço atualizado com sucesso!");
      queryClient.invalidateQueries({ queryKey: ['authUser'] });
      // Também é bom invalidar a query de endereço diretamente, se ela existir
      queryClient.invalidateQueries({ queryKey: ['userAddress'] });
      setIsOpen(false);
    },
    onError: (error) => {
      toast.error("Falha ao atualizar o endereço. Tente novamente.");
      console.error(error);
    }
  });

  function onSubmit(data: AddressFormData) {
    mutate({ userId, data });
  }

  // --- O JSX DO MODAL (que estava faltando) ---
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Atualizar Endereço</DialogTitle>
          <DialogDescription>
            Insira os dados do seu endereço principal.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="street"
                render={({ field }) => ( // Sem o 'any', pois 'form.control' está tipado
                  <FormItem>
                    <FormLabel>Rua</FormLabel>
                    <FormControl>
                      <Input placeholder="Av. Paulista" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="number"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Número</FormLabel>
                    <FormControl>
                      <Input placeholder="1000" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="addressLine2"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Complemento (Opcional)</FormLabel>
                  <FormControl>
                    <Input placeholder="Apto 101, Bloco A" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="district"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bairro</FormLabel>
                    <FormControl>
                      <Input placeholder="Bela Vista" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cidade</FormLabel>
                    <FormControl>
                      <Input placeholder="São Paulo" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="state"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Estado</FormLabel>
                    <FormControl>
                      <Input placeholder="SP" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="zip"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>CEP</FormLabel>
                    <FormControl>
                      <Input placeholder="01310-100" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="country"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>País</FormLabel>
                    <FormControl>
                      <Input placeholder="Brasil" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter className="pt-4">
              <Button type="button" variant="ghost" onClick={() => setIsOpen(false)}>Cancelar</Button>
              <Button type="submit" disabled={isPending}>
                {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Salvar Alterações"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

interface SkillsModalProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  user: UserCandidateResponse; // Passamos o usuário inteiro
}

function SkillsModal({ isOpen, setIsOpen, user }: SkillsModalProps) {
  const queryClient = useQueryClient();
  const params: GetTagParams = {};

  const [searchTerm, setSearchTerm] = useState("");

  // Busca todas as tags disponíveis (sem alteração)
  const { data: allTags, isLoading: isLoadingTags } = useQuery({
    queryKey: ['allTags'],
    queryFn: () => getAllTags(params),
  });

  // Cria um Set com os IDs das tags que o usuário JÁ POSSUI (sem alteração)
  const userTagIds = useMemo(() => {
    return new Set(user.tags?.map(tag => tag.id) || []);
  }, [user.tags]);

  // --- 1. LÓGICA DE FILTRO E SEPARAÇÃO ATUALIZADA ---
  // Filtra E separa as tags em duas colunas
  const { hardSkills, softSkills, totalFiltered } = useMemo(() => {
    const hard: TagResponse[] = [];
    const soft: TagResponse[] = [];
    if (!allTags) return { hardSkills: hard, softSkills: soft, totalFiltered: 0 };

    const filtered = allTags.filter(tag =>
      tag.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Separa as tags filtradas em duas listas
    filtered.forEach(tag => {
      // Ajuste 'HARD_SKILL' e 'SOFT_SKILL' se os 'types' no DB forem diferentes
      if (tag.type === 'HARD_SKILL') {
        hard.push(tag);
      } else if (tag.type === 'SOFT_SKILL') {
        soft.push(tag);
      }
    });

    return { hardSkills: hard, softSkills: soft, totalFiltered: filtered.length };
  }, [allTags, searchTerm]);


  // 3. Mutação para ADICIONAR ou REMOVER uma tag
  const { mutate, isPending, variables } = useMutation({
    mutationFn: updateCandidateTags,

    // --- ATUALIZAÇÃO OTIMISTA ---
    onMutate: async (variablesSent) => {
      const { tagId, action } = variablesSent;

      // 3.1. Cancela queries pendentes do 'authUser'
      await queryClient.cancelQueries({ queryKey: ['authUser', user.id] });

      // 3.2. Pega um snapshot dos dados atuais
      const previousUserData = queryClient.getQueryData<UserCandidateResponse>(['authUser', user.id]);
      if (!previousUserData) return; // Se não houver dados, não faz nada

      // 3.3. ATUALIZA O CACHE IMEDIATAMENTE (A UI MUDA AGORA)
      queryClient.setQueryData<UserCandidateResponse>(['authUser', user.id], (oldData) => {
        if (!oldData) return oldData;

        let newTags = [...(oldData.tags || [])];

        if (action === 'ADD') {
          // Encontra o objeto da tag inteira para adicionar
          const tagToAdd = allTags?.find(t => t.id === tagId);
          if (tagToAdd && !newTags.find(t => t.id === tagId)) {
            newTags.push(tagToAdd);
          }
        } else { // Ação é 'REMOVE'
          // Filtra a tag removida
          newTags = newTags.filter(t => t.id !== tagId);
        }

        return { ...oldData, tags: newTags };
      });

      // 3.4. Retorna o snapshot para usar no 'onError'
      return { previousUserData };
    },

    // 3.5. Em caso de erro, reverte a mudança
    onError: (error, variables, context) => {
      toast.error("Não foi possível atualizar a tag. Revertendo.");
      // Reverte o cache para o estado anterior
      if (context?.previousUserData) {
        queryClient.setQueryData(['authUser', user.id], context.previousUserData);
      }
    },

    // 3.6. onSuccess agora é silencioso. A UI já mudou.
    onSuccess: () => {
      // Não fazemos nada. A mudança já está na tela.
    },
    // NÃO invalidamos aqui, vamos invalidar ao fechar o modal.
  });

  // 4. Função de clique (sem alteração)
  const handleTagChange = (tag: TagResponse, isChecked: boolean) => {
    mutate({
      id: user.id,
      tagId: tag.id,
      action: isChecked ? 'ADD' : 'REMOVE',
    });
  };

  // 5. NOVA FUNÇÃO: Invalida a query QUANDO O MODAL FECHAR
  const handleModalClose = (open: boolean) => {
    if (!open) {
      // O modal está fechando. Agora sim, invalidamos a query
      // para garantir que os dados fiquem 100% sincronizados.
      queryClient.invalidateQueries({ queryKey: ['authUser', user.id] });
    }
    setIsOpen(open);
  };

  // 6. JSX (Modificado para usar o novo handleModalClose)
  return (
    <Dialog open={isOpen} onOpenChange={handleModalClose}>
      {/* 2.1 Aumentar a largura do modal */}
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Atualizar Habilidades</DialogTitle>
          <DialogDescription>
            Selecione as tecnologias e habilidades que você domina.
          </DialogDescription>
        </DialogHeader>

        {/* Input de Pesquisa (sem alteração) */}
        <div className="relative">
          <Input
            placeholder="Pesquisar habilidades..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-400" />
        </div>

        <ScrollArea className="h-72 w-full">
          {/* 2.2 Estado de Carregamento Centralizado */}
          {isLoadingTags && (
            <div className="flex items-center justify-center h-48">
              <Loader2 className="h-6 w-6 animate-spin text-neutral-400" />
            </div>
          )}

          {/* 2.3 Estado de Pesquisa Vazia */}
          {!isLoadingTags && totalFiltered === 0 && (
            <p className="text-center text-sm text-neutral-500 py-4">
              {searchTerm
                ? `Nenhuma habilidade encontrada para "${searchTerm}"`
                : "Nenhuma habilidade encontrada."
              }
            </p>
          )}

          {/* 2.4 Grid de Duas Colunas */}
          {!isLoadingTags && totalFiltered > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 pr-4">

              {/* --- Coluna de Hard Skills --- */}
              <div className="space-y-3">
                <h4 className="font-semibold text-neutral-800 border-b pb-1">
                  Hard Skills (Técnicas)
                </h4>
                {hardSkills.length === 0 && (
                  <p className="text-sm text-neutral-500 py-2">
                    {searchTerm ? 'Nenhuma encontrada' : 'Nenhuma'}
                  </p>
                )}
                {hardSkills.map((tag) => {
                  const isTagPending = isPending && variables?.tagId === tag.id;
                  return (
                    <div key={tag.id} className="flex items-center justify-between">
                      <label htmlFor={tag.id} className="text-sm font-medium text-neutral-800 cursor-pointer">
                        {tag.name}
                      </label>
                      <div className="flex items-center gap-2">
                        {isTagPending && <Loader2 className="h-4 w-4 animate-spin text-neutral-400" />}
                        <Checkbox
                          id={tag.id}
                          checked={userTagIds.has(tag.id)}
                          onCheckedChange={(isChecked) => handleTagChange(tag, isChecked as boolean)}
                          disabled={isTagPending}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* --- Coluna de Soft Skills --- */}
              <div className="space-y-3">
                <h4 className="font-semibold text-neutral-800 border-b pb-1">
                  Soft Skills (Comportamentais)
                </h4>
                {softSkills.length === 0 && (
                  <p className="text-sm text-neutral-500 py-2">
                    {searchTerm ? 'Nenhuma encontrada' : 'Nenhuma'}
                  </p>
                )}
                {softSkills.map((tag) => {
                  const isTagPending = isPending && variables?.tagId === tag.id;
                  return (
                    <div key={tag.id} className="flex items-center justify-between">
                      <label htmlFor={tag.id} className="text-sm font-medium text-neutral-800 cursor-pointer">
                        {tag.name}
                      </label>
                      <div className="flex items-center gap-2">
                        {isTagPending && <Loader2 className="h-4 w-4 animate-spin text-neutral-400" />}
                        <Checkbox
                          id={tag.id}
                          checked={userTagIds.has(tag.id)}
                          onCheckedChange={(isChecked) => handleTagChange(tag, isChecked as boolean)}
                          disabled={isTagPending}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>

            </div>
          )}
      </ScrollArea>
      <DialogFooter>
        <Button type="button" onClick={() => handleModalClose(false)}>
          Fechar
        </Button>
      </DialogFooter>
    </DialogContent>
    </Dialog >
  );
}

export function FirstCol({ user, address, isLoading }: FirstColProps) {
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [isSkillsModalOpen, setIsSkillsModalOpen] = useState(false);

  const { hardSkills, softSkills } = useMemo(() => {
    const hard: TagResponse[] = [];
    const soft: TagResponse[] = [];

    (user?.tags || []).forEach(tag => {
      // Ajuste 'HARD_SKILL' e 'SOFT_SKILL' se os 'types' no DB forem diferentes
      if (tag.type === 'HARD_SKILL') {
        hard.push(tag);
      } else if (tag.type === 'SOFT_SKILL') {
        soft.push(tag);
      }
    });

    return { hardSkills: hard, softSkills: soft };
  }, [user?.tags]);

  // --- ESTADO DE CARREGAMENTO ---
  if (isLoading) {
    return (
      <div className="flex flex-col gap-6 w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <SkeletonCard />
          <SkeletonCard />
        </div>
        <SkeletonArticle />
      </div>
    );
  }

  // --- ESTADO DE ERRO OU VAZIO ---
  if (!user) {
    return <p>Carregando...</p>;
  }

  // --- RENDERIZAÇÃO COM DADOS REAIS ---
  return (
    <div className="flex flex-col gap-6 w-full">

      {/* --- LINHA 1: GRID DE DUAS COLUNAS --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* --- CARD 1: ENDEREÇO E CONTATO --- */}
        <div className="bg-white rounded-2xl shadow-sm p-6 w-full h-full flex flex-col md:flex-row gap-6">

          {/* Coluna da Esquerda: Endereço */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-neutral-700">Endereço</h3>
              {/* Botão de Edição (Caneta) */}
              <button
                onClick={() => setIsAddressModalOpen(true)}
                className="text-neutral-500 hover:text-blue-600 transition-colors"
                aria-label="Editar endereço"
              >
                <Pencil className="h-4 w-4" />
              </button>
            </div>
            <AddressBlock address={address} />
          </div>

          {/* Divisor (opcional, bom para mobile) */}
          <div className="border-b md:border-b-0 md:border-l border-neutral-200"></div>

          {/* Coluna da Direita: Links e Contato */}
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-semibold text-neutral-700">Links e Contato</h3>
            <dl className="mt-5 space-y-4 text-sm text-neutral-700">

              {/* GitHub */}
              <div className="flex items-center gap-2">
                <Github className="h-4 w-4 flex-shrink-0" />
                {user.githubUrl ? (
                  <a className="text-blue-600 hover:underline truncate" href={user.githubUrl} target="_blank" rel="noreferrer">
                    {user.githubUrl.replace("https://", "")}
                  </a>
                ) : (
                  <span className="text-neutral-400">GitHub não informado</span>
                )}
              </div>

              {/* LinkedIn */}
              <div className="flex items-center gap-2">
                <Linkedin className="h-4 w-4 flex-shrink-0" />
                {user.linkedInUrl ? (
                  <a className="text-blue-600 hover:underline truncate" href={user.linkedInUrl} target="_blank" rel="noreferrer">
                    {user.linkedInUrl.replace("https://", "")}
                  </a>
                ) : (
                  <span className="text-neutral-400">LinkedIn não informado</span>
                )}
              </div>

              {/* My Site */}
              <div className="flex items-center gap-2">
                <Globe2 className="h-4 w-4 flex-shrink-0" />
                {user.mySiteUrl ? (
                  <a className="text-blue-600 hover:underline truncate" href={user.mySiteUrl} target="_blank" rel="noreferrer">
                    {user.mySiteUrl.replace("https://", "")}
                  </a>
                ) : (
                  <span className="text-neutral-400">Site pessoal não informado</span>
                )}
              </div>

              {/* Currículo */}
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 flex-shrink-0" />
                {user.curriculumVitaeUrl ? (
                  <a className="text-blue-600 hover:underline truncate" href={user.curriculumVitaeUrl} target="_blank" rel="noreferrer">
                    Visualizar Currículo
                  </a>
                ) : (
                  <span className="text-neutral-400">Currículo não informado</span>
                )}
              </div>

              {/* Email */}
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 flex-shrink-0" />
                <span className="truncate">{user.email}</span>
              </div>

              {/* Telefone */}
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 flex-shrink-0" />
                {user.phoneNumber ? (
                  <span className="truncate">{user.phoneNumber}</span>
                ) : (
                  <span className="text-neutral-400">Telefone não informado</span>
                )}
              </div>
            </dl>
          </div>
        </div>

        {/* --- CARD 2: STATUS DO PERFIL --- */}
        <div className="bg-white rounded-2xl shadow-sm p-6 w-full h-full">
          <div className="flex items-start justify-between">
            <h3 className="text-sm font-semibold text-neutral-700">
              Status do Perfil
            </h3>
            <span className={`text-[11px] px-2 py-1 rounded-full ${user.isBlocked
              ? "bg-red-100 text-red-700"
              : "bg-emerald-100 text-emerald-700"
              }`}>
              {user.isBlocked ? "INATIVO" : "ATIVO"}
            </span>
          </div>
          <p className="mt-3 text-sm text-neutral-700">
            {user.isBlocked
              ? "Seu perfil não está visível para recrutadores."
              : "Seu perfil está visível para recrutadores e empresas parceiras."
            }
          </p>

          {/* --- 2. BLOCO DE HABILIDADES ATUALIZADO --- */}
          <div className="mt-4 rounded-xl border p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-start gap-3">
                <Users2 className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm font-medium">
                  Habilidades
                </p>
              </div>
              <button
                onClick={() => setIsSkillsModalOpen(true)}
                className="text-neutral-500 hover:text-blue-600 transition-colors"
                aria-label="Editar habilidades"
              >
                <Pencil className="h-4 w-4" />
              </button>
            </div>

            {/* Lista de Habilidades Dividida */}
            {(hardSkills.length === 0 && softSkills.length === 0) ? (
              <p className="text-xs text-neutral-600">
                Nenhuma habilidade definida.
              </p>
            ) : (
              // Caso 2: Renderiza as seções
              <div className="space-y-4">

                {/* Seção de Hard Skills */}
                {hardSkills.length > 0 && (
                  <div>
                    <h4 className="text-xs font-semibold text-neutral-500 mb-2">
                      Hard Skills (Técnicas)
                    </h4>
                    <div className="flex flex-wrap gap-1">
                      {hardSkills.map((tag) => (
                        <span key={tag.id} className="text-xs text-neutral-600 bg-neutral-100 px-2 py-0.5 rounded-full">
                          {tag.name}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Seção de Soft Skills */}
                {softSkills.length > 0 && (
                  <div>
                    <h4 className="text-xs font-semibold text-neutral-500 mb-2">
                      Soft Skills (Comportamentais)
                    </h4>
                    <div className="flex flex-wrap gap-1">
                      {softSkills.map((tag) => (
                        <span key={tag.id} className="text-xs text-neutral-600 bg-neutral-100 px-2 py-0.5 rounded-full">
                          {tag.name}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

              </div>
            )}
          </div>
        </div>
      </div>

      {/* --- LINHA 2: CARD "SOBRE" --- */}
      {user.about && (
        <article className="bg-white rounded-2xl shadow-sm p-6 w-full">
          <h3 className="text-sm font-semibold text-neutral-700">
            Sobre {user.firstName}
          </h3>
          <p className="mt-4 text-sm leading-6 text-neutral-800 whitespace-pre-wrap">
            {user.about}
          </p>
        </article>
      )}

      {/* --- Renderiza o Modal --- */}
      <AddressModal
        isOpen={isAddressModalOpen}
        setIsOpen={setIsAddressModalOpen}
        userId={user.id}
        currentAddress={address}
      />

      {/* 10. Renderiza o novo Modal de Habilidades */}
      <SkillsModal
        isOpen={isSkillsModalOpen}
        setIsOpen={setIsSkillsModalOpen}
        user={user}
      />

    </div>
  );
}