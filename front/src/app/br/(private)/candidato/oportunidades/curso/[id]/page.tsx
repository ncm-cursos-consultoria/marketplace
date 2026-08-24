"use client";

import { useState, useRef, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import YouTube, { YouTubeEvent, YouTubeProps } from "react-youtube"; // Import novo
import { UseUserCandidate } from "@/context/user-candidate.context";
import { getCourses } from "@/service/course/get-courses";
import { changeCourseStatus, userCourseStatus } from "@/service/course/change-status";
import { downloadCertificateForModule } from "@/service/certificate/download-certificate";
import { Button } from "@/components/ui/button";
import { Clock, Award, Lock, Loader2 } from "lucide-react";
import { AppointmentModal } from "@/components/mentorship/appointment-modal";
import { UpgradeCandidateModal } from "@/components/candidate/upgrade-candidate-modal";
import { getModule } from "@/service/module/get-module";
import { toast } from "sonner";

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

// --- BARRA DE PROGRESSO DO MÓDULO ---
// Puramente visual: mostra quantas aulas já foram concluídas / total.
// Não influencia em nenhuma regra de certificado (isso é calculado à parte).
function ModuleProgressBar({ finished, total }: { finished: number; total: number }) {
  if (total === 0) return null;

  const percent = Math.round((finished / total) * 100);

  return (
    <div className="mt-3 w-full max-w-sm">
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs font-medium text-neutral-600">
          {finished} de {total} aula{total > 1 ? "s" : ""} concluída{finished !== 1 ? "s" : ""}
        </span>
        <span className="text-xs font-semibold text-blue-900">{percent}%</span>
      </div>
      <div className="h-2 w-full rounded-full bg-neutral-200 overflow-hidden">
        <div
          className="h-full rounded-full bg-blue-900 transition-all duration-500 ease-out"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
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
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);
  const [isDownloadingCertificate, setIsDownloadingCertificate] = useState(false);

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

  // Progresso do módulo - só visual, não interfere na regra do certificado
  const totalCoursesCount = sorted.length;
  const finishedCoursesCount = sorted.filter((c) => c.status === "FINISHED").length;

  // Certificado do módulo só libera quando TODAS as aulas estão concluídas
  const allCoursesFinished =
    sorted.length > 0 && sorted.every((c) => c.status === "FINISHED");

  const hasCertificatePlan =
    userCandidate?.plan === "STANDARD" || userCandidate?.plan === "PREMIUM";

  const handleCertificateClick = async () => {
    if (!moduleId) return;

    // Ainda faltam aulas: botão fica bloqueado, não faz nada ao clicar
    if (!allCoursesFinished) {
      toast.error("Conclua todas as aulas do módulo para liberar o certificado.");
      return;
    }

    // Candidato BASIC: leva para a tela de pagamento (modal de upgrade)
    if (!hasCertificatePlan) {
      setIsUpgradeModalOpen(true);
      return;
    }

    // Candidato STANDARD/PREMIUM: gera e baixa o PDF automaticamente
    try {
      setIsDownloadingCertificate(true);
      const blob = await downloadCertificateForModule(moduleId);

      const url = window.URL.createObjectURL(new Blob([blob]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        `certificado_${(module?.title ?? "modulo").replace(/ /g, "_")}.pdf`
      );
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err: any) {
      const status = err?.response?.status;
      if (status === 403) {
        toast.error("Seu plano atual não permite emitir certificado.");
        setIsUpgradeModalOpen(true);
      } else if (status === 400) {
        toast.error("Você ainda não concluiu todas as aulas deste módulo.");
      } else {
        toast.error("Não foi possível gerar o certificado. Tente novamente.");
      }
    } finally {
      setIsDownloadingCertificate(false);
    }
  };

  return (
    <div className="px-6 py-6">
      <header className="flex justify-between items-start mb-6 border-b pb-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">
            {module?.title || "Cursos"}
          </h1>
          <p className="text-sm text-neutral-500">
            Assista às aulas e acompanhe seu progresso.
          </p>

          {/* Barra de progresso do módulo - puramente visual */}
          <ModuleProgressBar finished={finishedCoursesCount} total={totalCoursesCount} />
        </div>

        <div className="flex items-center gap-3">
          {/* Botão de certificado - aparece sempre que o módulo tem aulas.
              Fica bloqueado até todas as aulas serem concluídas; depois disso,
              segue a regra de plano (BASIC -> upgrade, STANDARD/PREMIUM -> download). */}
          {sorted.length > 0 && (
            <Button
              onClick={handleCertificateClick}
              disabled={isDownloadingCertificate || !allCoursesFinished}
              variant={allCoursesFinished && hasCertificatePlan ? "default" : "outline"}
              title={
                !allCoursesFinished
                  ? "Conclua todas as aulas do módulo para liberar o certificado"
                  : undefined
              }
              className={
                allCoursesFinished && hasCertificatePlan
                  ? "bg-blue-900 hover:bg-blue-800 text-white rounded-xl gap-2 h-11 px-6 shadow-md"
                  : "text-blue-900 border-blue-900/30 hover:bg-blue-50 rounded-xl gap-2 h-11 px-6 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent"
              }
            >
              {isDownloadingCertificate ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Gerando certificado...
                </>
              ) : !allCoursesFinished ? (
                <>
                  <Lock className="h-4 w-4" /> Certificado bloqueado
                </>
              ) : hasCertificatePlan ? (
                <>
                  <Award className="h-4 w-4" /> Emitir certificado
                </>
              ) : (
                <>
                  <Lock className="h-4 w-4" /> Emitir certificado
                </>
              )}
            </Button>
          )}

          {/* Só mostra o botão de mentoria se o módulo permitir mentoria */}
          {module?.hasMentorship && (
            <Button
              onClick={() => setIsModalOpen(true)}
              className="bg-blue-900 hover:bg-blue-800 text-white rounded-xl gap-2 h-11 px-6 shadow-md"
            >
              <Clock className="h-4 w-4" /> Agendar Mentoria
            </Button>
          )}
        </div>
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

      {/* Modal de upgrade de plano - usado quando um candidato BASIC clica em emitir certificado */}
      <UpgradeCandidateModal
        isOpen={isUpgradeModalOpen}
        setIsOpen={setIsUpgradeModalOpen}
        userId={userCandidate?.id ?? ""}
      />

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