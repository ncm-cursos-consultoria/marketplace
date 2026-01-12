"use client";

import { useMemo, useRef, useState } from "react";
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
  Search,
  Zap,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Upload,
  FileUp
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
import { UpgradeCandidateModal } from "@/components/candidate/upgrade-candidate-modal";
import { cancelSubscription } from "@/service/subscription/cancel-subscription";
import { api } from "@/service/api";

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

interface CvModalProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  userId: string;
}

function CvModal({ isOpen, setIsOpen, userId }: CvModalProps) {
  const [file, setFile] = useState<File | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();

  // Função de upload usando FormData e Axios (api)
  const { mutate, isPending } = useMutation({
    mutationFn: async (fileToUpload: File) => {
      const formData = new FormData();
      formData.append("file", fileToUpload);

      // Endpoint: Ajuste conforme sua rota de backend. 
      // Geralmente é algo como PATCH /user/{id}/upload?fileType=CURRICULUM_VITAE
      const { data } = await api.patch(`/user/${userId}/upload`, formData, {
        params: { fileType: "CURRICULUM_VITAE" },
        headers: { "Content-Type": "multipart/form-data" },
      });
      return data;
    },
    onSuccess: () => {
      toast.success("Currículo enviado com sucesso!");
      queryClient.invalidateQueries({ queryKey: ['authUser'] });
      setFile(null);
      setIsOpen(false);
    },
    onError: (err: any) => {
      console.error(err);
      toast.error(err?.response?.data?.message || "Erro ao enviar o arquivo.");
    }
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.type !== "application/pdf") {
        toast.error("Por favor, selecione um arquivo PDF.");
        return;
      }
      if (selectedFile.size > 5 * 1024 * 1024) { // 5MB
        toast.error("O arquivo deve ter no máximo 5MB.");
        return;
      }
      setFile(selectedFile);
    }
  };

  const handleUpload = () => {
    if (file) mutate(file);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Upload de Currículo</DialogTitle>
          <DialogDescription>
            Envie seu currículo em formato PDF (Máx. 5MB).
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col items-center justify-center gap-4 py-6 border-2 border-dashed border-neutral-200 rounded-xl bg-neutral-50 hover:bg-neutral-100 transition-colors cursor-pointer"
          onClick={() => inputRef.current?.click()}
        >
          <input
            ref={inputRef}
            type="file"
            accept="application/pdf"
            className="hidden"
            onChange={handleFileChange}
          />

          {file ? (
            <div className="flex flex-col items-center text-center">
              <FileText className="h-10 w-10 text-blue-600 mb-2" />
              <span className="font-medium text-blue-700 break-all px-4">{file.name}</span>
              <span className="text-xs text-neutral-500 mt-1">{(file.size / 1024 / 1024).toFixed(2)} MB</span>
              <span className="text-xs text-blue-500 mt-2 hover:underline">Clique para trocar</span>
            </div>
          ) : (
            <div className="flex flex-col items-center text-center">
              <Upload className="h-10 w-10 text-neutral-400 mb-2" />
              <span className="font-medium text-neutral-600">Clique para selecionar</span>
            </div>
          )}
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={() => setIsOpen(false)}>Cancelar</Button>
          <Button onClick={handleUpload} disabled={!file || isPending}>
            {isPending ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <FileUp className="h-4 w-4 mr-2" />}
            Enviar Arquivo
          </Button>
        </DialogFooter>
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
      await queryClient.cancelQueries({ queryKey: ['authUser'] });

      // 3.2. Pega um snapshot dos dados atuais
      const previousUserData = queryClient.getQueryData<UserCandidateResponse>(['authUser']);
      if (!previousUserData) return; // Se não houver dados, não faz nada

      // 3.3. ATUALIZA O CACHE IMEDIATAMENTE (A UI MUDA AGORA)
      queryClient.setQueryData<UserCandidateResponse>(['authUser'], (oldData) => {
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
        queryClient.setQueryData(['authUser'], context.previousUserData);
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
      queryClient.invalidateQueries({ queryKey: ['authUser'] });
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

interface CancelSubscriptionModalProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  onConfirm: () => void;
  isPending: boolean;
}

function CancelSubscriptionModal({ isOpen, setIsOpen, onConfirm, isPending }: CancelSubscriptionModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-2 text-red-600 mb-2">
            <AlertTriangle className="h-6 w-6" />
            <DialogTitle>Cancelar Assinatura?</DialogTitle>
          </div>
          <DialogDescription className="pt-2">
            Você tem certeza que deseja cancelar sua assinatura <strong>Standard</strong>?
            <br /><br />
            Você perderá acesso imediato ao portfólio de cursos e outros benefícios exclusivos ao final do ciclo atual.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="gap-2 sm:gap-0 mt-4">
          <Button
            variant="outline"
            onClick={() => setIsOpen(false)}
            disabled={isPending}
          >
            Manter Assinatura
          </Button>

          <Button
            variant="destructive"
            onClick={onConfirm}
            disabled={isPending}
            className="bg-red-600 hover:bg-red-700"
          >
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Cancelando...
              </>
            ) : (
              "Sim, Cancelar"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function FirstCol({ user, address, isLoading }: FirstColProps) {
  console.log("User recebido: ", user);
  
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [isSkillsModalOpen, setIsSkillsModalOpen] = useState(false);
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);
  const queryClient = useQueryClient();
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [isCvModalOpen, setIsCvModalOpen] = useState(false);

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

  const { mutate: cancelPlan, isPending: isCanceling } = useMutation({
    mutationFn: cancelSubscription,
    onSuccess: () => {
      toast.success("Assinatura cancelada com sucesso.");
      if (user?.id) {
        queryClient.invalidateQueries({ queryKey: ['authUser'] });
      }
      setIsCancelModalOpen(false); // Fecha o modal ao terminar
    },
    onError: () => {
      toast.error("Erro ao cancelar. Tente novamente mais tarde.");
      setIsCancelModalOpen(false); // Opcional: fechar ou manter aberto em erro
    }
  });

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

  const isStandard = user.plan === 'STANDARD';
  const planName = user.plan || 'BASIC';

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
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 overflow-hidden">
                  <FileText className="h-4 w-4 flex-shrink-0" />
                  {user.curriculumVitaeUrl ? (
                    <a className="text-blue-600 hover:underline truncate" href={user.curriculumVitaeUrl} target="_blank" rel="noreferrer">
                      Visualizar Currículo
                    </a>
                  ) : (
                    <span className="text-neutral-400">Currículo não informado</span>
                  )}
                </div>

                {/* Botão de Upload/Trocar */}
                {user.curriculumVitaeUrl ? (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 text-neutral-500 hover:text-blue-600"
                    onClick={() => setIsCvModalOpen(true)}
                    title="Trocar currículo"
                  >
                    <RefreshCw className="h-3.5 w-3.5" />
                  </Button>
                ) : (
                  <Button
                    variant="link"
                    className="h-auto p-0 text-blue-600 font-semibold text-xs"
                    onClick={() => setIsCvModalOpen(true)}
                  >
                    Adicionar
                  </Button>
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
        {/* --- CARD 2: PLANO E HABILIDADES (Refatorado) --- */}
        <div className="bg-white rounded-2xl shadow-sm p-6 w-full h-full space-y-4">

          {/* --- BLOCO A: PLANO DE ASSINATURA --- */}
          <div className="flex items-start justify-between border-b pb-3">
            <h3 className="text-sm font-semibold text-neutral-700 flex items-center gap-2">
              <Zap className="h-4 w-4 text-purple-600" />
              Plano de Assinatura
            </h3>
            <span className={`text-[11px] px-2 py-1 rounded-full ${isStandard ? "bg-green-100 text-green-700" : "bg-neutral-100 text-neutral-700"
              }`}>
              {planName.toUpperCase()}
            </span>
          </div>

          {isStandard ? (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center justify-between">
              <p className="text-sm font-medium text-red-800">
                Sua assinatura está ativa.
              </p>
              <Button
                size="sm"
                // ALTERADO: Agora apenas abre o modal
                onClick={() => setIsCancelModalOpen(true)}
                variant="destructive"
              >
                Cancelar Assinatura
              </Button>
            </div>
          ) : (
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-800">
                  Upgrade para Standard
                </p>
                <p className="text-xs text-blue-600">
                  Desbloqueie o Portfólio de Cursos.
                </p>
              </div>
              <Button
                size="sm"
                onClick={() => setIsUpgradeModalOpen(true)} // 3. Abre o modal
                className="bg-blue-600 hover:bg-blue-700 whitespace-nowrap"
              >
                Upgrade R$ 19,99/mês
              </Button>
            </div>
          )}

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

      {/* Renderiza o Modal de Upgrade */}
      <UpgradeCandidateModal
        userId={user.id}
        isOpen={isUpgradeModalOpen}
        setIsOpen={setIsUpgradeModalOpen}
      />

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

      <CancelSubscriptionModal
        isOpen={isCancelModalOpen}
        setIsOpen={setIsCancelModalOpen}
        onConfirm={() => cancelPlan(user.id)} // A ação real acontece aqui
        isPending={isCanceling}
      />

      <CvModal
        isOpen={isCvModalOpen}
        setIsOpen={setIsCvModalOpen}
        userId={user.id}
      />

    </div>
  );
}