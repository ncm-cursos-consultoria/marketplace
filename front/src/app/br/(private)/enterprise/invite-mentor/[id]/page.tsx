"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { Loader2, Mail, UserPlus, Send } from "lucide-react";
import { toast } from "sonner"; // Ou sua biblioteca de toast preferida
import { InviteUserMentor, inviteUserMentor } from "@/service/user/mentor/invite-mentor";

export default function InviteMentorPage() {
  const [isPending, setIsPending] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<InviteUserMentor>();

  const onSubmit = async (data: InviteUserMentor) => {
    setIsPending(true);
    try {
      await inviteUserMentor("", data);
      
      toast.success("Convite enviado com sucesso!");
      setShowConfirmation(true);
    } catch (error) {
      toast.error("Erro ao enviar convite. Verifique os dados.");
    } finally {
      setIsPending(false);
    }
  };

  const handleInviteAnother = () => {
    reset(); // Limpa o formulário
    setShowConfirmation(false);
  };

  if (showConfirmation) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
        <div className="max-w-md w-full bg-white rounded-3xl p-10 shadow-sm text-center space-y-6">
          <div className="bg-emerald-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto">
            <UserPlus className="text-emerald-600 h-8 w-8" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900">Mentor Convidado!</h2>
          <p className="text-slate-500">O convite foi enviado para o e-mail informado. Deseja convidar outro mentor agora?</p>
          <div className="flex flex-col gap-3">
            <button
              onClick={handleInviteAnother}
              className="w-full bg-[#1e3a8a] text-white p-4 rounded-xl font-bold hover:bg-blue-800 transition-colors"
            >
              Sim, convidar outro
            </button>
            <a
              href="/admin/dashboard"
              className="w-full bg-slate-100 text-slate-600 p-4 rounded-xl font-bold hover:bg-slate-200 transition-colors"
            >
              Não, voltar ao painel
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
      <div className="max-w-md w-full bg-white rounded-3xl p-8 shadow-sm">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-[#1e3a8a]">Convidar Mentor</h1>
          <p className="text-slate-500 text-sm">Insira os dados para enviar o acesso ao novo mentor.</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Nome do Mentor</label>
            <div className="relative">
              <input
                {...register("firstName", { required: "Nome é obrigatório" })}
                className="w-full p-4 pl-11 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                placeholder="Ex: Roberto Silva"
              />
              <UserPlus className="absolute left-4 top-4 h-5 w-5 text-slate-400" />
            </div>
            {errors.firstName && <span className="text-red-500 text-xs mt-1">{errors.firstName.message}</span>}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">E-mail Corporativo</label>
            <div className="relative">
              <input
                {...register("email", { 
                  required: "E-mail é obrigatório",
                  pattern: { value: /^\S+@\S+$/i, message: "E-mail inválido" }
                })}
                className="w-full p-4 pl-11 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                placeholder="mentor@ncm.com"
              />
              <Mail className="absolute left-4 top-4 h-5 w-5 text-slate-400" />
            </div>
            {errors.email && <span className="text-red-500 text-xs mt-1">{errors.email.message}</span>}
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="w-full bg-[#1e3a8a] text-white p-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-blue-800 disabled:opacity-70 transition-all shadow-lg shadow-blue-900/10"
          >
            {isPending ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <>
                <Send className="h-5 w-5" />
                Enviar Convite
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}