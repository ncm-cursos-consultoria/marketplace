
import { Instagram } from "lucide-react";
import { Button } from "../ui/button";
import Link from "next/link";

export function ButtonsMenu() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-4">

      <div className="flex flex-wrap items-center gap-3">

        <Button
          asChild
          variant="ghost"
          className="cursor-pointer hover:bg-gray-100"
        >
          <Link href="/br/auth/sign-in">
            Entrar
          </Link>
        </Button>

        <Button
          asChild
          className="bg-[#008000] text-white cursor-pointer hover:bg-green-700"
        >
          <Link href="/br/auth/sign-up">
            Cadastre-se
          </Link>
        </Button>

      </div>

      <a
        href="https://www.instagram.com/"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Instagram"
        className="inline-flex items-center justify-center rounded-md p-2 hover:bg-gray-100 focus-visible:outline-2 focus-visible:outline-offset-2"
      >
        <Instagram size={20} />
      </a>

    </div>
  );
}
