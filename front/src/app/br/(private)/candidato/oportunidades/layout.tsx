// app/candidato/oportunidades/layout.tsx (ou o arquivo que você mostrou)
import { Aside } from "@/components/aside/aside";

export default function LayoutOportunidades({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen">
      <Aside />
      <main className="ml-[300px] min-h-screen bg-neutral-200">
        {children}
      </main>
    </div>
  );
}
