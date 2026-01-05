"use client";

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
import { Loader2, Plus } from "lucide-react";
import { postModule, postModuleProps } from "@/service/module/post-module";

interface AddModuleModalProps {
  mentorId: string;
  isOpen: boolean;
  onClose: () => void;
}

export function AddModuleModal({ mentorId, isOpen, onClose }: AddModuleModalProps) {
  const queryClient = useQueryClient();

  const { register, handleSubmit, setValue, watch, reset, formState: { errors } } = useForm<postModuleProps>({
    defaultValues: {
      title: "",
      description: "",
      freePlan: false,
      hasMentorship: false,
      mentorshipValuePerHour: 0,
      mentorId: mentorId
    }
  });

  const hasMentorship = watch("hasMentorship");

  const { mutateAsync: createMutation, isPending } = useMutation({
    mutationFn: (data: postModuleProps) => postModule({ ...data, mentorId: mentorId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["mentor-modules"] });
      toast.success("Módulo criado com sucesso!");
      reset();
      onClose();
    },
    onError: () => toast.error("Falha ao criar o módulo.")
  });

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-blue-900">Novo Módulo</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit((data) => createMutation(data))} className="space-y-5 py-4">
          <div className="space-y-2">
            <Label htmlFor="title">Título do Módulo</Label>
            <Input 
              id="title" 
              {...register("title", { required: "Título é obrigatório" })} 
              placeholder="Ex: Lógica de Programação"
              className="rounded-xl"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descrição</Label>
            <Textarea 
              id="description" 
              {...register("description")} 
              placeholder="Descreva o que será ensinado..."
              className="rounded-xl min-h-[100px] resize-none"
            />
          </div>

          <div className="flex items-center justify-between p-3 rounded-xl border bg-gray-50/50">
            <Label>Disponibilizar Gratuitamente</Label>
            <Switch onCheckedChange={(val) => setValue("freePlan", val)} />
          </div>

          <div className="flex items-center justify-between p-3 rounded-xl border bg-gray-50/50">
            <Label>Possui Mentoria</Label>
            <Switch onCheckedChange={(val) => setValue("hasMentorship", val)} />
          </div>

          {hasMentorship && (
            <div className="space-y-2 animate-in slide-in-from-top-2">
              <Label htmlFor="mentorshipValue">Valor da Mentoria (R$ / Hora)</Label>
              <Input 
                id="mentorshipValue"
                type="number"
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
              className="bg-blue-900 hover:bg-blue-800 text-white rounded-xl gap-2 px-6 font-bold"
            >
              {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
              Criar Módulo
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}