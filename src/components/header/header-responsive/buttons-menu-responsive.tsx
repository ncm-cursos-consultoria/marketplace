import { Button } from "@/components/ui/button";
import Link from "next/link";

export function ButtonsMenuResponsive() {
  return (
    <div className="flex flex-col gap-3 w-full max-w-[180px]">
      <Link href={"auth/sign-in"}>
        <Button
          variant="outline"
          className="w-full font-semibold hover:bg-gray-100 transition"
        >
          Entrar
        </Button>
      </Link>
      <Link href={"/auth/sign-up"}>
        <Button className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold transition">
          Cadastrar
        </Button>
      </Link>
    </div>
  );
}
