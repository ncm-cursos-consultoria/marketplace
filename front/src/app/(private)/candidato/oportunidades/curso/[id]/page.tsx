"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { UseUserCandidate } from "@/context/user-candidate.context";
import { getCourses } from "@/service/course/get-courses";

type Course = {
  id: string;
  title: string;
  moduleId: string;
  videoUrl: string;
  createdAt?: string;
  updatedAt?: string;
};

function getYouTubeId(url: string): string | null {
  try {
    const u = new URL(url);

    if (u.hostname.includes("youtu.be")) {
      return u.pathname.replace("/", "");
    }

    if (u.hostname.includes("youtube.com")) {
      if (u.pathname === "/watch") {
        return u.searchParams.get("v");
      }
      if (u.pathname.startsWith("/embed/")) {
        return u.pathname.split("/")[2] ?? null;
      }

      if (u.pathname.startsWith("/shorts/")) {
        return u.pathname.split("/")[2] ?? null;
      }
    }
    return null;
  } catch {
    return null;
  }
}

function toEmbedUrl(raw: string): string | null {
  const id = getYouTubeId(raw);
  if (!id) return null;

  return `https://www.youtube.com/embed/${id}?rel=0&modestbranding=1&autoplay=1`;
}

function toThumbUrl(raw: string): string | null {
  const id = getYouTubeId(raw);
  if (!id) return null;

  return `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;
}

function LiteYouTube({
  url,
  title,
}: {
  url: string;
  title: string;
}) {
  const [playing, setPlaying] = useState(false);
  const embedUrl = toEmbedUrl(url);
  const thumbUrl = toThumbUrl(url);

  if (!embedUrl || !thumbUrl) {
    return (
      <div className="aspect-video w-full grid place-items-center rounded-xl bg-neutral-100 text-neutral-500">
        URL de vídeo inválida
      </div>
    );
  }

  return (
    <div className="relative w-full aspect-video overflow-hidden rounded-xl bg-black">
      {playing ? (
        <iframe
          className="absolute inset-0 h-full w-full"
          src={embedUrl}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
      ) : (
        <button
          type="button"
          onClick={() => setPlaying(true)}
          className="absolute inset-0 group"
          aria-label={`Assistir ${title}`}
        >
          <img
            src={thumbUrl}
            alt={title}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="absolute inset-0 grid place-items-center">
            <div className="rounded-full p-4 bg-white/90 shadow">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor" className="text-black">
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
          </div>
        </button>
      )}
    </div>
  );
}

function CourseCard({ course }: { course: Course }) {
  return (
    <div className="flex h-full flex-col overflow-hidden rounded-2xl border bg-white shadow-sm">
      <LiteYouTube url={course.videoUrl} title={course.title} />
      <div className="flex flex-col gap-2 p-4">
        <h3 className="line-clamp-2 text-base font-semibold">{course.title}</h3>
        <div className="text-xs text-neutral-500">
          {course.createdAt
            ? new Date(course.createdAt).toLocaleString("pt-BR")
            : null}
        </div>
        <a
          href={course.videoUrl}
          target="_blank"
          rel="noreferrer"
          className="mt-1 text-sm text-blue-600 hover:underline"
        >
          Abrir no YouTube
        </a>
      </div>
    </div>
  );
}

export default function CursoPage() {

  const { userCandidate } = UseUserCandidate();
  const params = useParams<{ id: string }>();
  const id = params?.id;

  const {
    data: courses,
    isLoading,
    isError,
    error,
  } = useQuery<Course[]>({
    queryKey: ["courses", id],
    queryFn: () => getCourses(id as string),
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
  });

  // ordena por número no título se existir (ex.: "Cap 1", "Cap 2"...)
  const sorted =
    (courses ?? []).slice().sort((a, b) => {
      const numA = Number(a.title.match(/\d+/)?.[0] ?? 9999);
      const numB = Number(b.title.match(/\d+/)?.[0] ?? 9999);
      return numA - numB || a.title.localeCompare(b.title);
    });

  return (
    <div className="px-6 py-6">
      <header className="mb-6">
        <h1 className="text-2xl font-semibold">Cursos</h1>
        <p className="text-sm text-neutral-600">
          
        </p>
      </header>

      {isLoading ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="animate-pulse rounded-2xl border bg-white shadow-sm"
            >
              <div className="aspect-video w-full rounded-t-2xl bg-neutral-200" />
              <div className="p-4 space-y-2">
                <div className="h-4 w-3/4 bg-neutral-200 rounded" />
                <div className="h-3 w-1/3 bg-neutral-200 rounded" />
              </div>
            </div>
          ))}
        </div>
      ) : isError ? (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">
          Falha ao carregar cursos.
          <div className="text-xs mt-1 opacity-80">
            {(error as Error)?.message}
          </div>
        </div>
      ) : sorted.length === 0 ? (
        <div className="text-neutral-600">Nenhum curso encontrado.</div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {sorted.map((c) => (
            <CourseCard key={c.id} course={c} />
          ))}
        </div>
      )}
    </div>
  );
}
