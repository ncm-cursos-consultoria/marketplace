"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { format, isAfter, isBefore, subMinutes } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  Check, X, Clock, Calendar as CalendarIcon,
  Video, User, AlertCircle, CheckCircle2, Loader2
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  getMentorshipAppointments,
  MentorshipAppointmentStatus,
  MentorshipAppointmentResponse
} from "@/service/mentorship/appointment/get-appointments";
import { updateAppointmentStatus } from "@/service/mentorship/appointment/update-status";
import { getModule } from "@/service/module/get-module";
import { getUniqueUser } from "@/service/user/get-unique-user";
import { useMemo } from "react";
import { enterMentorMentorshipAppointment } from "@/service/mentorship/appointment/enter-appointment";

// Mapeamento visual utilizando o Enum como chave
const STATUS_THEME: Record<string | number, { label: string; color: string; icon: React.ReactNode }> = {
  [MentorshipAppointmentStatus.PENDING]: {
    label: "Nova Solicitação", color: "bg-amber-100 text-amber-700", icon: <AlertCircle className="h-4 w-4" />
  },
  [MentorshipAppointmentStatus.CONFIRMED]: {
    label: "Aguardando Pagamento", color: "bg-blue-100 text-blue-700", icon: <Clock className="h-4 w-4" />
  },
  [MentorshipAppointmentStatus.PAID]: {
    label: "Confirmado & Pago", color: "bg-emerald-100 text-emerald-700", icon: <CheckCircle2 className="h-4 w-4" />
  },
  [MentorshipAppointmentStatus.CANCELED_BY_CANDIDATE]: {
    label: "Cancelado pelo Aluno", color: "bg-red-100 text-red-700", icon: <X className="h-4 w-4" />
  },
  [MentorshipAppointmentStatus.CANCELED_BY_MENTOR]: {
    label: "Cancelado por Você", color: "bg-gray-100 text-gray-600", icon: <X className="h-4 w-4" />
  },
};

export default function MentorAppointmentsPage() {
  const { id: mentorId } = useParams();
  const queryClient = useQueryClient();

  const { data: appointments, isLoading } = useQuery({
    queryKey: ["mentor-appointments", mentorId],
    queryFn: () => getMentorshipAppointments({ mentorIds: [mentorId as string] }),
    enabled: !!mentorId,
    refetchInterval: 60000,
  });

  const organizedAppointments = useMemo(() => {
    if (!appointments) return { actionRequired: [], upcoming: [], waiting: [], history: [] };

    return {
      // Prioridade 1: Mentor precisa Aceitar ou Recusar
      actionRequired: appointments.filter(a => a.status === MentorshipAppointmentStatus.PENDING),

      // Prioridade 2: Pagas e prontas para iniciar (Upcoming)
      upcoming: appointments.filter(a => a.status === MentorshipAppointmentStatus.PAID),

      // Prioridade 3: Aceitas, mas aguardando pagamento do aluno
      waiting: appointments.filter(a => a.status === MentorshipAppointmentStatus.CONFIRMED),

      // Prioridade 4: Finalizadas ou Canceladas
      history: appointments.filter(a =>
        a.status === MentorshipAppointmentStatus.COMPLETED ||
        a.status === MentorshipAppointmentStatus.CANCELED_BY_CANDIDATE ||
        a.status === MentorshipAppointmentStatus.CANCELED_BY_MENTOR
      ),
    };
  }, [appointments]);

  const { mutate: handleStatusUpdate, isPending: isUpdating } = useMutation({
    mutationFn: ({ id, status }: { id: string; status: MentorshipAppointmentStatus }) => updateAppointmentStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["mentor-appointments", mentorId] });
      toast.success("Status atualizado com sucesso!");
    },
    onError: () => toast.error("Erro ao atualizar status."),
  });

  if (isLoading) return (
    <div className="p-10 flex justify-center">
      <Loader2 className="animate-spin h-8 w-8 text-blue-900" />
    </div>
  );

  return (
    <div className="p-6 md:p-10 max-w-5xl mx-auto space-y-10 animate-in fade-in duration-500">
      <header>
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
          <CalendarIcon className="h-8 w-8 text-blue-900" /> Gestão de Mentorias
        </h1>
        <p className="text-muted-foreground mt-2">Gerencie suas sessões por ordem de prioridade.</p>
      </header>

      {/* SEÇÃO 1: Ações Necessárias (PENDING) */}
      {organizedAppointments.actionRequired.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-amber-600 flex items-center gap-2">
            <AlertCircle className="h-4 w-4" /> Solicitações para Aprovar
          </h2>
          <div className="grid gap-4">
            {organizedAppointments.actionRequired.map((appt) => (
              <AppointmentMentorCard key={appt.id} appt={appt} isUpdating={isUpdating} onUpdate={handleStatusUpdate} />
            ))}
          </div>
        </section>
      )}

      {/* SEÇÃO 2: Agendadas & Pagas (PAID) */}
      {organizedAppointments.upcoming.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-emerald-600 flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4" /> Próximas Mentorias (Pagas)
          </h2>
          <div className="grid gap-4">
            {organizedAppointments.upcoming.map((appt) => (
              <AppointmentMentorCard key={appt.id} appt={appt} isUpdating={isUpdating} onUpdate={handleStatusUpdate} />
            ))}
          </div>
        </section>
      )}

      {/* SEÇÃO 3: Aguardando Aluno (CONFIRMED) */}
      {organizedAppointments.waiting.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-blue-600 flex items-center gap-2">
            <Clock className="h-4 w-4" /> Aguardando Pagamento do Aluno
          </h2>
          <div className="grid gap-4 opacity-80">
            {organizedAppointments.waiting.map((appt) => (
              <AppointmentMentorCard key={appt.id} appt={appt} isUpdating={isUpdating} onUpdate={handleStatusUpdate} />
            ))}
          </div>
        </section>
      )}

      {/* SEÇÃO 4: Histórico */}
      {organizedAppointments.history.length > 0 && (
        <section className="space-y-4 pt-6 border-t">
          <h2 className="text-sm font-bold uppercase tracking-wider text-gray-400">Histórico</h2>
          <div className="grid gap-4 opacity-60">
            {organizedAppointments.history.map((appt) => (
              <AppointmentMentorCard key={appt.id} appt={appt} isUpdating={isUpdating} onUpdate={handleStatusUpdate} />
            ))}
          </div>
        </section>
      )}

      {appointments?.length === 0 && (
        <div className="text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed">
          <p className="text-gray-400">Nenhum agendamento para exibir.</p>
        </div>
      )}
    </div>
  );
}

// Subcomponente para gerenciar a busca de detalhes de cada agendamento
function AppointmentMentorCard({
  appt,
  isUpdating,
  onUpdate
}: {
  appt: MentorshipAppointmentResponse;
  isUpdating: boolean;
  onUpdate: (data: { id: string, status: MentorshipAppointmentStatus }) => void
}) {
  // Busca detalhes do módulo para mostrar o título correto no card do mentor
  const { data: module } = useQuery({
    queryKey: ["module", appt.moduleId],
    queryFn: () => getModule(appt.moduleId),
    enabled: !!appt.moduleId,
  });

  const { data: candidate, isLoading: isLoadingCandidate } = useQuery({
    queryKey: ["user", appt.candidateId],
    queryFn: () => getUniqueUser(appt.candidateId),
    enabled: !!appt.candidateId,
  });

  const theme = STATUS_THEME[appt.status] || STATUS_THEME[MentorshipAppointmentStatus.PENDING];
  const isPending = appt.status === MentorshipAppointmentStatus.PENDING;
  const isPaid = appt.status === MentorshipAppointmentStatus.PAID;
  const isCanceled =
    appt.status === MentorshipAppointmentStatus.CANCELED_BY_CANDIDATE ||
    appt.status === MentorshipAppointmentStatus.CANCELED_BY_MENTOR;

  const now = new Date();
  const startTime = new Date(appt.startTime);
  const endTime = new Date(appt.endTime);
  const tenMinutesBefore = subMinutes(startTime, 10);

  // Define se o botão de "Iniciar" deve estar habilitado
  const isMeetingTime = isAfter(now, tenMinutesBefore) && isBefore(now, endTime);

  return (
    <Card className={`rounded-3xl border-none shadow-sm transition-all hover:shadow-md ${isPending ? 'ring-2 ring-amber-400 ring-offset-2' : 'bg-white'}`}>
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row md:items-center gap-6">

          {/* Calendário Lateral */}
          <div className="flex flex-row md:flex-col items-center justify-center bg-slate-50 p-4 rounded-2xl min-w-[100px] gap-1">
            <span className="text-2xl font-black text-blue-900">{format(new Date(appt.startTime), "dd")}</span>
            <span className="text-xs font-bold uppercase text-slate-400">{format(new Date(appt.startTime), "MMM", { locale: ptBR })}</span>
            <span className="text-sm font-medium text-slate-600">{format(new Date(appt.startTime), "HH:mm")}</span>
          </div>

          {/* Informações Centrais */}
          <div className="flex-1 space-y-2">
            <Badge variant="outline" className={`${theme.color} border-none px-3 py-1 flex w-fit items-center gap-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider`}>
              {theme.icon} {theme.label}
            </Badge>
            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <User className="h-4 w-4 text-slate-400" />
              Aluno: {isLoadingCandidate ? "Carregando..." : `${candidate?.firstName} ${candidate?.lastName}`}
            </h3>
            <p className="text-sm text-slate-500 italic">Módulo: {module?.title || "Carregando..."}</p>
          </div>

          {/* Ações Dinâmicas */}
          <div className="flex items-center gap-3">
            {isPending ? (
              <>
                <Button
                  onClick={() => onUpdate({ id: appt.id, status: MentorshipAppointmentStatus.CONFIRMED })}
                  disabled={isUpdating}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl gap-2 px-6 h-11 font-bold"
                >
                  <Check className="h-4 w-4" /> Aceitar
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => onUpdate({ id: appt.id, status: MentorshipAppointmentStatus.CANCELED_BY_MENTOR })}
                  disabled={isUpdating}
                  className="text-red-600 hover:bg-red-50 rounded-xl h-11 font-bold"
                >
                  <X className="h-4 w-4" /> Recusar
                </Button>
              </>
            ) : isPaid && appt.meetingUrl ? (
              <div className="flex flex-col items-end gap-1">
                <Button
                  onClick={() => {window.open(appt.meetingUrl, "_blank") && enterMentorMentorshipAppointment(appt.id)}}
                  disabled={!isMeetingTime}
                  className="bg-blue-900 hover:bg-blue-800 text-white rounded-xl gap-2 h-11 px-6 shadow-lg shadow-blue-900/20 font-bold disabled:opacity-50 disabled:bg-slate-400"
                >
                  <Video className="h-4 w-4" />
                  {isMeetingTime ? "Iniciar Mentoria" : "Iniciar em breve"}
                </Button>

                {!isMeetingTime && (
                  <span className="text-[10px] text-slate-400 font-medium italic">
                    Liberado 10 min antes do início
                  </span>
                )}
              </div>
            ) : isCanceled ? (
              <span className="text-xs text-slate-400 font-medium italic">Cancelado</span>
            ) : (
              <span className="text-xs text-slate-400 font-medium italic">Aguardando próximas etapas...</span>
            )}
          </div>

        </div>
      </CardContent>
    </Card>
  );
}