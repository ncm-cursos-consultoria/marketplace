// app/candidato/oportunidades/layout.tsx (ou o arquivo que você mostrou)
import { Aside } from "@/components/aside/aside";

export default function LayoutOportunidades({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen">
      <Aside />
      <main className="ml-[300px] w-[calc(100%-350px)] min-h-screen">
        {children}
      </main>
    </div>
  );
}
