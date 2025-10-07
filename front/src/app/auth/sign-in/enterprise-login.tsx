import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLoginEnterprise } from "@/hooks/forms/login-enterprise";
import Link from "next/link";

export function EnterpriseLogin() {
  const { form, isPending, onSubmit } = useLoginEnterprise();

  const { register, handleSubmit } = form;

  return (
    <div className="w-full">
      <form className="flex flex-col gap-6 w-full" onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-col gap-4 w-full">
          <div className="flex flex-col gap-1">
            <Label>Email Corporativo</Label>
            <Input
              type="email"
              className="border border-neutral-300 w-full"
              placeholder="Digite seu email"
              {...register("email")}
            />
          </div>
          <div className="flex flex-col gap-1">
            <Label>Senha</Label>
            <Input
              type="password"
              className="border border-neutral-300 w-full"
              placeholder="Digite sua senha"
              {...register("password")}
            />
          </div>
        </div>
        <div className="flex flex-col gap-4 items-center">
          <Button
            className="bg-[#008000] w-full py-3 text-white font-semibold rounded-md hover:bg-green-700 transition"
            type="submit"
          >
            {isPending ? "Carregando... " : "Entrar"}
          </Button>

          <Link href="/auth/forgot-password">
            <span className="text-sm text-neutral-500 hover:text-neutral-700 transition">
              Esqueci a senha
            </span>
          </Link>
        </div>
      </form>
    </div>
  );
}
