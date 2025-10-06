import { Badge } from "@/components/ui/badge";
import { BookOpen, PlayCircle } from "lucide-react";

type Course = {
  id: string;
  title: string;
  description?: string | null;
  order: number;
  videoUrl?: string | null;
  durationInMin?: number | null;
};

function toYouTubeEmbed(url?: string | null): string | null {
  if (!url) return null;

  try {
    const u = new URL(url);

    // youtu.be/<id>
    if (u.hostname.includes("youtu.be")) {
      const id = u.pathname.slice(1);
      if (id) return `https://www.youtube-nocookie.com/embed/${id}?modestbranding=1&rel=0&playsinline=1`;
    }

    // youtube.com/shorts/<id>
    if (u.hostname.includes("youtube.com") && u.pathname.startsWith("/shorts/")) {
      const id = u.pathname.split("/")[2];
      if (id) return `https://www.youtube-nocookie.com/embed/${id}?modestbranding=1&rel=0&playsinline=1`;
    }

    // youtube.com/watch?v=<id>
    if (u.hostname.includes("youtube.com") && u.pathname === "/watch") {
      const id = u.searchParams.get("v");
      if (id) return `https://www.youtube-nocookie.com/embed/${id}?modestbranding=1&rel=0&playsinline=1`;
    }

    // youtube.com/embed/<id> (ou já veio como /embed/…)
    if (u.hostname.includes("youtube.com") && u.pathname.startsWith("/embed/")) {
      const id = u.pathname.split("/")[2];
      if (id) return `https://www.youtube-nocookie.com/embed/${id}?modestbranding=1&rel=0&playsinline=1`;
    }
  } catch {
    // URL inválida — cai no fallback
  }

  return null;
}

export function CourseCard({ course }: { course: Course }) {
  const embedUrl = toYouTubeEmbed(course.videoUrl);

  return (
    <div className="group flex w-full flex-col overflow-hidden rounded-2xl border bg-white text-left shadow-sm transition hover:shadow-md focus:outline-none">
      {/* Player / Capa */}
      {embedUrl ? (
        <div className="relative w-full aspect-video bg-black">
          <iframe
            className="absolute inset-0 h-full w-full"
            src={embedUrl}
            title={course.title}
            // Permissões recomendadas pelo YouTube para melhor UX
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          />
        </div>
      ) : (
        <div className="relative h-40 w-full bg-muted">
          <div className="absolute inset-0 grid place-items-center text-muted-foreground">
            <PlayCircle className="h-10 w-10 opacity-60" />
          </div>
        </div>
      )}

      {/* Conteúdo */}
      <div className="flex flex-1 flex-col gap-2 p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="line-clamp-1 text-base font-semibold">{course.title}</h3>

          <div className="flex items-center gap-2">
            <Badge variant="secondary">#{course.order ?? 0}</Badge>
            {course.durationInMin ? (
              <Badge variant="outline">{course.durationInMin} min</Badge>
            ) : null}
          </div>
        </div>

        <p className="line-clamp-2 text-sm text-muted-foreground">
          {course.description ?? "\u00A0"}
        </p>

        <div className="mt-auto flex items-center justify-between pt-2 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1">
            <BookOpen className="h-4 w-4" /> Assistir no player
          </span>
          <span className="inline-flex items-center gap-1 opacity-0 transition group-hover:opacity-100">
            <PlayCircle className="h-4 w-4" /> Reproduzir
          </span>
        </div>
      </div>
    </div>
  );
}
