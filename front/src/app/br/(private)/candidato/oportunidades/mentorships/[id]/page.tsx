"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import {
  Clock, Video, CreditCard,
  AlertCircle, CheckCircle2,
  X,
  XCircle,
  Loader2
} from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { format, isAfter, subMinutes } from "date-fns";
import { ptBR } from "date-fns/locale";
import { getMentorshipAppointments, MentorshipAppointmentResponse, MentorshipAppointmentStatus } from "@/service/mentorship/appointment/get-appointments";
import { getModule } from "@/service/module/get-module";
import { getMentorById } from "@/service/user/mentor/get-mentor";
import { updateAppointmentStatus } from "@/service/mentorship/appointment/update-status";
import { toast } from "sonner";
import { createCheckoutSession } from "@/service/subscription/pay-mentorship";

// Mapeamento visual atualizado com os novos status
const STATUS_MAP: Record<string | number, { label: string; color: string; icon: React.ReactNode }> = {
  [MentorshipAppointmentStatus.PENDING]: {
    label: "Nova Solicitação",
    color: "bg-amber-100 text-amber-700",
    icon: <AlertCircle className="h-4 w-4" />
  },
  [MentorshipAppointmentStatus.CONFIRMED]: {
    label: "Aguardando Pagamento",
    color: "bg-blue-100 text-blue-700",
    icon: <Clock className="h-4 w-4" />
  },
  [MentorshipAppointmentStatus.PAID]: {
    label: "Confirmado & Pago",
    color: "bg-emerald-100 text-emerald-700",
    icon: <CheckCircle2 className="h-4 w-4" />
  },
  [MentorshipAppointmentStatus.CANCELED_BY_CANDIDATE]: {
    label: "Cancelado por você",
    color: "bg-red-100 text-red-700",
    icon: <X className="h-4 w-4" />
  },
  [MentorshipAppointmentStatus.CANCELED_BY_MENTOR]: {
    label: "Cancelado pelo Mentor",
    color: "bg-gray-100 text-gray-600",
    icon: <X className="h-4 w-4" />
  },
  [MentorshipAppointmentStatus.COMPLETED]: {
    label: "Concluída",
    color: "bg-slate-100 text-slate-700",
    icon: <CheckCircle2 className="h-4 w-4" />
  }
};

function MentorshipCard({ appt }: { appt: MentorshipAppointmentResponse }) {
  const queryClient = useQueryClient();
  // Busca os detalhes do módulo para obter título e nome do mentor
  const { data: module, isLoading } = useQuery({
    queryKey: ["module-details", appt.moduleId],
    queryFn: () => getModule(appt.moduleId),
    enabled: !!appt.moduleId,
  });

  const { data: mentor, isLoading: isLoadingMentor } = useQuery({
    queryKey: ["mentor-details", appt.mentorId], // Chave única para o mentor
    queryFn: () => getMentorById(appt.mentorId), // Função de serviço correta
    enabled: !!appt.mentorId,
  });

  const { mutate: cancelMentorship, isPending: isCanceling } = useMutation({
    mutationFn: () => updateAppointmentStatus(appt.id, MentorshipAppointmentStatus.CANCELED_BY_CANDIDATE),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["candidate-mentorships"] });
      toast.success("Cancelado com sucesso!");
    }
  });

  const { mutate: handlePayment, isPending: isPaying } = useMutation({
    mutationFn: () => createCheckoutSession(appt.id),
    onSuccess: (data) => {
      if (data.checkoutUrl) {
        // Abre o Stripe em uma nova aba
        window.open(data.checkoutUrl, '_blank');
      }
    }
  });

  const canCancel = appt.status === MentorshipAppointmentStatus.PENDING ||
    appt.status === MentorshipAppointmentStatus.CONFIRMED;

  const status = STATUS_MAP[appt.status as keyof typeof STATUS_MAP] || STATUS_MAP.PENDING;

  const now = new Date();
  const startTime = new Date(appt.startTime);
  const tenMinutesBefore = subMinutes(startTime, 10);
  const isLinkAvailable = isAfter(now, tenMinutesBefore);

  return (
    <Card className="group relative overflow-hidden border-slate-200 rounded-3xl transition-all hover:shadow-xl hover:border-blue-100 bg-white">
      <CardContent className="p-0">
        <div className="flex flex-col md:flex-row items-stretch md:items-center">

          {/* Lado Esquerdo: Data */}
          <div className="bg-slate-50 md:w-40 flex flex-row md:flex-col items-center justify-center p-6 gap-2 border-b md:border-b-0 md:border-r border-slate-100">
            <span className="text-3xl font-black text-blue-900">
              {format(new Date(appt.startTime), "dd")}
            </span>
            <div className="flex flex-col items-center">
              <span className="text-xs font-bold uppercase tracking-widest text-slate-400">
                {format(new Date(appt.startTime), "MMM", { locale: ptBR })}
              </span>
              <span className="text-sm font-medium text-slate-600">
                {format(new Date(appt.startTime), "HH:mm")}
              </span>
            </div>
          </div>

          {/* Conteúdo: Detalhes do Módulo e Mentor */}
          <div className="flex-1 p-6 space-y-2">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className={`${status.color} px-2.5 py-0.5 rounded-full flex items-center gap-1.5 font-bold text-[10px] uppercase tracking-wider`}>
                {status.icon}
                {status.label}
              </Badge>
            </div>

            {isLoading || isLoadingMentor ? (
              <div className="space-y-2">
                <div className="h-6 w-48 bg-slate-100 animate-pulse rounded" />
                <div className="h-4 w-32 bg-slate-50 animate-pulse rounded" />
              </div>
            ) : (
              <>
                <h3 className="text-xl font-bold text-slate-900">
                  {module?.title || "Mentoria Técnica"}
                </h3>
                <p className="text-sm text-slate-500 font-medium">
                  Mentor: <span className="text-blue-900">
                    {/* Corrigido: Interpolação de nome com template string */}
                    {mentor ? `${mentor.firstName} ${mentor.lastName}` : "Carregando..."}
                  </span>
                </p>
              </>
            )}
          </div>

          {/* Ações Dinâmicas */}
          <div className="p-6 md:pr-8 flex flex-col justify-center items-start md:items-end gap-3">

            {/* Botão de Pagamento */}
            {appt.status === MentorshipAppointmentStatus.CONFIRMED && (
              <Button
                onClick={() => handlePayment()}
                disabled={isPaying}
                className="bg-blue-900 hover:bg-blue-800 text-white rounded-2xl gap-2 font-bold px-8 h-12 shadow-lg shadow-blue-900/20"
              >
                {isPaying ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    <CreditCard className="h-4 w-4" /> Efetuar Pagamento
                  </>
                )}
              </Button>
            )}

            {appt.status === MentorshipAppointmentStatus.PAID && (
              <div className="flex flex-col items-center md:items-end gap-1">
                <Button
                  variant="outline"
                  className="rounded-2xl gap-2 font-bold h-12 border-emerald-200 text-emerald-700 bg-emerald-50 hover:bg-emerald-100 disabled:opacity-50"
                  onClick={() => appt.meetingUrl && window.open(appt.meetingUrl, '_blank')}
                  // O botão fica desabilitado se não houver URL OU se ainda não estiver no horário
                  disabled={!appt.meetingUrl || !isLinkAvailable}
                >
                  <Video className="h-4 w-4" />
                  {!isLinkAvailable
                    ? "Link disponível em breve"
                    : appt.meetingUrl
                      ? "Entrar na Sala"
                      : "Gerando link..."
                  }
                </Button>

                {/* Feedback visual opcional para o aluno saber quando libera */}
                {!isLinkAvailable && (
                  <span className="text-[10px] text-slate-400 font-medium">
                    Disponível 10 min antes do horário marcado
                  </span>
                )}
              </div>
            )}

            {/* Botão de Cancelamento Coeso */}
            {canCancel && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full md:w-auto rounded-2xl gap-2 font-bold h-12 border-red-100 text-red-500 hover:bg-red-50 transition-all"
                  >
                    <XCircle className="h-4 w-4" /> Cancelar Mentoria
                  </Button>
                </AlertDialogTrigger>

                <AlertDialogContent className="rounded-3xl border-none p-8">
                  <AlertDialogHeader>
                    <AlertDialogTitle className="text-xl font-bold text-slate-900">Confirmar Cancelamento?</AlertDialogTitle>
                    <AlertDialogDescription className="text-slate-500">
                      Ao confirmar, o horário selecionado ficará disponível para outros candidatos. Esta ação não pode ser revertida.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter className="mt-6 gap-3">
                    <AlertDialogCancel className="rounded-2xl h-12 font-bold border-slate-200 text-slate-500">Voltar</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => cancelMentorship()}
                      className="bg-red-600 hover:bg-red-700 text-white rounded-2xl h-12 font-bold px-8"
                    >
                      Sim, Cancelar
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function CandidateMentorshipsPage() {
  const { id: candidateId } = useParams();

  const { data: appointments, isLoading } = useQuery({
    queryKey: ["candidate-mentorships"],
    queryFn: () => getMentorshipAppointments({ candidateIds: [candidateId as string] }),
    enabled: !!candidateId,
  });

  return (
    <div className="p-6 md:p-10 max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500">
      <header className="flex flex-col gap-2">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3">
          <Clock className="h-8 w-8 text-blue-900" /> Minhas Mentorias
        </h1>
        <p className="text-slate-500">
          Gerencie seus agendamentos. Verifique o status e acesse o link das reuniões confirmadas.
        </p>
      </header>

      <div className="grid gap-6">
        {isLoading ? (
          <div className="flex justify-center py-20">
            <div className="h-8 w-8 border-4 border-blue-900/20 border-t-blue-900 rounded-full animate-spin" />
          </div>
        ) : appointments?.length === 0 ? (
          <div className="text-center py-24 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200 text-slate-400">
            Nenhuma mentoria agendada até o momento.
          </div>
        ) : (
          appointments?.map((appt) => (
            <MentorshipCard key={appt.id} appt={appt} />
          ))
        )}
      </div>
    </div>
  );
}