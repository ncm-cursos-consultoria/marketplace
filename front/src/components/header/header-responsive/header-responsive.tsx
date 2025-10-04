import Image from "next/image";
import logo from "@/assets/logo-ncm-horizontal.svg";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { MenuNav } from "../menu-nav";
import { ButtonsMenu } from "../buttons-menu";
import { Button } from "@/components/ui/button";
import { ButtonsMenuResponsive } from "./buttons-menu-responsive";

export function HeaderResponsive() {
  return (
    <header className="flex items-center justify-between p-5">
      <Image src={logo} alt="Logo ncm" width={100} />
      <Sheet>
        <SheetTrigger>
          <div className="p-2 border border-neutral-300 shadow-lg rounded-md">
            <Menu />
            <div>

            </div>
          </div>
        </SheetTrigger>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Menu</SheetTitle>
          </SheetHeader>
          <div className="flex flex-col gap-10 items-start justify-start ml-10">
            <MenuNav />
            <ButtonsMenuResponsive />
          </div>
        </SheetContent>
      </Sheet>
    </header>
  );
}
