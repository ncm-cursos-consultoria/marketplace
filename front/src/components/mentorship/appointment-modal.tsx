"use client";

import { useState, useMemo } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import {
  format,
  addHours,
  parse,
  isSameDay,
  getDay,
  setHours,
  setMinutes,
  startOfHour
} from "date-fns";
import { ptBR } from "date-fns/locale";
import { Calendar as CalendarIcon, Clock, Loader2, CheckCircle, ChevronRight } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar"; // Componente do Shadcn
import { toast } from "sonner";
import { createMentorshipAppointment } from "@/service/mentorship/appointment/post-appointment";
import { getMentorSchedule, WorkHour } from "@/service/mentorship/get-schedule";
import { getModule } from "@/service/module/get-module";
import { getMentorshipAppointments, MentorshipAppointmentStatus } from "@/service/mentorship/appointment/get-appointments";

interface AppointmentModalProps {
  moduleId: string;
  mentorId: string;
  candidateId: string;
  isOpen: boolean;
  onClose: () => void;
}

const DAY_MAP: Record<string, number> = {
  SUNDAY: 0, MONDAY: 1, TUESDAY: 2, WEDNESDAY: 3, THURSDAY: 4, FRIDAY: 5, SATURDAY: 6
};

export function AppointmentModal({ moduleId, mentorId, candidateId, isOpen, onClose }: AppointmentModalProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedSlot, setSelectedSlot] = useState<{ start: string; end: string } | null>(null);

  const { data: module } = useQuery({
    queryKey: ["module", moduleId],
    queryFn: () => getModule(moduleId),
    enabled: isOpen,
  });

  const { data: schedule, isLoading: isLoadingSchedule } = useQuery({
    queryKey: ["mentor-schedule", mentorId],
    queryFn: () => getMentorSchedule(mentorId),
    enabled: isOpen,
  });

  // Identifica quais dias da semana o mentor atende para habilitar no calendário
  const enabledDays = useMemo(() => {
    return schedule?.workHours?.map(wh => DAY_MAP[wh.dayOfWeek]) || [];
  }, [schedule]);

  const { data: existingAppointments } = useQuery({
    queryKey: ["mentor-appointments", mentorId],
    queryFn: () => getMentorshipAppointments({ mentorIds: [mentorId] }),
    enabled: isOpen,
    staleTime: 0, // Força a buscar dados novos sempre que o componente montar/abrir
    refetchOnWindowFocus: true
  });

  // Gera slots de 1 hora baseados no dia selecionado
  const availableTimeSlots = useMemo(() => {
    if (!selectedDate || !schedule?.workHours) return [];

    const dayName = Object.keys(DAY_MAP).find(key => DAY_MAP[key] === getDay(selectedDate));
    const workHour = schedule.workHours.find(wh => wh.dayOfWeek === dayName);

    if (!workHour) return [];

    const slots = [];
    let current = parse(workHour.startTime, "HH:mm:ss", selectedDate);
    const end = parse(workHour.endTime, "HH:mm:ss", selectedDate);

    while (addHours(current, 1) <= end) {
      const slotStart = current;

      const slotEnd = addHours(current, 1);

      const isOccupied = existingAppointments?.some(appt => {
        const apptStart = new Date(appt.startTime).getTime();
        const apptEnd = new Date(appt.endTime).getTime();
        const slotStartTimestamp = slotStart.getTime();
        const slotEndTimestamp = slotEnd.getTime();
        const isCanceled = appt.status.includes(MentorshipAppointmentStatus.CANCELED_BY_CANDIDATE || MentorshipAppointmentStatus.CANCELED_BY_MENTOR);

        return !isCanceled && slotStartTimestamp < apptEnd && slotEndTimestamp > apptStart;
      });

      // Só adicionamos o slot se ele NÃO estiver ocupado
      if (!isOccupied) {
        slots.push({
          display: `${format(slotStart, "HH:mm")} - ${format(slotEnd, "HH:mm")}`,
          start: slotStart.toISOString(),
          end: slotEnd.toISOString()
        });
      }

      current = addHours(current, 1);
    }
    return slots;
  }, [selectedDate, schedule, existingAppointments]);

  const { mutateAsync: confirmAppointment, isPending } = useMutation({
    mutationFn: () => createMentorshipAppointment({
      candidateId,
      moduleId,
      startTime: selectedSlot!.start,
      endTime: selectedSlot!.end
    }),
    onSuccess: () => {
      toast.success("Mentoria solicitada com sucesso! Aguardando o mentor aceitar.");
      onClose();
    }
  });

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px] rounded-2xl p-0 overflow-hidden">
        <div className="flex flex-col md:flex-row h-[550px]">

          {/* Lado Esquerdo: Calendário */}
          <div className="flex-1 p-6 border-r bg-gray-50/50">
            <DialogHeader className="mb-4">
              <DialogTitle className="flex items-center gap-2 text-blue-900">
                <CalendarIcon className="h-5 w-5" /> Selecione o Dia
              </DialogTitle>
            </DialogHeader>

            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={(date) => {
                setSelectedDate(date);
                setSelectedSlot(null);
              }}
              locale={ptBR}
              disabled={(date) =>
                date < new Date() || !enabledDays.includes(getDay(date))
              }
              className="rounded-md border bg-white"
            />
          </div>

          {/* Lado Direito: Slots de Horário */}
          <div className="w-full md:w-[300px] p-6 flex flex-col">
            <header className="mb-4">
              <h3 className="font-bold text-blue-900 flex items-center gap-2">
                <Clock className="h-5 w-5" /> Horários
              </h3>

              {/* Exibição do Valor da Mentoria */}
              <div className="mt-2 p-3 bg-blue-50 rounded-xl border border-blue-100">
                <p className="text-[10px] uppercase font-bold text-blue-400 leading-none">Investimento por hora</p>
                <p className="text-lg font-black text-blue-900">
                  {module?.mentorshipValuePerHour
                    ? new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format((module.mentorshipValuePerHour * (1 + (0.16 + 0.30))))
                    : "Grátis"
                  }
                </p>
              </div>
            </header>

            <div className="flex-1 overflow-y-auto space-y-2 pr-2">
              {!selectedDate ? (
                <p className="text-sm text-center py-20 text-gray-400">Selecione um dia para ver os horários</p>
              ) : availableTimeSlots.length > 0 ? (
                availableTimeSlots.map((slot, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedSlot(slot)}
                    className={`w-full p-3 text-sm font-medium rounded-xl border transition-all flex items-center justify-between ${selectedSlot?.start === slot.start
                      ? "border-blue-600 bg-blue-50 text-blue-700 ring-1 ring-blue-600"
                      : "border-gray-100 hover:border-blue-300 bg-white"
                      }`}
                  >
                    {slot.display}
                    {selectedSlot?.start === slot.start && <CheckCircle className="h-4 w-4" />}
                  </button>
                ))
              ) : (
                <p className="text-sm text-center py-20 text-gray-400">Nenhum slot de 1h disponível neste período.</p>
              )}
            </div>

            <DialogFooter className="mt-4 pt-4 border-t">
              <Button
                className="w-full bg-blue-900 hover:bg-blue-800 rounded-xl"
                disabled={!selectedSlot || isPending}
                onClick={() => confirmAppointment()}
              >
                {isPending ? <Loader2 className="animate-spin h-4 w-4" /> : "Agendar"}
              </Button>
            </DialogFooter>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}