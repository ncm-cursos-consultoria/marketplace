import { useMemo } from "react";

export type Course = {
  id: string;
  title: string;
  description?: string;
  videoUrl: string;
  // deixe opcional se nem sempre vem do backend:
  order?: number;
  // adicione se existir no backend:
  moduleId?: string;
};

function toYouTubeEmbed(raw: string): string | null {
  try {
    const u = new URL(raw);
    const host = u.hostname.replace(/^www\./, "");
    let id: string | null = null;

    if (host === "youtu.be") {
      id = u.pathname.slice(1) || null;
    } else if (["youtube.com", "m.youtube.com", "youtube-nocookie.com"].includes(host)) {
      if (u.pathname === "/watch") {
        id = u.searchParams.get("v");
      } else {
        const parts = u.pathname.split("/").filter(Boolean);
        const idx = parts.findIndex((p) => ["embed", "shorts", "v", "live"].includes(p));
        if (idx !== -1 && parts[idx + 1]) id = parts[idx + 1];
      }
    }

    if (!id) return null;

    const t = u.searchParams.get("start") || u.searchParams.get("t");
    let startQS = "";
    if (t) {
      let seconds = 0;
      if (/^\d+$/.test(t)) seconds = Number(t);
      else {
        const m = t.match(/(?:(\d+)h)?(?:(\d+)m)?(?:(\d+)s)?/i);
        if (m) {
          const [_, h, mi, s] = m;
          seconds = (Number(h || 0) * 3600) + (Number(mi || 0) * 60) + Number(s || 0);
        }
      }
      if (seconds > 0) startQS = `?start=${seconds}`;
    }

    return `https://www.youtube.com/embed/${id}${startQS}`;
  } catch {
    return null;
  }
}

export function CourseCard({ course }: { course: Course }) {
  const embedUrl = useMemo(() => toYouTubeEmbed(course.videoUrl), [course.videoUrl]);

  return (
    <div className="flex flex-col border border-neutral-300 rounded-2xl shadow-sm bg-white overflow-hidden transition-all hover:shadow-md h-full">
      {/* Container do Vídeo: Mantém a proporção 16:9 */}
      <div className="relative w-full aspect-video bg-black">
        {embedUrl ? (
          <iframe
            src={embedUrl}
            title={course.title}
            className="absolute inset-0 h-full w-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            loading="lazy"
          />
        ) : (
          <a
            href={course.videoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-full w-full items-center justify-center bg-muted text-muted-foreground hover:bg-neutral-100 transition-colors"
          >
            Abrir vídeo externo
          </a>
        )}
      </div>

      {/* Área de Conteúdo: Usamos min-h para manter os cards alinhados */}
      <div className="flex flex-1 flex-col p-5">
        <div className="min-h-[3.5rem] mb-2"> {/* Altura mínima para ~2 linhas de título */}
          <h3 className="text-base font-bold text-gray-900 break-words leading-tight">
            {course.title}
          </h3>
        </div>

        {course.description && (
          <p className="line-clamp-3 text-sm text-muted-foreground leading-relaxed">
            {course.description}
          </p>
        )}
      </div>
    </div>
  );
}