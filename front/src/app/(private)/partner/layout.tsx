"use client";

import { AsidePartner } from "@/components/partner/aside-partnert";
import { UseUserPartner } from "@/context/user-partner.context";

export default function LayoutOportunidades({ children }: { children: React.ReactNode }) {
  const { userPartner } = UseUserPartner();
  const typeUser = userPartner?.type; 


  if (!typeUser) return null; 

  if (typeUser !== "PARTNER") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        seu usuário não é parceiro
      </div>
    );
  }

  return (
    <div className="flex items-start">
      <AsidePartner />
      <main className="m-[50px]">{children}</main>
    </div>
  );
}
