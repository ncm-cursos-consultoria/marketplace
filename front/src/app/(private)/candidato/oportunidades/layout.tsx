import { Aside } from "@/components/aside/aside";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function LayoutOportunidades({
  children,
}: {
  children: React.ReactNode;
}) {


  return (
    <div className="flex  ">
      <Aside />
      <main className="w-full">{children}</main>
    </div>
  );
}
