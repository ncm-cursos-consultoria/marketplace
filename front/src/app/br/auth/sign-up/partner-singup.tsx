"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useCreatePartner } from "@/hooks/forms/create-partner";
import { Modal } from "@/components/modal";
import { PartnerTermsOfUse } from "@/components/partner/partner-terms-of-use";

export function PartnerSignUp() {
  const { form, isPending, onSubmit } = useCreatePartner();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = form;

  return (
    <div>
      <form
        className="flex flex-col gap-6 lg:w-[500px]"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="flex flex-col gap-4">
          {/* Razão social / Nome fantasia */}
          <div className="w-full flex flex-col md:flex-row gap-4">
            <div className="flex-1 min-w-0">
              <Label htmlFor="legalName">Razão social</Label>
              <Input
                id="legalName"
                className="border border-neutral-300 w-full"
                placeholder="Digite a razão social"
                aria-invalid={!!errors.legalName}
                {...register("legalName")}
              />
              {errors.legalName && (
                <span className="text-sm text-red-600">
                  {errors.legalName.message as string}
                </span>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <Label htmlFor="tradeName">Nome fantasia</Label>
              <Input
                id="tradeName"
                className="border border-neutral-300 w-full"
                placeholder="Digite o nome fantasia"
                aria-invalid={!!errors.tradeName}
                {...register("tradeName")}
              />
              {errors.tradeName && (
                <span className="text-sm text-red-600">
                  {errors.tradeName.message as string}
                </span>
              )}
            </div>
          </div>

          {/* CNPJ */}
          <div className="flex flex-col gap-1">
            <Label htmlFor="cnpj">CNPJ</Label>
            <Input
              id="cnpj"
              className="border border-neutral-300"
              placeholder="Digite o CNPJ"
              type="text"
              inputMode="numeric"
              aria-invalid={!!errors.cnpj}
              {...register("cnpj")}
            />
            {errors.cnpj && (
              <span className="text-sm text-red-600">
                {errors.cnpj.message as string}
              </span>
            )}
          </div>

          {/* Email / Senha */}
          <div className="w-full flex flex-col md:flex-row gap-4">
            <div className="flex-1 min-w-0">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                className="border border-neutral-300 w-full"
                placeholder="Digite o email corporativo"
                aria-invalid={!!errors.email}
                {...register("email")}
              />
              {errors.email && (
                <span className="text-sm text-red-600">
                  {errors.email.message as string}
                </span>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                type="password"
                className="border border-neutral-300 w-full"
                placeholder="Crie uma senha"
                aria-invalid={!!errors.password}
                {...register("password")}
              />
              {errors.password && (
                <span className="text-sm text-red-600">
                  {errors.password.message as string}
                </span>
              )}
            </div>
          </div>

          {/* Datas como STRING (sem validação/transform) */}
          <div className="w-full flex flex-col md:flex-row gap-4">
            <div className="flex-1 min-w-0">
              <Label htmlFor="birthday">Data de abertura</Label>
              <Input
                id="birthday"
                type="date" // mantém date no UI, mas RHF enviará STRING (YYYY-MM-DD)
                className="border border-neutral-300 w-full"
                aria-invalid={!!errors.birthday}
                {...register("birthday")} // sem valueAsDate
              />
              {errors.birthday && (
                <span className="text-sm text-red-600">
                  {errors.birthday.message as string}
                </span>
              )}
            </div>
          </div>

          {/* Subsídio */}
          <div className="w-full flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <input
                id="isSubsidized"
                type="checkbox"
                className="h-4 w-4"
                aria-invalid={!!errors.isSubsidized}
                {...register("isSubsidized")}
              />
              <Label htmlFor="isSubsidized" className="cursor-pointer">
                Conta com subsídio/benefício ativo
              </Label>
            </div>
            {errors.isSubsidized && (
              <span className="text-sm text-red-600">
                {errors.isSubsidized.message as string}
              </span>
            )}

            <div className="flex-1 min-w-0">
              <Label htmlFor="subsidizedEndDate">Término do subsídio</Label>
              <Input
                id="subsidizedEndDate"
                type="date" // UI de data, mas envia STRING
                className="border border-neutral-300 w-full"
                aria-invalid={!!errors.subsidizedEndDate}
                {...register("subsidizedEndDate")} // sem valueAsDate
              />
              {errors.subsidizedEndDate && (
                <span className="text-sm text-red-600">
                  {errors.subsidizedEndDate.message as string}
                </span>
              )}
              <span className="text-xs text-neutral-500">
                Enviaremos a data como string (YYYY-MM-DD).
              </span>
            </div>
          </div>
        </div>

        {/* Ações */}
        <div className="flex flex-col gap-3 items-center">
          <div className="w-full">
            <Button
              className="bg-[#008000] w-full py-3 text-white font-semibold rounded-md hover:bg-green-700 transition cursor-pointer"
              type="submit"
              disabled={isPending}
            >
              {isPending ? "Criando..." : "Criar conta"}
            </Button>
            <div className="flex items-center gap-1">
              <input type="checkbox" />
              <Modal
                title="Concorda com os termos e condições?"
                className="text-[12px] underline text-blue-700 cursor-pointer hover:text-blue-800"
                headerTitle="Termos e condições"
              >
                <PartnerTermsOfUse />
              </Modal>
              <span></span>
            </div>
          </div>

          <span className="font-semibold text-gray-500">OU</span>

          <Link
            href="/br/auth/sign-in"
            className="bg-gray-800 text-white py-2 w-full text-center rounded-md font-medium hover:bg-gray-700 transition"
          >
            Entrar
          </Link>
        </div>
      </form>
    </div>
  );
}
