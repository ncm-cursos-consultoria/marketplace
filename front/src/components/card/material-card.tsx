import { materials } from "@/utils/jobs-simulate";
import { PlayCircle } from "lucide-react";

export function CardMaterial() {
  return(
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {materials.map((m) => (
                <article key={m.id} className="rounded-xl overflow-hidden bg-white shadow-sm border border-gray-100">
                  <div className="relative aspect-video">
                    <img
                      alt={m.title}
                      className="h-full w-full object-cover"
                      src={`https://img.youtube.com/vi/${m.yt}/hqdefault.jpg`}
                    />
                    <div className="absolute inset-0 bg-black/10" />
                    <button className="absolute left-4 bottom-4 inline-flex items-center gap-2 rounded-full bg-white/95 px-3 py-1 text-sm font-medium shadow">
                      <PlayCircle className="h-4 w-4" /> Assistir
                    </button>
                  </div>
                  <div className="p-4">
                    <p className="text-sm text-gray-500">{m.module}</p>
                    <h3 className="font-semibold leading-snug mt-0.5">{m.title}</h3>
                    <p className="text-sm text-gray-600 mt-1">{m.desc}</p>
                  </div>
                </article>
              ))}
            </div>
  )
}