"use client";

import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Loader2, PlusCircle, Video } from "lucide-react";
import { createCourse } from "@/service/course/create-course";
import { useState } from "react";

interface ModalCreateCourseProps {
  moduleId: string;
  title: string,
  description: string,
  videoUrl: string,
}

export function ModalCreateCourse({ moduleId }: ModalCreateCourseProps) {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();

  const { register, handleSubmit, reset, formState: { errors } } = useForm<ModalCreateCourseProps>({
    defaultValues: {
      moduleId: moduleId,
      title: "",
      description: "",
      videoUrl: ""
    }
  });

  const { mutateAsync: createMutation, isPending } = useMutation({
    mutationFn: (data: ModalCreateCourseProps) => createCourse(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["courses", moduleId] });
      toast.success("Vídeo adicionado com sucesso!");
      reset();
      setOpen(false);
    },
    onError: () => toast.error("Erro ao adicionar o vídeo.")
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-blue-900 hover:bg-blue-800 text-white rounded-xl gap-2">
          <PlusCircle className="h-5 w-5" /> Adicionar Vídeo
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-blue-900 flex items-center gap-2">
            <Video className="h-5 w-5" /> Novo Vídeo para o Módulo
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit((data) => createMutation(data))} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="title">Título da Aula</Label>
            <Input
              id="title"
              {...register("title", { required: "O título é obrigatório" })}
              placeholder="Ex: Introdução ao React"
              className="rounded-xl"
            />
            {errors.title && <span className="text-xs text-red-500">{errors.title.message}</span>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="videoUrl">URL do Vídeo (Vimeo/YouTube)</Label>
            <Input
              id="videoUrl"
              {...register("videoUrl")}
              placeholder="https://vimeo.com/..."
              className="rounded-xl"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descrição</Label>
            <Textarea
              id="description"
              {...register("description")}
              placeholder="Breve resumo do conteúdo desta aula..."
              className="rounded-xl min-h-[100px] resize-none"
            />
          </div>

          <DialogFooter className="pt-4">
            <Button type="button" variant="ghost" onClick={() => setOpen(false)} className="rounded-xl">
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isPending}
              className="bg-blue-900 hover:bg-blue-800 text-white rounded-xl gap-2 px-6 font-bold"
            >
              {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Salvar Aula"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}