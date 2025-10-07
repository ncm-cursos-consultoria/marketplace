import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCreateEnterprise } from "@/hooks/forms/create-enterprise";
import { useCreateUser } from "@/hooks/forms/create-user";
import Link from "next/link";
import { useState } from "react";

export function EnterpriseCandidate() {
  const { form, isPending, onSubmit } = useCreateEnterprise()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = form;

  return (
    <form
      className="flex flex-col gap-6 lg:w-[500px]"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="flex flex-col gap-4">
        <div className="w-full flex flex-col md:flex-row gap-4">
          <div className="flex-1 min-w-0">
            <Label>Razão social</Label>
            <Input
              className="border border-neutral-300 w-full"
              placeholder="Digite seu nome"
              {...register("legalName")}
            />
            {errors.legalName && (
              <span className="text-sm text-red-600">
                {errors.legalName.message}
              </span>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <Label>Nome fantasia</Label>
            <Input
              className="border border-neutral-300 w-full"
              placeholder="Digite seu sobrenome"
              {...register("tradeName")}
            />
          </div>
        </div>
        <div className="flex flex-col gap-1">
          <Label>CNPJ</Label>
          <Input
            className="border border-neutral-300"
            placeholder="Digite seu email"
            type="text"
            {...register("cnpj")}
          />
        </div>

        <div className="w-full flex flex-col md:flex-row gap-4">
          <div className="flex-1 min-w-0">
            <Label>email</Label>
            <Input
              className="border border-neutral-300 w-full"
              placeholder="Digite seu nome"
              {...register("email")}
            />
            {errors.email && (
              <span className="text-sm text-red-600">
                {errors.email.message}
              </span>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <Label>senha</Label>
            <Input
              className="border border-neutral-300 w-full"
              placeholder="Digite seu sobrenome"
              {...register("password")}
            />
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-3 items-center">
        <Button
          className="bg-[#008000] w-full py-3 text-white font-semibold rounded-md hover:bg-green-700 transition"
          type="submit"
          disabled={isPending}
        >
          {isPending ? "Criando..." : "Criar conta"}
        </Button>

        <span className="font-semibold text-gray-500">OU</span>

        <Link
          href="/br/auth/sign-in"
          className="bg-gray-800 text-white py-2 w-full text-center rounded-md font-medium hover:bg-gray-700 transition"
        >
          Entrar
        </Link>
      </div>
    </form>
  );
}
