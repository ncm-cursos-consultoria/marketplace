"use client";

import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Modal } from "../modal";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useCreateJob } from "@/hooks/forms/create-job";
import { UseUserEnteprise } from "@/context/user-enterprise.context";
import { api } from "@/service/api";
import * as currencies from 'currency-codes';
import { getNameList } from 'country-list';
import { Loader2, Search } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";

type Tag = {
  id: string;
  name?: string;
  title?: string;
  type?: "HARD_SKILL" | "SOFT_SKILL" | string;
  label?: string;
};

interface ModalCreateJobProps {
  onSuccess?: () => void;
}

function capitalize(str: string): string {
  if (!str) return str;
  return str.charAt(0).toUpperCase() + str.slice(1);
}

const getTagName = (t?: Tag) => t?.name ?? t?.title ?? t?.label ?? "—";

type SalaryType = "FIXED" | "RANGE" | "COMBINE";

export function ModalCreateJob({ onSuccess }: ModalCreateJobProps) { // 2. Receba a prop
  const { userEnterprise } = UseUserEnteprise();
  const [isOpen, setIsOpen] = useState(false);
  const [hardSkillSearch, setHardSkillSearch] = useState("");
  const [softSkillSearch, setSoftSkillSearch] = useState("");
  const [salaryType, setSalaryType] = useState<SalaryType>("FIXED"); // Padrão é Salário Fixo
  const { error, form, isError, isPending, onSubmit } = useCreateJob(
    (isOpen) => setIsOpen(isOpen),
    onSuccess
  );
  const allCurrencies = currencies.data;
  const allCountries = useMemo(() => {
    return Object.entries(getNameList()).map(([code, name]) => ({
      code: capitalize(code),
      name: name as string,
    }));
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = form;

  const isUserLoaded = userEnterprise !== null;
  const canCreate = userEnterprise?.canCreateJobOpenings ?? false;

  const selectedTagIds = watch("tagIds") ?? [];

  const { data: tags, isLoading: loadingTags } = useQuery<Tag[]>({
    queryKey: ["tags"],
    queryFn: async () => {
      const { data } = await api.get("/tag");
      return data as Tag[];
    },
  });

  const selectedIdSet = useMemo(() => new Set(selectedTagIds), [selectedTagIds]);

  // 2. FILTRAMOS as tags para a UI
  const hardSkills = useMemo(() => {
    const allHardSkills = tags?.filter(t => t.type === "HARD_SKILL") ?? [];
    if (!hardSkillSearch) return allHardSkills;
    return allHardSkills.filter(t =>
      getTagName(t).toLowerCase().includes(hardSkillSearch.toLowerCase())
    );
  }, [tags, hardSkillSearch]);

  const softSkills = useMemo(() => {
    const allSoftSkills = tags?.filter(t => t.type === "SOFT_SKILL") ?? [];
    if (!softSkillSearch) return allSoftSkills;
    return allSoftSkills.filter(t =>
      getTagName(t).toLowerCase().includes(softSkillSearch.toLowerCase())
    );
  }, [tags, softSkillSearch]);

  // 3. LÓGICA DE 'onChange' ATUALIZADA
  //    Esta função agora junta as seleções das DUAS caixas
  const handleTagChange = (tagId: string, isChecked: boolean) => {
    const currentIds = new Set(selectedIdSet); // Copia o Set atual
    if (isChecked) {
      currentIds.add(tagId); // Adiciona
    } else {
      currentIds.delete(tagId); // Remove
    }
    // Atualiza o formulário com o novo array
    setValue("tagIds", Array.from(currentIds), { shouldValidate: true, shouldDirty: true });
  };

  // CÓDIGO CORRIGIDO
  const removeTag = (id: string) =>
    setValue(
      "tagIds",
      (selectedTagIds as string[]).filter((x) => x !== id), // <-- Corrigido
      { shouldValidate: true, shouldDirty: true }
    );

  const clearTags = () =>
    setValue("tagIds", [], { shouldValidate: true, shouldDirty: true });

  const handleSalaryTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newType = e.target.value as SalaryType;
    setSalaryType(newType);

    // Limpa os campos do formulário que NÃO serão usados
    // para garantir que o backend receba 'null'
    if (newType === 'FIXED') {
      // Limpa os campos de faixa
      setValue('salaryRangeStart', undefined);
      setValue('salaryRangeEnd', undefined);
    } else if (newType === 'RANGE') {
      // Limpa o salário fixo
      setValue('salary', undefined);
    } else { // 'COMBINE'
      // Limpa todos os campos de salário
      setValue('salary', undefined);
      setValue('salaryRangeStart', undefined);
      setValue('salaryRangeEnd', undefined);
    }
  };

  return (
    <div className="flex items-center gap-4">
      {isUserLoaded && !canCreate && (
        <p className="text-sm text-red-600 font-medium">
          Você atingiu o limite de vagas criadas para o plano atual.
        </p>
      )}
      <Modal
        className="p-2 bg-blue-600 text-white rounded-md w-[160px] font-medium cursor-pointer hover:bg-blue-700 transition disabled:bg-gray-400 disabled:opacity-70 disabled:cursor-not-allowed"
        headerTitle="Crie uma nova vaga"
        title="Nova Vaga"
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        disabled={!canCreate}
        footer={
          <div className="flex justify-end w-full">
            <Button
              form="create-job-form"
              className="bg-blue-600 hover:bg-blue-700 w-full md:w-auto"
              type="submit"
              disabled={isPending}
            >
              {isPending ? "Criando..." : "Criar vaga"}
            </Button>
          </div>
        }
      >
        <form
          id="create-job-form"
          className="flex flex-col gap-6"
        >
          {isError && (
            <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md p-2">
              {(error as any)?.message ?? "Erro ao criar vaga."}
            </div>
          )}

          {/* --- SEÇÃO 1: INFORMAÇÕES PRINCIPAIS --- */}
          <fieldset className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1 md:col-span-2"> {/* Título ocupa 2 colunas */}
              <Label>Título da vaga</Label>
              <Input
                placeholder="Ex.: Desenvolvedor(a) Front-end Pleno"
                className="border-neutral-300"
                {...register("title")}
                aria-invalid={!!errors.title}
              />
              {errors.title && (<span className="text-sm text-red-600">{errors.title.message as string}</span>)}
            </div>
          </fieldset>

          {/* --- SEÇÃO 2: LOCALIZAÇÃO E MODELO --- */}
          <fieldset className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <legend className="text-sm font-medium text-neutral-600 mb-2">Localização e Modelo</legend>
            <div className="flex flex-col gap-1">
              <Label>Modelo de trabalho</Label>
              <select
                {...register("workModel")}
                className="border border-neutral-300 w-full p-2 rounded-md bg-white"
                defaultValue=""
                aria-invalid={!!errors.workModel}
              >
                <option value="" disabled>Selecione uma opção</option>
                <option value="HYBRID">Híbrido</option>
                <option value="ON_SITE">Presencial</option>
                <option value="REMOTE">Home Office</option>
              </select>
              {errors.workModel && (<span className="text-sm text-red-600">{errors.workModel.message as string}</span>)}
            </div>
            <div className="flex flex-col gap-1">
              <Label>País</Label>
              <select
                className="border border-neutral-400 p-2 rounded-md" // Aumentei o padding
                {...register("country")}
                defaultValue="Brasil" // Mudei para "Brasil"
                aria-invalid={!!errors.country}
              >
                <option value="" disabled>Selecione um país</option>
                {allCountries.map((country) => (
                  <option key={country.name} value={country.name}>
                    {country.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex flex-col gap-1">
              <Label>Estado</Label>
              <Input
                placeholder="Ex.: SP"
                className="border-neutral-300"
                {...register("state")}
                aria-invalid={!!errors.state}
              />
              {errors.state && (<span className="text-sm text-red-600">{errors.state.message as string}</span>)}
            </div>
            <div className="flex flex-col gap-1 md:col-span-2"> {/* Cidade ocupa 2 colunas */}
              <Label>Cidade</Label>
              <Input
                placeholder="Ex.: Campinas"
                className="border-neutral-300"
                {...register("city")}
                aria-invalid={!!errors.city}
              />
              {errors.city && (<span className="text-sm text-red-600">{errors.city.message as string}</span>)}
            </div>
          </fieldset>

          {/* --- SEÇÃO 3: CONTRATO E CARGA HORÁRIA --- */}
          <fieldset className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <legend className="text-sm font-medium text-neutral-600 mb-2">Contrato e Horário</legend>
            <div className="flex flex-col gap-1 md:col-span-2">
              <Label>Tipo de contrato</Label>
              <select
                {...register("contractType")}
                className="border border-neutral-300 w-full p-2 rounded-md bg-white"
                defaultValue=""
                aria-invalid={!!errors.contractType}
              >
                <option value="" disabled>Selecione o contrato</option>
                <option value="CLT">CLT (Efetivo)</option>
                <option value="PJ">Pessoa Jurídica (PJ)</option>
                <option value="FIXED_TERM">Prazo Determinado (Temporário)</option>
                <option value="INTERNSHIP">Estágio</option>
                <option value="COOPERATIVE">Cooperado</option>
                <option value="OTHER">Outro</option>
              </select>
              {errors.contractType && (<span className="text-sm text-red-600">{errors.contractType.message as string}</span>)}
            </div>
            <div className="flex flex-col gap-1 md:col-span-2">
              <Label>Período de trabalho</Label>
              <select
                {...register("workPeriod")}
                className="border border-neutral-300 w-full p-2 rounded-md bg-white"
                defaultValue=""
                aria-invalid={!!errors.workPeriod}
              >
                <option value="" disabled>Selecione o período</option>
                <option value="FULL_TIME">Período Integral</option>
                <option value="PART_TIME">Meio Período</option>
                <option value="INTERNSHIP">Estágio</option>
                <option value="FLEXIBLE">Flexível</option>
                <option value="SHIFT_WORK">Turno / Escala</option>
                <option value="NIGHT_SHIFT">Noturno</option>
                <option value="TO_BE_DEFINED">A Combinar</option>
              </select>
              {errors.workPeriod && (<span className="text-sm text-red-600">{errors.workPeriod.message as string}</span>)}
            </div>
            <div className="flex flex-col gap-1 md:col-span-2">
              <Label>Início do expediente</Label>
              <Input
                type="time"
                className="border-neutral-300"
                {...register("workStartTime")}
                aria-invalid={!!errors.workStartTime}
              />
              {errors.workStartTime && (<span className="text-sm text-red-600">{errors.workStartTime.message as string}</span>)}
            </div>
            <div className="flex flex-col gap-1 md:col-span-2">
              <Label>Fim do expediente</Label>
              <Input
                type="time"
                className="border-neutral-300"
                {...register("workEndTime")}
                aria-invalid={!!errors.workEndTime}
              />
              {errors.workEndTime && (<span className="text-sm text-red-600">{errors.workEndTime.message as string}</span>)}
            </div>
          </fieldset>

          {/* --- SEÇÃO 4: REMUNERAÇÃO --- */}
          <fieldset className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border border-neutral-200 rounded-lg">
            <legend className="text-sm font-medium text-neutral-600 mb-2 px-1">Remuneração</legend>
            <div className="flex flex-col gap-1 md:col-span-2">
              <Label>Formato</Label>
              <select
                value={salaryType}
                onChange={handleSalaryTypeChange}
                className="border border-neutral-300 w-full p-2 rounded-md bg-white"
              >
                <option value="FIXED">Salário Fixo</option>
                <option value="RANGE">Faixa Salarial</option>
                <option value="COMBINE">A combinar</option>
              </select>
            </div>

            {/* Renderização Condicional de Salário (como antes) */}
            {salaryType !== 'COMBINE' && (
              <div className="flex flex-col gap-1 md:col-span-2">
                <Label>Moeda</Label>
                <select
                  {...register("currencyCode")}
                  className="border border-neutral-300 rounded-md p-2" // Aumentei padding
                  defaultValue="BRL"
                  aria-invalid={!!errors.currencyCode}
                >
                  {allCurrencies.map((currency) => (
                    <option key={currency.code} value={currency.code}>
                      {currency.code} - {currency.currency}
                    </option>
                  ))}
                </select>
                {errors.currencyCode && (<span className="text-sm text-red-600">{errors.currencyCode.message as string}</span>)}
              </div>
            )}

            {salaryType === 'FIXED' && (
              <div className="flex flex-col gap-1 md:col-span-2"> {/* Fixo ocupa 2 colunas */}
                <Label>Salário Fixo</Label>
                <Input
                  type="number" step="0.01" min={0}
                  placeholder="Ex.: 5000.00"
                  className="border-neutral-300"
                  {...register("salary", {
                    valueAsNumber: true,
                    required: salaryType === 'FIXED' ? 'Salário é obrigatório' : false
                  })}
                  aria-invalid={!!errors.salary}
                />
                {errors.salary && (<span className="text-sm text-red-600">{errors.salary.message as string}</span>)}
              </div>
            )}

            {salaryType === 'RANGE' && (
              <>
                <div className="flex flex-col gap-1">
                  <Label>Salário Inicial</Label>
                  <Input
                    type="number" step="0.01" min={0}
                    placeholder="Ex.: 4000.00"
                    className="border-neutral-300"
                    {...register("salaryRangeStart", {
                      valueAsNumber: true,
                      required: salaryType === 'RANGE' ? 'Salário inicial é obrigatório' : false
                    })}
                    aria-invalid={!!errors.salaryRangeStart}
                  />
                  {errors.salaryRangeStart && (<span className="text-sm text-red-600">{errors.salaryRangeStart.message as string}</span>)}
                </div>
                <div className="flex flex-col gap-1">
                  <Label>Salário Final</Label>
                  <Input
                    type="number" step="0.01" min={0}
                    placeholder="Ex.: 6000.00"
                    className="border-neutral-300"
                    {...register("salaryRangeEnd", {
                      valueAsNumber: true,
                      required: salaryType === 'RANGE' ? 'Salário final é obrigatório' : false
                    })}
                    aria-invalid={!!errors.salaryRangeEnd}
                  />
                  {errors.salaryRangeEnd && (<span className="text-sm text-red-600">{errors.salaryRangeEnd.message as string}</span>)}
                </div>
              </>
            )}

            {salaryType === 'COMBINE' && (
              <p className="text-sm text-neutral-500 md:col-span-2">
                O salário será exibido como "A combinar".
              </p>
            )}
          </fieldset>

          {/* --- SEÇÃO 5: HABILIDADES --- */}
          <fieldset className="grid grid-cols-1 md:grid-cols-2 gap-4">

            {/* Coluna 1: Hard Skills */}
            <div className="flex flex-col gap-2">
              <Label>Hard Skills</Label>
              <div className="relative">
                <Input
                  placeholder="Pesquisar..."
                  value={hardSkillSearch}
                  onChange={(e) => setHardSkillSearch(e.target.value)}
                  className="pl-9 h-9 text-sm"
                />
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
              </div>

              {/* CORREÇÃO: Container relativo com altura fixa protege o layout */}
              <div className="h-32 w-full relative">
                <ScrollArea className="h-full w-full border border-neutral-300 rounded-md bg-white">
                  <div className="p-2">
                    {loadingTags && (
                      <div className="flex items-center justify-center py-4">
                        <Loader2 className="h-5 w-5 animate-spin text-neutral-400" />
                      </div>
                    )}
                    {!loadingTags && hardSkills.length === 0 && (
                      <p className="text-xs text-neutral-500 text-center py-2">
                        {hardSkillSearch ? 'Nada encontrado' : 'Vazio'}
                      </p>
                    )}
                    <div className="space-y-2">
                      {hardSkills.map((t) => (
                        <div key={t.id} className="flex items-center justify-between">
                          <Label htmlFor={`hard-${t.id}`} className="text-sm font-normal cursor-pointer truncate pr-2">
                            {getTagName(t)}
                          </Label>
                          <Checkbox
                            id={`hard-${t.id}`}
                            checked={selectedIdSet.has(t.id)}
                            onCheckedChange={(isChecked) => handleTagChange(t.id, isChecked as boolean)}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </ScrollArea>
              </div>
            </div>

            {/* Coluna 2: Soft Skills */}
            <div className="flex flex-col gap-2">
              <Label>Soft Skills</Label>
              <div className="relative">
                <Input
                  placeholder="Pesquisar..."
                  value={softSkillSearch}
                  onChange={(e) => setSoftSkillSearch(e.target.value)}
                  className="pl-9 h-9 text-sm"
                />
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
              </div>

              {/* CORREÇÃO: Container relativo com altura fixa */}
              <div className="h-32 w-full relative">
                <ScrollArea className="h-full w-full border border-neutral-300 rounded-md bg-white">
                  <div className="p-2">
                    {loadingTags && (
                      <div className="flex items-center justify-center py-4">
                        <Loader2 className="h-5 w-5 animate-spin text-neutral-400" />
                      </div>
                    )}
                    {!loadingTags && softSkills.length === 0 && (
                      <p className="text-xs text-neutral-500 text-center py-2">
                        {softSkillSearch ? 'Nada encontrado' : 'Vazio'}
                      </p>
                    )}
                    <div className="space-y-2">
                      {softSkills.map((t) => (
                        <div key={t.id} className="flex items-center justify-between">
                          <Label htmlFor={`soft-${t.id}`} className="text-sm font-normal cursor-pointer truncate pr-2">
                            {getTagName(t)}
                          </Label>
                          <Checkbox
                            id={`soft-${t.id}`}
                            checked={selectedIdSet.has(t.id)}
                            onCheckedChange={(isChecked) => handleTagChange(t.id, isChecked as boolean)}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </ScrollArea>
              </div>
            </div>
          </fieldset>

          {/* A exibição das "pills" de tags (já funciona) */}
          {selectedTagIds.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-1">
              {selectedTagIds.map((id: string) => {
                const tag = (tags ?? []).find((t) => t.id === id);
                return (
                  <span key={id} /* ... */ >
                    {getTagName(tag)}
                    <button type="button" onClick={() => removeTag(id)} /* ... */ >×</button>
                  </span>
                );
              })}
              <button type="button" onClick={clearTags} /* ... */ >Limpar tudo</button>
            </div>
          )}
          
          <div className="flex flex-col gap-1">
            <Label>Descrição</Label>
            <textarea
              rows={5}
              placeholder="Fale sobre as responsabilidades, requisitos e benefícios…"
              className="border-neutral-300 border p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-200"
              {...register("description")}
              aria-invalid={!!errors.description}
            />
            {errors.description && (
              <span className="text-sm text-red-600">
                {errors.description.message as string}
              </span>
            )}
          </div>

          {/* enterpriseId (hidden) */}
          <input
            type="hidden"
            value={userEnterprise?.enterpriseId ?? ""}
            {...register("enterpriseId")}
          />
          {errors.enterpriseId && (
            <span className="text-sm text-red-600">
              {errors.enterpriseId.message as string}
            </span>
          )}
        </form>
      </Modal>
    </div>
  );
}
