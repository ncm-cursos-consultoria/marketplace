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

export function ModalCreateJob({ onSuccess }: ModalCreateJobProps) { // 2. Receba a prop
  const { userEnterprise } = UseUserEnteprise();
  const [isOpen, setIsOpen] = useState(false);
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

  const selectedTagIds = watch("tagIds") ?? [];

  const { data: tags, isLoading: loadingTags } = useQuery<Tag[]>({
    queryKey: ["tags"],
    queryFn: async () => {
      const { data } = await api.get("/tag");
      return data as Tag[];
    },
  });

  // 2. FILTRAMOS as tags para a UI
  const hardSkills = useMemo(() =>
    tags?.filter(t => t.type === "HARD_SKILL") ?? [],
    [tags]);

  const softSkills = useMemo(() =>
    tags?.filter(t => t.type === "SOFT_SKILL") ?? [],
    [tags]);

  const getTagName = (t?: Tag) => t?.name ?? t?.title ?? t?.label ?? "—";

  // 3. LÓGICA DE 'onChange' ATUALIZADA
  //    Esta função agora junta as seleções das DUAS caixas
  const onChangeTags = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const fieldName = event.target.name; // "hardSkillSelect" ou "softSkillSelect"
    const selectedOptions = Array.from(event.target.selectedOptions).map((o) => o.value);

    // Pega os valores da *outra* caixa que não está sendo mudada
    const otherValues = (fieldName === 'hardSkillSelect')
      ? softSkills.map(t => t.id).filter(id => selectedTagIds.includes(id))
      : hardSkills.map(t => t.id).filter(id => selectedTagIds.includes(id));

    // Junta as seleções novas + seleções antigas da outra caixa
    setValue("tagIds", [...selectedOptions, ...otherValues], { shouldValidate: true, shouldDirty: true });
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

  return (
    <div>
      <Modal
        className="p-2 bg-blue-600 text-white rounded-md w-[160px] font-medium cursor-pointer hover:bg-blue-700 transition"
        headerTitle="Crie uma nova vaga"
        title="Nova Vaga"
        isOpen={isOpen}
        setIsOpen={setIsOpen}
      >
        <form
          className="flex flex-col gap-4 overflow-auto h-[70vh] p-2"
          onSubmit={handleSubmit(onSubmit)}
        >
          {isError && (
            <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md p-2">
              {(error as any)?.message ?? "Erro ao criar vaga."}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <Label>Título da vaga</Label>
              <Input
                placeholder="Ex.: Desenvolvedor(a) Front-end Pleno"
                className="border-neutral-300"
                {...register("title")}
                aria-invalid={!!errors.title}
              />
              {errors.title && (
                <span className="text-sm text-red-600">
                  {errors.title.message as string}
                </span>
              )}
            </div>

            <div className="flex flex-col gap-1">
              <Label>Modelo de trabalho</Label>
              <select
                {...register("workModel")}
                className="border border-neutral-300 w-full p-2 rounded-md bg-white"
                defaultValue=""
                aria-invalid={!!errors.workModel}
              >
                <option value="" disabled>
                  Selecione uma opção
                </option>
                <option value="HYBRID">Híbrido</option>
                <option value="ON_SITE">Presencial</option>
                <option value="REMOTE">Home Office</option>
              </select>
              {errors.workModel && (
                <span className="text-sm text-red-600">
                  {errors.workModel.message as string}
                </span>
              )}
            </div>

            <div className="flex flex-col gap-1">
              <Label>País</Label>
              <select
                className="border border-neutral-400 p-1 rounded-md"
                {...register("country")}
                defaultValue="BR"
                aria-invalid={!!errors.country}
              >
                <option value="" disabled>Selecione um país</option>
                {allCountries.map((country) => (
                  <option key={country.name} value={country.name}>
                    {country.name} - {country.code}
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
              {errors.state && (
                <span className="text-sm text-red-600">
                  {errors.state.message as string}
                </span>
              )}
            </div>

            <div className="flex flex-col gap-1">
              <Label>Cidade</Label>
              <Input
                placeholder="Ex.: Campinas"
                className="border-neutral-300"
                {...register("city")}
                aria-invalid={!!errors.city}
              />
              {errors.city && (
                <span className="text-sm text-red-600">
                  {errors.city.message as string}
                </span>
              )}
            </div>

            <div className="flex flex-col gap-1">
              <Label>Moeda</Label>
              <select
                {...register("currencyCode")}
                className="border border-neutral-300 rounded-md p-1"
                defaultValue="BRL" // 3. Define BRL como padrão
                aria-invalid={!!errors.currencyCode}
              >
                <option value="" disabled>Selecione a moeda</option>

                {/* 4. GERE AS OPÇÕES DINAMICAMENTE */}
                {allCurrencies.map((currency) => (
                  <option key={currency.code} value={currency.code}>
                    {currency.code} - {currency.currency}
                  </option>
                ))}
              </select>
              {errors.currencyCode && (
                <span className="text-sm text-red-600">
                  {errors.currencyCode.message as string}
                </span>
              )}
            </div>

            <div className="flex flex-col gap-1">
              <Label>Salário</Label>
              <div className="relative">
                <Input
                  type="number"
                  step="0.01"
                  min={0}
                  placeholder="Ex.: 5000.00"
                  className="border-neutral-300 pl-8"
                  {...register("salary", { valueAsNumber: true })}
                  aria-invalid={!!errors.salary}
                />
              </div>
              {errors.salary && (
                <span className="text-sm text-red-600">
                  {errors.salary.message as string}
                </span>
              )}
            </div>

            <div className="flex flex-col gap-1">
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
              {errors.workPeriod && (
                <span className="text-sm text-red-600">
                  {errors.workPeriod.message as string}
                </span>
              )}
            </div>

            <div className="flex flex-col gap-1">
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
              {errors.contractType && (
                <span className="text-sm text-red-600">
                  {errors.contractType.message as string}
                </span>
              )}
            </div>

            <div className="flex flex-col gap-1">
              <Label>Início do expediente</Label>
              <Input
                type="time"
                className="border-neutral-300"
                {...register("workStartTime")}
                aria-invalid={!!errors.workStartTime}
              />
              {errors.workStartTime && (
                <span className="text-sm text-red-600">
                  {errors.workStartTime.message as string}
                </span>
              )}
            </div>
            <div className="flex flex-col gap-1">
              <Label>Fim do expediente</Label>
              <Input
                type="time"
                className="border-neutral-300"
                {...register("workEndTime")}
                aria-invalid={!!errors.workEndTime}
              />
              {errors.workEndTime && (
                <span className="text-sm text-red-600">
                  {errors.workEndTime.message as string}
                </span>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Label>Hard Skills</Label>
            <select
              multiple
              name="hardSkillSelect" // Damos um nome para identificar
              // 4. O 'value' é filtrado para mostrar apenas Hard Skills selecionadas
              value={selectedTagIds.filter(id => hardSkills.some(t => t.id === id))}
              onChange={onChangeTags}
              className="border border-neutral-300 rounded-md p-2 bg-white h-32"
              disabled={loadingTags}
            >
              {loadingTags ? <option>Carregando…</option> :
                hardSkills.map((t) => (
                  <option key={t.id} value={t.id}>{getTagName(t)}</option>
                ))}
            </select>
            {/* Você pode adicionar 'errors.tagIds' aqui se necessário */}
          </div>

          <div className="flex flex-col gap-2">
            <Label>Soft Skills</Label>
            <select
              multiple
              name="softSkillSelect" // Damos um nome para identificar
              // 4. O 'value' é filtrado para mostrar apenas Soft Skills selecionadas
              value={selectedTagIds.filter(id => softSkills.some(t => t.id === id))}
              onChange={onChangeTags}
              className="border border-neutral-300 rounded-md p-2 bg-white h-32"
              disabled={loadingTags}
            >
              {loadingTags ? <option>Carregando…</option> :
                softSkills.map((t) => (
                  <option key={t.id} value={t.id}>{getTagName(t)}</option>
                ))}
            </select>
          </div>

          <p className="text-xs text-neutral-500">
            Segure <kbd>Ctrl</kbd>/<kbd>Cmd</kbd> para selecionar várias opções em ambas as caixas.
          </p>

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

          <Button
            className="bg-blue-600 hover:bg-blue-700 cursor-pointer rounded-md h-10"
            type="submit"
            disabled={isPending}
          >
            {isPending ? "Criando..." : "Criar vaga"}
          </Button>
        </form>
      </Modal>
    </div>
  );
}
