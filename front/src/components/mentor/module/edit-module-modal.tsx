"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Loader2, Save } from "lucide-react";
import { ApiModule } from "@/service/module/get-all-modules";
import { updateModule, UpdateModuleRequest } from "@/service/module/update-module";

interface EditModuleModalProps {
  module: ApiModule | null;
  isOpen: boolean;
  onClose: () => void;
}

export function EditModuleModal({ module, isOpen, onClose }: EditModuleModalProps) {
  const queryClient = useQueryClient();

  const { register, handleSubmit, setValue, watch, reset, formState: { errors } } = useForm<UpdateModuleRequest>({
    defaultValues: {
      freePlan: false,
      hasMentorship: false,
      mentorshipValuePerHour: 0
    }
  });

  // Observa se mentoria está ativa para mostrar o campo de valor
  const hasMentorship = watch("hasMentorship");

  useEffect(() => {
    if (module) {
      reset({
        title: module.title,
        description: module.description,
        freePlan: module.freePlan,
        // Campos que podem não vir no ApiModule mas estão no seu DTO de Update
        hasMentorship: (module as any).hasMentorship || false,
        mentorshipValuePerHour: (module as any).mentorshipValuePerHour || 0
      });
    }
  }, [module, reset]);

  const { mutateAsync: updateMutation, isPending } = useMutation({
    mutationFn: (data: UpdateModuleRequest) => updateModule(module!.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["mentor-modules"] });
      toast.success("Módulo atualizado com sucesso!");
      onClose();
    },
    onError: () => toast.error("Falha ao atualizar o módulo.")
  });

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-blue-900">Editar Módulo</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit((data) => updateMutation(data))} className="space-y-5 py-4">
          <div className="space-y-2">
            <Label htmlFor="title">Título do Módulo</Label>
            <Input 
              id="title" 
              {...register("title", { required: "Título é obrigatório" })} 
              className="rounded-xl"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descrição</Label>
            <Textarea 
              id="description" 
              {...register("description")} 
              className="rounded-xl min-h-[100px] resize-none"
            />
          </div>

          <div className="flex items-center justify-between p-3 rounded-xl border bg-gray-50/50">
            <div className="space-y-0.5">
              <Label>Disponibilizar Gratuitamente</Label>
              <p className="text-xs text-muted-foreground">O módulo será acessível para todos os planos.</p>
            </div>
            <Switch 
              checked={watch("freePlan")}
              onCheckedChange={(val) => setValue("freePlan", val)}
            />
          </div>

          <div className="flex items-center justify-between p-3 rounded-xl border bg-gray-50/50">
            <div className="space-y-0.5">
              <Label>Possui Mentoria</Label>
              <p className="text-xs text-muted-foreground">Habilitar agendamento de sessões para este módulo.</p>
            </div>
            <Switch 
              checked={hasMentorship}
              onCheckedChange={(val) => setValue("hasMentorship", val)}
            />
          </div>

          {hasMentorship && (
            <div className="space-y-2 animate-in slide-in-from-top-2 duration-300">
              <Label htmlFor="mentorshipValue">Valor da Mentoria (R$ / Hora)</Label>
              <Input 
                id="mentorshipValue"
                type="number"
                step="0.01"
                {...register("mentorshipValuePerHour", { valueAsNumber: true })}
                className="rounded-xl"
              />
            </div>
          )}

          <DialogFooter className="pt-4">
            <Button type="button" variant="ghost" onClick={onClose} className="rounded-xl">
              Cancelar
            </Button>
            <Button 
              type="submit" 
              disabled={isPending}
              className="bg-blue-900 hover:bg-blue-800 text-white rounded-xl gap-2 px-6"
            >
              {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              Salvar Alterações
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}