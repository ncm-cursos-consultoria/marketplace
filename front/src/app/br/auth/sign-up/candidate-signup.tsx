import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCreateUser } from "@/hooks/forms/create-user";
import Link from "next/link";
import { useState } from "react";

export function CandidateSignUp() {
  const { form, isPending, onSubmit } = useCreateUser();

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
            <Label>Nome</Label>
            <Input
              className="border border-neutral-300 w-full"
              placeholder="Digite seu nome"
              {...register("firstName")}
            />
            {errors.firstName && (
              <span className="text-sm text-red-600">
                {errors.firstName.message}
              </span>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <Label>Sobrenome</Label>
            <Input
              className="border border-neutral-300 w-full"
              placeholder="Digite seu sobrenome"
              {...register("lastName")}
            />
          </div>
        </div>
        <div className="flex flex-col gap-1">
          <Label>CPF</Label>
          <Input
            className="border border-neutral-300"
            placeholder="Digite uma senha"
            {...register("cpf")}
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
        <div>
          <Label>Data de nascimento</Label>
          <Input type="date" className="border border-neutral-300 w-full" {...register('birthday')}/>
        </div>
      </div>
      <div className="flex flex-col gap-3 items-center">
        <Button
          className="bg-[#008000] w-full py-3 text-white font-semibold rounded-md hover:bg-green-700 transition cursor-pointer"
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
