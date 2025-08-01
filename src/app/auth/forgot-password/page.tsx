import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@radix-ui/react-label";

export default function ForgotPassword() {
  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col text-center">
        <h1 className="font-semibold text-[18px]">
          Para recuperar sua senha digite o seu email
        </h1>
        <span className="text-neutral-500 text-[14px]">
          Um código será enviado ao seu email
        </span>
      </div>
      <div>
        <form>
          <Label>Email</Label>
          <div className="flex items-center gap-2">
            <Input
              type="email"
              placeholder="Digite seu email"
              className="border border-neutral-400"
            />
            <Button className="bg-[#008000]">Enviar</Button>
          </div>
        </form>
      </div>
    </div>
  );
}
