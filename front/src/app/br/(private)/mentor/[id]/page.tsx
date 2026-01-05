"use client";

import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { 
  Calendar, 
  Users, 
  BookOpen, 
  Clock, 
  ArrowUpRight,
  CheckCircle2
} from "lucide-react";
import { UseUserMentor } from "@/context/user-mentor.context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { me } from "@/service/auth/me";

export default function MentorHomePage() {
  const { id } = useParams();
  const { userMentor } = UseUserMentor();

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Saudação e Boas-vindas */}
      <section>
        <h1 className="text-3xl font-bold text-gray-900">
          Olá, {userMentor?.firstName || "Mentor"}! 👋
        </h1>
        <p className="text-gray-500 mt-2">
          Aqui está o que está acontecendo na sua agenda hoje.
        </p>
      </section>

      {/* Cards de Métricas Rápidas */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard 
          title="Mentorias Hoje" 
          value="4" 
          icon={<Calendar className="h-5 w-5 text-blue-600" />} 
          description="2 confirmadas"
        />
        <StatCard 
          title="Total de Alunos" 
          value="128" 
          icon={<Users className="h-5 w-5 text-green-600" />} 
          description="+12 este mês"
        />
        <StatCard 
          title="Horas Realizadas" 
          value="45h" 
          icon={<Clock className="h-5 w-5 text-purple-600" />} 
          description="Meta: 60h/mês"
        />
        <StatCard 
          title="Módulos Ativos" 
          value="6" 
          icon={<BookOpen className="h-5 w-5 text-orange-600" />} 
          description="Em 3 cursos"
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Próximas Mentorias (Resumo da Agenda) */}
        <Card className="rounded-2xl shadow-sm border-gray-100">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg font-bold">Próximos Agendamentos</CardTitle>
            <Link href={`/br/mentor/${id}/agenda`} className="text-sm text-blue-600 hover:underline inline-flex items-center gap-1">
              Ver agenda completa <ArrowUpRight className="h-3 w-3" />
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Exemplo de item de agenda vazio - integrar com seu backend futuramente */}
              {[1, 2, 3].map((_, i) => (
                <div key={i} className="flex items-center gap-4 p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors">
                  <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold">
                    JD
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold truncate">João da Silva</p>
                    <p className="text-xs text-gray-500">Mentoria de Carreira • 14:00</p>
                  </div>
                  <CheckCircle2 className="h-5 w-5 text-gray-300" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Atalhos Rápidos */}
        <Card className="rounded-2xl shadow-sm border-gray-100">
          <CardHeader>
            <CardTitle className="text-lg font-bold">Ações Rápidas</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4">
            <QuickActionLink 
              href={`/br/mentor/${id}/availability`} 
              title="Ajustar Disponibilidade" 
              subtitle="Configure seus horários de atendimento." 
            />
            <QuickActionLink 
              href={`/br/mentor/${id}/module`} 
              title="Gerenciar Conteúdo" 
              subtitle="Adicione ou edite materiais dos seus cursos." 
            />
          </CardContent>
        </Card>
      </div>
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

function QuickActionLink({ href, title, subtitle }: any) {
  return (
    <Link href={href} className="group p-4 rounded-xl border border-gray-100 hover:border-blue-200 hover:bg-blue-50 transition-all">
      <h4 className="font-semibold text-gray-900 group-hover:text-blue-900 transition-colors">{title}</h4>
      <p className="text-xs text-gray-500 mt-1">{subtitle}</p>
    </Link>
  );
}