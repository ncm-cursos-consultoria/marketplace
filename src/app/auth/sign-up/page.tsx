import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Link from "next/link";

export default function SignUp() {
  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col items-center font-medium text-[25px]">
        <h1>Seja Bem Vindo</h1>
        <h2>Crie sua conta no marketplace!</h2>
      </div>
      <form className="flex flex-col gap-8">
        <div className="flex flex-col gap-2">
          <div className="flex flex-col gap-1">
            <Label>Nome completo</Label>
            <Input
              className="border border-neutral-400"
              placeholder="Digite seu nome"
            />
          </div>
          <div className="flex flex-col gap-1">
            <Label>Email</Label>
            <Input
              className="border border-neutral-400"
              placeholder="Digite seu email"
              type="email"
            />
          </div>
          <div className="flex flex-col gap-1">
            <Label>Senha</Label>
            <Input
              className="border border-neutral-400"
              type="password"
              placeholder="Digite uma senha"
            />
          </div>
          <div className="flex flex-col gap-1">
            <Label>Selecione tipo de cadastro</Label>
            <Select>
              <SelectTrigger className="w-full border border-neutral-400">
                <SelectValue placeholder="Selecione" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="light">Candidado</SelectItem>
                <SelectItem value="dark">Empresa</SelectItem>
                <SelectItem value="system">Outro</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="flex flex-col gap-2 items-center">
          <Button className="bg-[#008000] w-full cursor-pointer p-5">
            Criar conta
          </Button>
          <span className="font-semibold">OU</span>
          <Link
            href="/auth/sign-in"
            className="bg-[#008000] text-white p-2 w-full text-center rounded-md font-medium hover:bg-neutral-700 transition"
          >
            Entrar
          </Link>
        </div>
      </form>
    </div>
  );
}
