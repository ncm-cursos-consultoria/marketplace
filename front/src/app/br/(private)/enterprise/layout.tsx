'use client'

import { Aside } from "@/components/aside/aside";
import { AsideEnterprise } from "@/components/enterprise/aside";
import { UseUserEnteprise } from "@/context/user-enterprise.context";

export default function LayoutOportunidades({ children }: { children: React.ReactNode }) {
  const { userEnterprise } = UseUserEnteprise()
  const typeUser = userEnterprise?.type


  console.log(userEnterprise);


  if (typeUser === "CANDIDATE") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        seu usuário não é uma empresa
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      <AsideEnterprise />
      <main className="flex-1 p-6 lg:p-10 ml-72">
        {children}
      </main>
    </div>
  );
}
