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
    <div className="border border-neutral-400 rounded-md shadow-md w-[20vw]">
      {embedUrl ? (
        <div className="w-[20vw] h-[20vh] relative" style={{ paddingTop: "56.25%" }}>
          <iframe
            src={embedUrl}
            title={course.title}
            className="absolute rounded-t-md inset-0 h-full w-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            loading="lazy"
            referrerPolicy="strict-origin-when-cross-origin"
          />
        </div>
      ) : (
        <a
          href={course.videoUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="relative grid h-32 w-full place-items-center bg-muted text-muted-foreground"
        >
          Abrir vídeo
        </a>
      )}

      <div className="flex flex-1 flex-col gap-2 p-4">
        <h3 className="line-clamp-1 text-base font-semibold">{course.title}</h3>
        {course.description && (
          <p className="line-clamp-2 text-sm text-muted-foreground">{course.description}</p>
        )}
      </div>
    </div>
  );
}
