"use client";

import { useEffect, useState } from "react";
import {
  Clock,
  Save,
  Plus,
  Trash2,
  AlertCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { AvailabilitySlot, MentorAvailabilityRequest, saveMentorAvailability } from "@/service/mentorship/availability/add-availability";
import { UseUserMentor } from "@/context/user-mentor.context";
import { useQuery } from "@tanstack/react-query";
import { getMentorAvailability } from "@/service/mentorship/availability/get-availability";

// Definição estática dos dias
const DAYS_OF_WEEK = [
  { id: "MONDAY", label: "Segunda-feira" },
  { id: "TUESDAY", label: "Terça-feira" },
  { id: "WEDNESDAY", label: "Quarta-feira" },
  { id: "THURSDAY", label: "Quinta-feira" },
  { id: "FRIDAY", label: "Sexta-feira" },
  { id: "SATURDAY", label: "Sábado" },
  { id: "SUNDAY", label: "Domingo" },
] as const;

type DayId = typeof DAYS_OF_WEEK[number]["id"];

interface TimeSlot {
  start: string;
  end: string;
}

interface DayAvailability {
  active: boolean;
  slots: TimeSlot[];
}

// Mapeamento completo do estado
type AvailabilityState = Record<DayId, DayAvailability>;

export default function MentorAvailabilityPage() {
  const [isSaving, setIsSaving] = useState(false);
  const mentor = UseUserMentor();
  const mentorId = mentor.userMentor?.id

  // 1. Definição da Query
  const { data: remoteAvailability, isLoading } = useQuery({
    queryKey: ["mentor-availability", mentorId],
    queryFn: () => getMentorAvailability({ mentorIds: [mentorId as string] }),
    enabled: !!mentorId,
  });

  // Objeto molde para garantir que todos os dias existam no estado
  const initialState: AvailabilityState = {
    MONDAY: { active: false, slots: [] },
    TUESDAY: { active: false, slots: [] },
    WEDNESDAY: { active: false, slots: [] },
    THURSDAY: { active: false, slots: [] },
    FRIDAY: { active: false, slots: [] },
    SATURDAY: { active: false, slots: [] },
    SUNDAY: { active: false, slots: [] },
  };

  // Estado inicial com todos os dias preenchidos
  const [availability, setAvailability] = useState<AvailabilityState>({
    MONDAY: { active: true, slots: [] },
    TUESDAY: { active: true, slots: [] },
    WEDNESDAY: { active: true, slots: [] },
    THURSDAY: { active: true, slots: [] },
    FRIDAY: { active: true, slots: [] },
    SATURDAY: { active: true, slots: [] },
    SUNDAY: { active: true, slots: [] },
  });

  const handleSave = async () => {
    if (!mentorId) return;
    setIsSaving(true);

    try {
      // 1. Transformamos o objeto agrupado em uma lista plana para o Java
      const availabilityList: AvailabilitySlot[] = [];

      Object.entries(availability).forEach(([day, data]) => {
        // Apenas enviamos os dias que o mentor marcou como ATIVOS
        if (data.active) {
          data.slots.forEach((slot: any) => {
            availabilityList.push({
              dayOfWeek: day as any,
              // Adicionamos os segundos (:00) para garantir compatibilidade com LocalTime do Java
              startTime: `${slot.start}:00`,
              endTime: `${slot.end}:00`,
            });
          });
        }
      });

      // 2. Montamos o Request conforme o DTO MentorAvailabilityRequest
      const request: MentorAvailabilityRequest = {
        mentorId: mentorId as string,
        availabilityList: availabilityList,
      };

      // 3. Enviamos para o backend
      await saveMentorAvailability(request);

      toast.success("Horários salvos com sucesso!");
    } catch (error) {
      toast.error("Ocorreu um erro ao salvar sua agenda.");
    } finally {
      setIsSaving(false);
    }
  };

  // Funções de manipulação com tipagem correta
  const toggleDay = (dayId: DayId, val: boolean) => {
    setAvailability(prev => ({
      ...prev,
      [dayId]: { ...prev[dayId], active: val, slots: val && prev[dayId].slots.length === 0 ? [{ start: "09:00", end: "17:00" }] : prev[dayId].slots }
    }));
  };

  const addSlot = (dayId: DayId) => {
    setAvailability(prev => ({
      ...prev,
      [dayId]: { ...prev[dayId], slots: [...prev[dayId].slots, { start: "09:00", end: "17:00" }] }
    }));
  };

  const removeSlot = (dayId: DayId, index: number) => {
    setAvailability(prev => ({
      ...prev,
      [dayId]: { ...prev[dayId], slots: prev[dayId].slots.filter((_, i) => i !== index) }
    }));
  };

  const updateSlot = (dayId: DayId, index: number, field: keyof TimeSlot, value: string) => {
    setAvailability(prev => {
      const newSlots = [...prev[dayId].slots];
      newSlots[index] = { ...newSlots[index], [field]: value };
      return { ...prev, [dayId]: { ...prev[dayId], slots: newSlots } };
    });
  };

  useEffect(() => {
    if (remoteAvailability && remoteAvailability.length > 0) {
      // Criamos um novo estado baseado no que veio do Java
      const newState: AvailabilityState = { ...initialState }; // initialState é aquele objeto com MONDAY, TUESDAY...

      // Resetamos os ativos antes de preencher
      Object.keys(newState).forEach(day => {
        newState[day as DayId].active = false;
        newState[day as DayId].slots = [];
      });

      remoteAvailability.forEach((item) => {
        const day = item.dayOfWeek as DayId;
        newState[day].active = true;
        newState[day].slots.push({
          // Removemos os segundos para o input de time do HTML (HH:mm:ss -> HH:mm)
          start: item.startTime.substring(0, 5),
          end: item.endTime.substring(0, 5),
        });
      });

      setAvailability(newState);
    }
  }, [remoteAvailability]);

  if (isLoading) return <p>Carregando agenda...</p>;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Clock className="h-6 w-6 text-blue-900" /> Disponibilidade
          </h1>
          <p className="text-sm text-muted-foreground mt-1 text-balance">
            Estes horários definem quando os alunos podem agendar mentorias com você.
          </p>
        </div>

        <Button
          onClick={handleSave}
          disabled={isSaving}
          className="bg-blue-900 hover:bg-blue-800 text-white rounded-xl gap-2 h-11 px-6 shadow-md shrink-0"
        >
          {isSaving ? "Salvando..." : <><Save className="h-4 w-4" /> Salvar Alterações</>}
        </Button>
      </header>

      <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 flex gap-3 text-blue-800 text-sm">
        <AlertCircle className="h-5 w-5 shrink-0" />
        <p>A configuração abaixo reflete seu horário padrão semanal.</p>
      </div>

      <div className="grid gap-4">
        {DAYS_OF_WEEK.map((day) => {
          const dayData = availability[day.id];

          return (
            <Card key={day.id} className={`rounded-2xl transition-all border-gray-100 ${dayData.active ? "bg-white shadow-sm" : "bg-gray-50/50 opacity-70"}`}>
              <CardContent className="p-4 md:p-6 flex flex-col md:flex-row md:items-start gap-6">

                <div className="flex items-center gap-4 w-full md:w-64 shrink-0 mt-2">
                  <Switch
                    checked={dayData.active}
                    onCheckedChange={(val: boolean) => toggleDay(day.id, val)}
                  />
                  <span className={`font-bold ${dayData.active ? "text-gray-900" : "text-gray-400"}`}>
                    {day.label}
                  </span>
                </div>

                <div className="flex-1 flex flex-col gap-3">
                  {dayData.active ? (
                    <>
                      {dayData.slots.map((slot, index) => (
                        <div key={index} className="flex items-center gap-2 animate-in slide-in-from-left-2">
                          <Input
                            type="time"
                            value={slot.start}
                            onChange={(e) => updateSlot(day.id, index, 'start', e.target.value)}
                            className="w-32 rounded-xl focus:ring-blue-500"
                          />
                          <span className="text-gray-400">até</span>
                          <Input
                            type="time"
                            value={slot.end}
                            onChange={(e) => updateSlot(day.id, index, 'end', e.target.value)}
                            className="w-32 rounded-xl focus:ring-blue-500"
                          />
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => removeSlot(day.id, index)}
                            className="text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => addSlot(day.id)}
                        className="w-fit mt-1 rounded-xl gap-1 border-dashed text-blue-700 border-blue-200 bg-blue-50/50 hover:bg-blue-100"
                      >
                        <Plus className="h-4 w-4" /> Adicionar intervalo
                      </Button>
                    </>
                  ) : (
                    <span className="text-sm text-gray-400 italic mt-2">Não agendar neste dia</span>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}