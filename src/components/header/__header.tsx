import { ButtonsMenu } from "./buttons-menu";
import { MenuNav } from "./menu-nav";

export function Header() {
  return (
    <header className="px-10 py-5 bg-neutral-200">
      <nav className="flex items-center justify-between">
        <div>
          <h1 className="font-semibold text-[30px]">logo</h1>
        </div>
        <MenuNav />
        <div>
          <ButtonsMenu />
        </div>
      </nav>
    </header>
  );
}
