"use client";

import { useState, useRef, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import YouTube, { YouTubeEvent, YouTubeProps } from "react-youtube"; // Import novo
import { UseUserCandidate } from "@/context/user-candidate.context";
import { getCourses } from "@/service/course/get-courses";
import { changeCourseStatus, userCourseStatus } from "@/service/course/change-status";
import { Button } from "@/components/ui/button";
import { Clock } from "lucide-react";
import { AppointmentModal } from "@/components/mentorship/appointment-modal";
import { getModule } from "@/service/module/get-module";

type Course = {
  id: string;
  title: string;
  moduleId: string;
  videoUrl: string;
  status: userCourseStatus;
  createdAt: string;
  updatedAt?: string;
};

function getYouTubeId(url: string): string | null {
  try {
    const u = new URL(url);
    if (u.hostname.includes("youtu.be")) return u.pathname.replace("/", "");
    if (u.hostname.includes("youtube.com")) {
      if (u.pathname === "/watch") return u.searchParams.get("v");
      if (u.pathname.startsWith("/embed/")) return u.pathname.split("/")[2] ?? null;
      if (u.pathname.startsWith("/shorts/")) return u.pathname.split("/")[2] ?? null;
    }
    return null;
  } catch {
    return null;
  }
}

function toThumbUrl(raw: string): string | null {
  const id = getYouTubeId(raw);
  if (!id) return null;
  return `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;
}

// --- NOVO COMPONENTE LITEYOUTUBE ---
function LiteYouTube({
  url,
  title,
  onStartVideo,
  onFinishVideo,
}: {
  url: string;
  title: string;
  onStartVideo: () => void;
  onFinishVideo: () => void;
}) {
  const [playing, setPlaying] = useState(false);
  const [player, setPlayer] = useState<any>(null);
  const [finished, setFinished] = useState(false); // Evita chamadas duplicadas

  const videoId = getYouTubeId(url);
  const thumbUrl = toThumbUrl(url);

  // Monitora o progresso do vídeo a cada 1 segundo
  useEffect(() => {
    if (!player || finished) return;

    const interval = setInterval(async () => {
      try {
        // currentTime e duration vêm em segundos
        const currentTime = await player.getCurrentTime();
        const duration = await player.getDuration();

        if (duration > 0) {
          const percentage = (currentTime / duration) * 100;
          if (percentage >= 95) {
            onFinishVideo();
            setFinished(true);
            clearInterval(interval);
          }
        }
      } catch (e) {
        // Ignora erros se o player ainda não estiver pronto
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [player, finished, onFinishVideo]);

  const handlePlayClick = () => {
    setPlaying(true);
    onStartVideo(); // Marca como ONGOING ao clicar no play
  };

  const onPlayerReady = (event: YouTubeEvent) => {
    setPlayer(event.target);
    // Opcional: Tocar automaticamente ao carregar o componente pesado
    event.target.playVideo();
  };

  const opts: YouTubeProps["opts"] = {
    height: "100%",
    width: "100%",
    playerVars: {
      autoplay: 1,
      rel: 0,
      modestbranding: 1,
    },
  };

  if (!videoId || !thumbUrl) {
    return (
      <div className="aspect-video w-full grid place-items-center rounded-xl bg-neutral-100 text-neutral-500">
        URL inválida
      </div>
    );
  }

  return (
    <div className="relative w-full aspect-video overflow-hidden rounded-xl bg-black">
      {playing ? (
        <YouTube
          videoId={videoId}
          title={title}
          opts={opts}
          onReady={onPlayerReady}
          className="absolute inset-0 h-full w-full"
          iframeClassName="h-full w-full"
        />
      ) : (
        <button
          type="button"
          onClick={handlePlayClick}
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

const STATUS_CONFIG: Record<userCourseStatus, { label: string; color: string; bg: string }> = {
  NOT_STARTED: { label: "Não iniciado", color: "text-gray-700", bg: "bg-gray-100" },
  ONGOING: { label: "Em andamento", color: "text-blue-700", bg: "bg-blue-50" },
  FINISHED: { label: "Concluído", color: "text-green-700", bg: "bg-green-50" },
};

function StatusBadge({ status }: { status?: userCourseStatus }) {
  const current = status ? STATUS_CONFIG[status] : STATUS_CONFIG["NOT_STARTED"];

  return (
    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${current.bg} ${current.color} border border-transparent`}>
      {current.label}
    </span>
  );
}

// --- CARD ATUALIZADO ---
function CourseCard({
  course,
  userId,
  onUpdateStatus
}: {
  course: Course;
  userId: string;
  onUpdateStatus: (status: userCourseStatus) => void;
}) {

  const handleUpdate = (status: userCourseStatus) => {
    console.log(`Changed course id ${course.id} to status ${status}`);

    onUpdateStatus(status);
  };

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-2xl border bg-white shadow-sm hover:shadow-md transition-shadow">
      <LiteYouTube
        url={course.videoUrl}
        title={course.title}
        onStartVideo={() => onUpdateStatus("ONGOING")}
        onFinishVideo={() => onUpdateStatus("FINISHED")}
      />

      <div className="flex flex-col flex-1 p-4 gap-3">
        {/* Título */}
        <h3 className="line-clamp-2 text-base font-semibold text-neutral-900 leading-tight">
          {course.title}
        </h3>

        {/* Status e Duração */}
        <div className="flex items-center justify-between mt-auto pt-2">
          <StatusBadge status={course.status} />
        </div>
        <a
          href={course.videoUrl}
          target="_blank"
          rel="noreferrer"
          onClick={() => handleUpdate("ONGOING")} // Marca como ONGOING ao clicar no link
          className="mt-1 text-sm text-blue-600 hover:underline cursor-pointer"
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
  const moduleId = params?.id; // O ID na URL é o do Módulo
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 1. Busca os dados do Módulo para verificar se possui mentoria
  const { data: module } = useQuery({
    queryKey: ["module", moduleId],
    queryFn: () => getModule(moduleId as string),
    enabled: !!moduleId,
  });

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

  // Função centralizadora para chamar a API
  const handleStatusChange = async (courseId: string, status: userCourseStatus) => {
    if (!userCandidate?.id) return;

    try {
      await changeCourseStatus({
        id: courseId,
        userId: userCandidate.id,
        status: status
      });
      console.log(`Status do curso ${courseId} atualizado para ${status}`);
    } catch (error) {
      console.error("Erro ao atualizar status", error);
    }
  };

  const sorted =
    (courses ?? []).slice().sort((a, b) => {
      const numA = Number(a.createdAt.match(/\d+/)?.[0] ?? 9999);
      const numB = Number(b.createdAt.match(/\d+/)?.[0] ?? 9999);
      return numA - numB || a.createdAt.localeCompare(b.createdAt);
    });

  return (
    <div className="px-6 py-6">
      <header className="flex justify-between items-center mb-6 border-b pb-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">
            {module?.title || "Cursos"}
          </h1>
          <p className="text-sm text-neutral-500">
            Assista às aulas e acompanhe seu progresso.
          </p>
        </div>

        {/* 3. Validação: Só mostra o botão se o módulo permitir mentoria */}
        {module?.hasMentorship && (
          <Button
            onClick={() => setIsModalOpen(true)}
            className="bg-blue-900 hover:bg-blue-800 text-white rounded-xl gap-2 h-11 px-6 shadow-md"
          >
            <Clock className="h-4 w-4" /> Agendar Mentoria
          </Button>
        )}
      </header>

      {/* Modal de Agendamento */}
      {module && (
        <AppointmentModal
          moduleId={module.id}
          mentorId={module.mentorId} // Pegamos o mentor direto do módulo
          candidateId={userCandidate?.id ?? ""}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      )}

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
          Falha ao carregar cursos. {(error as Error)?.message}
        </div>
      ) : sorted.length === 0 ? (
        <div className="text-neutral-600">Nenhum curso encontrado.</div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {sorted.map((c) => (
            <CourseCard
              key={c.id}
              course={c}
              userId={userCandidate?.id ?? ""}
              onUpdateStatus={(status) => handleStatusChange(c.id, status)}
            />
          ))}
        </div>
      )}
    </div>
  );
}