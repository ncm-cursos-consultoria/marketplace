"use client";

import { useState, useEffect } from "react";
import { 
  User, Mail, Save, Camera, ShieldCheck 
} from "lucide-react";
import { UseUserMentor } from "@/context/user-mentor.context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import Image from "next/image";
import avatarPlaceholder from "@/assets/avatar.png";
import { putUserMentor, UpdateUserMentor } from "@/service/user/mentor/put-user-mentor";

export default function MentorProfilePage() {
  const { userMentor, setUserMentor } = UseUserMentor();
  const [isSaving, setIsSaving] = useState(false);

  // Estado local para os campos do formulário
  const [formData, setFormData] = useState<UpdateUserMentor>({
    firstName: "",
    lastName: "",
    email: "",
  });

  // Sincroniza os dados do contexto com o formulário local ao carregar
  useEffect(() => {
    if (userMentor) {
      setFormData({
        firstName: userMentor.firstName || "",
        lastName: userMentor.lastName || "",
        email: userMentor.email || "",
      });
    }
  }, [userMentor]);

  const handleSave = async () => {
    if (!userMentor?.id) return;

    setIsSaving(true);
    try {
      // Chamada real para a API aplicando o patch
      const updatedUser = await putUserMentor(userMentor.id, formData);
      
      // Atualiza o contexto global para que o Aside e Header mudem o nome imediatamente
      setUserMentor(updatedUser);
      
      toast.success("Perfil atualizado com sucesso!");
    } catch (error) {
      toast.error("Erro ao atualizar perfil.");
    } finally {
      setIsSaving(false);
    }
  };

  // Função auxiliar para atualizar o estado ao digitar
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
      <header className="border-b pb-6">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <User className="h-6 w-6 text-blue-900" /> Meu Perfil
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Gerencie suas informações públicas e configurações de conta.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="space-y-6">
          <Card className="rounded-2xl shadow-sm border-gray-100 overflow-hidden">
            <CardContent className="pt-8 pb-6 text-center">
              <div className="relative inline-block">
                <div className="h-32 w-32 rounded-full border-4 border-gray-50 overflow-hidden bg-gray-100 mx-auto">
                  <Image 
                    src={userMentor?.profilePictureUrl || avatarPlaceholder} 
                    alt="Foto de Perfil"
                    width={128}
                    height={128}
                    className="object-cover"
                  />
                </div>
                <button className="absolute bottom-1 right-1 bg-blue-900 text-white p-2 rounded-full shadow-lg hover:bg-blue-800 transition-colors">
                  <Camera className="h-4 w-4" />
                </button>
              </div>
              <h2 className="mt-4 font-bold text-lg text-gray-900">
                {userMentor?.firstName} {userMentor?.lastName}
              </h2>
              <p className="text-xs text-blue-600 font-semibold uppercase tracking-wider mt-1 flex items-center justify-center gap-1">
                <ShieldCheck className="h-3 w-3" /> Mentor Verificado
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <Card className="rounded-2xl shadow-sm border-gray-100">
            <CardHeader>
              <CardTitle className="text-lg font-bold">Informações Profissionais</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500 uppercase">Nome</label>
                  <Input 
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    className="rounded-xl h-11" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500 uppercase">Sobrenome</label>
                  <Input 
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    className="rounded-xl h-11" 
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-300" />
                  <Input 
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="pl-10 rounded-xl h-11 bg-gray-50" 
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end gap-3">
            <Button variant="ghost" className="rounded-xl h-12 px-6">Cancelar</Button>
            <Button 
              onClick={handleSave}
              disabled={isSaving}
              className="bg-blue-900 hover:bg-blue-800 text-white rounded-xl h-12 px-8 font-bold shadow-md gap-2"
            >
              {isSaving ? "Salvando..." : <><Save className="h-5 w-5" /> Salvar Alterações</>}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}