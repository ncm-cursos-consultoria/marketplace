"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useCreateUser } from "@/hooks/forms/create-user";

export default function SignUp() {
  const { form, isPending, onSubmit } = useCreateUser();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = form;

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white shadow-lg rounded-xl p-6 md:p-8 flex flex-col gap-6">
        {/* Header */}
        <div className="flex flex-col items-center text-center font-medium gap-1">
          <h1 className="text-2xl md:text-3xl font-bold">Seja Bem Vindo</h1>
          <h2 className="text-base md:text-lg text-gray-600">
            Crie sua conta no marketplace!
          </h2>
        </div>

        {/* Form */}
        <form className="flex flex-col gap-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col gap-4">
            {/* Nome */}
            <div className="flex flex-col gap-1">
              <Label>Nome completo</Label>
              <Input
                className="border border-neutral-300"
                placeholder="Digite seu nome"
                {...register("nome")}
              />
              {errors.nome && (
                <span className="text-sm text-red-600">
                  {errors.nome.message}
                </span>
              )}
            </div>

            {/* Email */}
            <div className="flex flex-col gap-1">
              <Label>Email</Label>
              <Input
                className="border border-neutral-300"
                placeholder="Digite seu email"
                type="email"
                {...register("email")}
              />
            </div>

            {/* Senha */}
            <div className="flex flex-col gap-1">
              <Label>Senha</Label>
              <Input
                className="border border-neutral-300"
                type="password"
                placeholder="Digite uma senha"
                {...register("senha")}
              />
            </div>

            {/* Tipo de cadastro */}
            <div className="flex flex-col gap-1">
              <Label>Selecione tipo de cadastro</Label>
              <select
                {...register("tipo")}
                className="border border-neutral-300 rounded-md p-2"
              >
                <option value="Candidato">Candidato</option>
                <option value="Empresa">Empresa</option>
                <option value="Outro">Outro</option>
              </select>
            </div>
          </div>

          {/* Actions */}
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
              href="/auth/sign-in"
              className="bg-gray-800 text-white py-2 w-full text-center rounded-md font-medium hover:bg-gray-700 transition"
            >
              Entrar
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
