import { CardMaterial } from "@/components/card/material-card";

export function ModuleSection() {
  return (
    <section className="mb-10 w-[80vw]">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-xl font-semibold">Cursos</h2>
        <div>
          <span className="underline text-blue-700 cursor-pointer hover:text-neutral-800">
            Ver todos
          </span>
        </div>
      </div>
      <CardMaterial />
    </section>
  );
}
