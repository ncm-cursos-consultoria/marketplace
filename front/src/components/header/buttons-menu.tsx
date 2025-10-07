import { Instagram } from "lucide-react";
import { Button } from "../ui/button";
import Link from "next/link";

export function ButtonsMenu() {
  return (
    <div className="flex items-center gap-5">
      <div>
        <Link href={'/br/auth/sign-in'}>
          <Button variant={"ghost"} className=" cursor-pointer">
            Entrar
          </Button>
        </Link>
        <Link href={"/br/auth/sign-up"}>
          <Button className="bg-[#008000] cursor-pointer text-white">Cadastre-se</Button>
        </Link>
      </div>
      <div>
        <Instagram />
      </div>
    </div>
  );
}
