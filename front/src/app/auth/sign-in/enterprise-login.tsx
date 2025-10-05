import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";

export function EnterpriseLogin() {
  return(
    <div>
            <form className="flex flex-col gap-6">
        <div className="flex flex-col gap-4">
          {/* Email */}
          <div className="flex flex-col gap-1">
            <Label>Email Corporativo</Label>
            <Input
              type="email"
              className="border border-neutral-300"
              placeholder="Digite seu email"
            />
          </div>
          <div className="flex flex-col gap-1">
            <Label>Senha</Label>
            <Input
              type="password"
              className="border border-neutral-300"
              placeholder="Digite sua senha"
            />
          </div>
        </div>
        <div className="flex flex-col gap-4 items-center">
          <Link href="/enterprise" className="w-full cursor-pointer">
            <Button className="bg-[#008000] w-full py-3 text-white font-semibold rounded-md hover:bg-green-700 transition">
              Entrar
            </Button>
          </Link>

          <Link href="/auth/forgot-password">
            <span className="text-sm text-neutral-500 hover:text-neutral-700 transition">
              Esqueci a senha
            </span>
          </Link>
        </div>
      </form>
    </div>
  )
}