import Image from "next/image";
import { ButtonsMenu } from "./buttons-menu";
import { MenuNav } from "./menu-nav";
import logo from "@/assets/logo-ncm-horizontal.svg";
import { LanguageToggle } from "../toggle-languages";


export function Header() {
  return (
    <header className="px-10 py-5 bg-neutral-200">
      <nav className="flex items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <Image src={logo} alt="Logo NCM consultoria" width={120} />
        </div>
        <div className="hidden md:block">
          <MenuNav />
        </div>
        <div className="flex items-center gap-3">
          {/* <LanguageToggle /> */}
          <ButtonsMenu />
        </div>
      </nav>
    </header>
  );
}
