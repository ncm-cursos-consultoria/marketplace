"use client";

import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import {
  Calendar, Users, BookOpen, Clock,
  ArrowUpRight, AlertCircle, Video, Loader2
} from "lucide-react";
import { UseUserMentor } from "@/context/user-mentor.context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { getMentorshipAppointments, MentorshipAppointmentStatus } from "@/service/mentorship/appointment/get-appointments";
import { format, isSameDay, isAfter, subMinutes } from "date-fns";
import { ptBR } from "date-fns/locale";

export default function MentorHomePage() {
  const { id: mentorId } = useParams();
  const { userMentor } = UseUserMentor();

  // Busca agendamentos reais do mentor
  const { data: appointments, isLoading } = useQuery({
    queryKey: ["mentor-appointments", mentorId],
    queryFn: () => getMentorshipAppointments({ mentorIds: [mentorId as string] }),
    enabled: !!mentorId,
  });

  // Cálculos de métricas baseados nos dados reais
  const stats = {
    today: appointments?.filter(a => isSameDay(new Date(a.startTime), new Date())).length || 0,
    pending: appointments?.filter(a => a.status === MentorshipAppointmentStatus.PENDING).length || 0,
    confirmed: appointments?.filter(a => a.status === MentorshipAppointmentStatus.PAID).length || 0,
  };

  // Filtra os 3 próximos agendamentos confirmados/pagos
  const upcomingAppointments = appointments
    ?.filter(a => a.status === MentorshipAppointmentStatus.PAID)
    .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime())
    .slice(0, 3);
  const completedAppointments = appointments
    ?.filter(a => a.status === MentorshipAppointmentStatus.COMPLETED)

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <section>
        <h1 className="text-3xl font-bold text-gray-900">
          Olá, {userMentor?.firstName || "Mentor"}! 👋
        </h1>
        <p className="text-gray-500 mt-2">
          {stats.today > 0
            ? `Você tem ${stats.today} mentoria(s) agendada(s) para hoje.`
            : "Nenhuma mentoria agendada para hoje até o momento."}
        </p>
      </section>

      {/* Cards de Métricas Reais */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <StatCard
          title="Mentorias Hoje"
          value={stats.today.toString()}
          icon={<Calendar className="h-5 w-5 text-blue-600" />}
          description={`${stats.confirmed} confirmadas hoje`}
        />
        <StatCard
          title="Solicitações Pendentes"
          value={stats.pending.toString()}
          icon={<AlertCircle className="h-5 w-5 text-amber-600" />}
          description="Aguardando sua aprovação"
        />
        <StatCard
          title="Total de Sessões"
          value={completedAppointments?.length.toString() || "0"}
          icon={<Clock className="h-5 w-5 text-purple-600" />}
          description="Histórico completo"
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Próximos Agendamentos Dinâmicos */}
        <Card className="rounded-2xl shadow-sm border-gray-100">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg font-bold">Próximos Agendamentos</CardTitle>
            <Link href={`/br/mentor/${mentorId}/appointment`} className="text-sm text-blue-600 hover:underline inline-flex items-center gap-1">
              Ver gestão completa <ArrowUpRight className="h-3 w-3" />
            </Link>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center py-6"><Loader2 className="animate-spin h-6 w-6 text-blue-900" /></div>
            ) : upcomingAppointments?.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-6">Sem agendamentos próximos.</p>
            ) : (
              <div className="space-y-4">
                {upcomingAppointments?.map((appt) => (
                  <UpcomingItem key={appt.id} appt={appt} />
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Atalhos Rápidos */}
        <Card className="rounded-2xl shadow-sm border-gray-100">
          <CardHeader><CardTitle className="text-lg font-bold">Ações Rápidas</CardTitle></CardHeader>
          <CardContent className="grid gap-4">
            <QuickActionLink
              href={`/br/mentor/${mentorId}/appointment`} // Link para a página de gestão que criamos
              title="Aprovar Solicitações"
              subtitle={`Você possui ${stats.pending} solicitações aguardando resposta.`}
              highlight={stats.pending > 0}
            />
            <QuickActionLink
              href={`/br/mentor/${mentorId}/availability`}
              title="Minha Disponibilidade"
              subtitle="Configure seus horários de atendimento."
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Subcomponente para itens da agenda com lógica de tempo
function UpcomingItem({ appt }: { appt: any }) {
  const startTime = new Date(appt.startTime);
  const isAvailable = isAfter(new Date(), subMinutes(startTime, 10));

  return (
    <div className="flex items-center gap-4 p-3 rounded-xl bg-gray-50">
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold truncate">Sessão Agendada</p>
        <p className="text-xs text-gray-500">
          {format(startTime, "dd/MM 'às' HH:mm", { locale: ptBR })}
        </p>
      </div>
      {isAvailable && appt.meetingUrl ? (
        <button
          onClick={() => window.open(appt.meetingUrl, "_blank")}
          className="p-2 rounded-lg bg-blue-100 text-blue-700 hover:bg-blue-200 transition-colors"
        >
          <Video className="h-4 w-4" />
        </button>
      ) : (
        <Clock className="h-4 w-4 text-gray-300" />
      )}
    </div>
  );
}

function StatCard({ title, value, icon, description }: any) {
  return (
    <Card className="rounded-2xl shadow-sm border-gray-100">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-gray-500">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-gray-400 mt-1">{description}</p>
      </CardContent>
    </Card>
  );
}

function QuickActionLink({ href, title, subtitle, highlight }: any) {
  return (
    <Link href={href} className={`group p-4 rounded-xl border transition-all ${highlight ? 'border-amber-200 bg-amber-50' : 'border-gray-100 hover:border-blue-200 hover:bg-blue-50'}`}>
      <h4 className={`font-semibold transition-colors ${highlight ? 'text-amber-900' : 'text-gray-900 group-hover:text-blue-900'}`}>{title}</h4>
      <p className="text-xs text-gray-500 mt-1">{subtitle}</p>
    </Link>
  );
}