import Image from "next/image";
import { ButtonsMenu } from "./buttons-menu";
import { MenuNav } from "./menu-nav";
import logo from "@/assets/logo-ncm-horizontal.svg"

export function Header() {
  return (
    <header className="px-10 py-5 bg-neutral-200">
      <nav className="flex items-center justify-between">
        <div>
          <Image src={logo} alt="Logo NCM consultoria" width={100}/>
        </div>
        <MenuNav />
        <div>
          <ButtonsMenu />
        </div>
      </nav>
    </header>
  );
}
