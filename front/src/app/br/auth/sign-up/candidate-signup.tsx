import { Modal } from "@/components/modal";
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
              aria-invalid={!!errors.firstName}
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
              aria-invalid={!!errors.lastName}
              {...register("lastName")}
            />
            {errors.lastName && (
              <span className="text-sm text-red-600">
                {errors.lastName.message}
              </span>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <Label>CPF</Label>
          <Input
            className="border border-neutral-300"
            placeholder="Digite seu CPF"
            inputMode="numeric"
            aria-invalid={!!errors.cpf}
            {...register("cpf")}
          />
          {errors.cpf && (
            <span className="text-sm text-red-600">{errors.cpf.message}</span>
          )}
        </div>

        <div className="w-full flex flex-col md:flex-row gap-4">
          <div className="flex-1 min-w-0">
            <Label>Email</Label>
            <Input
              type="email"
              className="border border-neutral-300 w-full"
              placeholder="Digite seu email"
              aria-invalid={!!errors.email}
              {...register("email")}
            />
            {errors.email && (
              <span className="text-sm text-red-600">
                {errors.email.message}
              </span>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <Label>Senha</Label>
            <Input
              type="password"
              className="border border-neutral-300 w-full"
              placeholder="Digite sua senha"
              aria-invalid={!!errors.password}
              {...register("password")}
            />
            {errors.password && (
              <span className="text-sm text-red-600">
                {errors.password.message}
              </span>
            )}
          </div>
        </div>

        <div>
          <Label>Data de nascimento</Label>
          <Input
            type="date"
            className="border border-neutral-300 w-full"
            aria-invalid={!!errors.birthday}
            {...register("birthday")}
          />
          {errors.birthday && (
            <span className="text-sm text-red-600">
              {errors.birthday.message}
            </span>
          )}
        </div>
      </div>

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
              <div>
                <p>
                  Bem-vindo ao Marketplace da NCM. Estes Termos e Condições de
                  Uso regulam o acesso e a utilização da Plataforma e dos
                  serviços oferecidos por NCM CONSULTORIA LTDA - ME, inscrita no
                  CNPJ sob nº 53.189.671/0001-09, com sede em [Endereço
                  Completo]. Ao criar uma conta, acessar ou usar
                  a Plataforma, você concorda com estes Termos e com nossa
                  Política de Privacidade . Se você não concorda, não deve
                  utilizar a Plataforma.
                </p>
              </div>
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
  );
}
