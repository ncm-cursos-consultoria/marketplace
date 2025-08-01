import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";

export default function SignIn() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col items-center">
        <h1 className="font-semibold text-[25px]">Continue sua jornada !</h1>
        <h2 className="font-semibold text-[25px]">Seja bem vindo novamente </h2>
      </div>
      <form className="flex flex-col gap-5">
        <div className="flex flex-col gap-2">
          <div className="flex flex-col gap-1">
            <Label>Email</Label>
            <Input
              type="email"
              className="border border-neutral-400 w-full"
              placeholder="Digite seu email"
            />
          </div>
          <div className="flex flex-col gap-1">
            <Label>Senha</Label>
            <Input
              type="password"
              className="border border-neutral-400 w-full"
              placeholder="Digite sua senha"
            />
          </div>
        </div>
        <div className="flex flex-col items-center gap-3">
          <Button className="bg-[#008000] w-full cursor-pointer p-5">
            Entrar
          </Button>
          <Link href={'/auth/forgot-password'}>
            <span className="text-neutral-500 text-[14px]">
              Esqueci a senha
            </span>
          </Link>
        </div>
      </form>
    </div>
  );
}
