"use client";

import { useEffect, useMemo, useState } from "react";
import { Modal } from "../modal";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useCreateJob } from "@/hooks/forms/create-job";

export function ModalCreateJob() {
  const { error, form, isError, isPending, onSubmit } = useCreateJob();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = form;

  return (
    <div>
      <Modal
        className="p-2 bg-blue-600 text-white rounded-md w-[160px] font-medium cursor-pointer hover:bg-blue-700 transition"
        headerTitle="Crie uma nova vaga"
        title="Nova Vaga"
      >
        <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
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
              <select className="border border-neutral-400 p-1 rounded-md" {...register("country")}>
                <option value="" disabled>Selecione um país</option>
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
              />
              {errors.city && (
                <span className="text-sm text-red-600">
                  {errors.city.message as string}
                </span>
              )}
            </div>
            <select {...register("currencyCode")}>
              <option value="" disabled >Selecione a moeda</option>
              <option value="BRL">R$</option>
            </select>
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
                />
              </div>
              {errors.salary && (
                <span className="text-sm text-red-600">
                  {errors.salary.message as string}
                </span>
              )}
            </div>
          </div>

          {/* Descrição (linha inteira) */}
          <div className="flex flex-col gap-1">
            <Label>Descrição</Label>
            <textarea
              rows={5}
              placeholder="Fale sobre as responsabilidades, requisitos e benefícios…"
              className="border-neutral-300 border p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-200"
              {...register("description")}
            />
            {errors.description && (
              <span className="text-sm text-red-600">
                {errors.description.message as string}
              </span>
            )}
          </div>

          <div>
            <Label>Horário de trabalho</Label>
            <Input className="border-neutral-300 pl-8" />
            {/* <textarea
              rows={5}
              placeholder="Fale sobre as responsabilidades, requisitos e benefícios…"
              className="border-neutral-300 border p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-200"
              {...register("description")}
            />
            {errors.description && (
              <span className="text-sm text-red-600">
                {errors.description.message as string}
              </span>
            )} */}
          </div>
          {/* <input type="hidden" {...register("enterpriseId")} /> */}

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
