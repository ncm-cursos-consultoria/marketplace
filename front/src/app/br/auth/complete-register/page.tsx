"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, UserCheck } from "lucide-react";
import { toast } from "sonner";
import { api } from "@/service/api";

// Schema de validação com Zod
const completeRegisterSchema = z.object({
  cpf: z.string().min(11, "CPF inválido").max(14, "CPF inválido"),
  birthday: z.string().min(10, "Data de nascimento obrigatória"),
});

type CompleteRegisterData = z.infer<typeof completeRegisterSchema>;

export default function CompleteRegisterPage() {
  const [linkedinData, setLinkedinData] = useState<any>(null);
  const [isPending, setIsPending] = useState(false);
  const router = useRouter();

  const { register, handleSubmit, formState: { errors } } = useForm<CompleteRegisterData>({
    resolver: zodResolver(completeRegisterSchema)
  });

  useEffect(() => {
    // Recupera os dados que salvamos no callback do LinkedIn
    const data = sessionStorage.getItem("linkedin_user");
    if (!data) {
      router.push("/br/auth/sign-in");
      return;
    }
    setLinkedinData(JSON.parse(data));
  }, [router]);

  const onSubmit = async (formData: CompleteRegisterData) => {
    setIsPending(true);
    try {
      const payload = {
        ...formData,
        firstName: linkedinData.firstName,
        lastName: linkedinData.lastName,
        email: linkedinData.email,
        ssoId: linkedinData.ssoId,
        profilePictureUrl: linkedinData.profilePictureUrl
      };

      // Chamada para a rota de registro que discutimos no backend
      const response = await api.post("/auth/linkedin/register", payload);

      toast.success("Cadastro finalizado com sucesso!");
      sessionStorage.removeItem("linkedin_user"); // Limpa o storage

      // Redireciona para a home do candidato usando o ID retornado
      router.push(`/br/candidato/oportunidades/home/${response.data.id}`);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Erro ao finalizar cadastro.");
    } finally {
      setIsPending(false);
    }
  };

  if (!linkedinData) return null;

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
      <div className="max-w-md w-full bg-white rounded-3xl p-8 shadow-sm">
        <div className="text-center mb-8">
          <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <UserCheck className="text-blue-700 h-8 w-8" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Quase lá!</h1>
          <p className="text-slate-500 text-sm">Olá {linkedinData.firstName}, precisamos de apenas mais alguns dados para criar seu perfil de candidato.</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <Label>E-mail (LinkedIn)</Label>
            <Input value={linkedinData.email} disabled className="bg-slate-100 cursor-not-allowed" />
          </div>

          <div>
            <Label>CPF</Label>
            <Input 
              {...register("cpf")} 
              placeholder="000.000.000-00"
              aria-invalid={!!errors.cpf}
            />
            {errors.cpf && <span className="text-red-500 text-xs">{errors.cpf.message}</span>}
          </div>

          <div>
            <Label>Data de Nascimento</Label>
            <Input 
              type="date" 
              {...register("birthday")} 
              aria-invalid={!!errors.birthday}
            />
            {errors.birthday && <span className="text-red-500 text-xs">{errors.birthday.message}</span>}
          </div>

          <Button 
            type="submit" 
            disabled={isPending}
            className="w-full bg-green-600 hover:bg-green-700 py-6 text-lg font-bold"
          >
            {isPending ? <Loader2 className="animate-spin" /> : "Finalizar Cadastro"}
          </Button>
        </form>
      </div>
    </div>
  );
}