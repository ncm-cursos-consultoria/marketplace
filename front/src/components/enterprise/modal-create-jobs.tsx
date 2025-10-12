"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Modal } from "../modal";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useCreateJob } from "@/hooks/forms/create-job";
import { UseUserEnteprise } from "@/context/user-enterprise.context";
import { api } from "@/service/api";

type Tag = {
  id: string;
  name?: string;     // esperado
  title?: string;    // fallback
  label?: string;    // fallback
};

export function ModalCreateJob() {
  const { error, form, isError, isPending, onSubmit } = useCreateJob();
  const { userEnterprise } = UseUserEnteprise();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue, // usado para converter thirdParty para boolean
    watch,
  } = form;

  // ------------------------------
  // Tags (skills) vindas do backend
  // ------------------------------
  const { data: tags, isLoading: loadingTags } = useQuery<Tag[]>({
    queryKey: ["tags"],
    queryFn: async () => {
      const { data } = await api.get("/tag"); // GET /tag
      return data as Tag[];
    },
    staleTime: 1000 * 60 * 5,
  });

  // seleção local (não vai no submit; só UI)
  const [selectedTagIds, setSelectedTagIds] = useState<string[]>([]);

  const onChangeTags: React.ChangeEventHandler<HTMLSelectElement> = (e) => {
    const values = Array.from(e.target.selectedOptions).map((o) => o.value);
    setSelectedTagIds(values);
  };

  const removeTag = (id: string) =>
    setSelectedTagIds((prev) => prev.filter((x) => x !== id));

  const clearTags = () => setSelectedTagIds([]);

  const getTagName = (t?: Tag) => t?.name ?? t?.title ?? t?.label ?? "—";

  return (
    <div>
      <Modal
        className="p-2 bg-blue-600 text-white rounded-md w-[160px] font-medium cursor-pointer hover:bg-blue-700 transition"
        headerTitle="Crie uma nova vaga"
        title="Nova Vaga"
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
            {/* Título */}
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

            {/* Modelo de trabalho */}
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

            {/* País */}
            <div className="flex flex-col gap-1">
              <Label>País</Label>
              <select
                className="border border-neutral-400 p-1 rounded-md"
                {...register("country")}
                defaultValue=""
                aria-invalid={!!errors.country}
              >
                <option value="" disabled>
                  Selecione um país
                </option>
                <option value="BR">Brasil</option>
              </select>
              {errors.country && (
                <span className="text-sm text-red-600">
                  {errors.country.message as string}
                </span>
              )}
            </div>

            {/* Estado */}
            <div className="flex flex-col gap-1">
              <Label>Estado</Label>
              <Input
                placeholder="Ex.: São Paulo"
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

            {/* Cidade */}
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

            {/* Moeda */}
            <div className="flex flex-col gap-1">
              <Label>Moeda</Label>
              <select
                {...register("currencyCode")}
                className="border border-neutral-300 rounded-md p-1"
                defaultValue=""
                aria-invalid={!!errors.currencyCode}
              >
                <option value="" disabled>
                  Selecione a moeda
                </option>
                <option value="BRL">R$</option>
              </select>
              {errors.currencyCode && (
                <span className="text-sm text-red-600">
                  {errors.currencyCode.message as string}
                </span>
              )}
            </div>

            {/* Salário */}
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

            {/* Período de trabalho */}
            <div className="flex flex-col gap-1">
              <Label>Período de trabalho</Label>
              <select
                {...register("workPeriod")}
                className="border border-neutral-300 w-full p-2 rounded-md bg-white"
                defaultValue=""
                aria-invalid={!!errors.workPeriod}
              >
                <option value="" disabled>Selecione o período</option>
                <option value="FULL_TIME">Tempo integral (Full-time)</option>
                <option value="PART_TIME">Meio período (Part-time)</option>
              </select>
              {errors.workPeriod && (
                <span className="text-sm text-red-600">
                  {errors.workPeriod.message as string}
                </span>
              )}
            </div>

            {/* Tipo de contrato */}
            <div className="flex flex-col gap-1">
              <Label>Tipo de contrato</Label>
              <Input
                placeholder="Ex.: CLT, PJ"
                className="border-neutral-300"
                {...register("contractType")}
                aria-invalid={!!errors.contractType}
              />
              {errors.contractType && (
                <span className="text-sm text-red-600">
                  {errors.contractType.message as string}
                </span>
              )}
            </div>

            {/* Terceiro (converte string -> boolean p/ bater com z.boolean)
            <div className="flex flex-col gap-1">
              <Label>Vaga de terceiro?</Label>
              <select
                className="border border-neutral-300 w-full p-2 rounded-md bg-white"
                defaultValue={false}
                onChange={(e) => setValue("thirdParty", e.target.value === "true")}
                aria-invalid={!!errors.thirdParty}
              >
                <option value="fals">Não</option>
                <option value="true">Sim</option>
              </select>
              {errors.thirdParty && (
                <span className="text-sm text-red-600">
                  {errors.thirdParty.message as string}
                </span>
              )}
            </div> */}

            {/* Horários */}
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

          {/* Hard skills (via GET /tag) – UI estática */}
          <div className="flex flex-col gap-2">
            <Label>Hard skills (tags)</Label>
            <select
              multiple
              value={selectedTagIds}
              onChange={onChangeTags}
              className="border border-neutral-300 rounded-md p-2 bg-white h-40"
              disabled={loadingTags}
            >
              {loadingTags ? (
                <option>Carregando…</option>
              ) : (tags ?? []).map((t) => (
                <option key={t.id} value={t.id}>
                  {getTagName(t)}
                </option>
              ))}
            </select>
            <p className="text-xs text-neutral-500">
              Segure <kbd>Ctrl</kbd>/<kbd>Cmd</kbd> para selecionar várias opções. (Seleção não enviada — apenas UI)
            </p>

            {selectedTagIds.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-1">
                {selectedTagIds.map((id) => {
                  const tag = (tags ?? []).find((t) => t.id === id);
                  return (
                    <span
                      key={id}
                      className="inline-flex items-center gap-1 rounded-full border border-neutral-300 bg-neutral-50 px-3 py-1 text-sm"
                    >
                      {getTagName(tag)}
                      <button
                        type="button"
                        aria-label={`Remover ${getTagName(tag)}`}
                        className="ml-1 text-neutral-500 hover:text-neutral-700"
                        onClick={() => removeTag(id)}
                      >
                        ×
                      </button>
                    </span>
                  );
                })}
                <button
                  type="button"
                  className="text-xs underline text-blue-600 hover:text-blue-700"
                  onClick={clearTags}
                >
                  Limpar tudo
                </button>
              </div>
            )}
          </div>

          {/* Descrição */}
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
