"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteModule } from "@/service/module/delete-module";
import { Trash2, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface DeleteModuleModalProps {
  moduleId: string;
  moduleTitle: string;
  isOpen: boolean;
  onClose: () => void;
}

export function DeleteModuleModal({ moduleId, moduleTitle, isOpen, onClose }: DeleteModuleModalProps) {
  const queryClient = useQueryClient();

  const { mutate: handleDelete, isPending } = useMutation({
    mutationFn: () => deleteModule(moduleId),
    onSuccess: () => {
      // Importante: use a mesma queryKey que está no MentorModulesPage
      queryClient.invalidateQueries({ queryKey: ["mentor-modules"] });
      toast.success("Módulo excluído com sucesso!");
      onClose();
    },
    onError: (error) => {
      console.error(error);
      toast.error("Erro ao excluir o módulo. Tente novamente.");
    },
  });

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <div className="flex items-center gap-2 text-red-600 mb-2">
            <Trash2 className="h-5 w-5" />
            <DialogTitle>Excluir Módulo</DialogTitle>
          </div>
          <DialogDescription>
            Você tem certeza que deseja excluir o módulo <strong>"{moduleTitle}"</strong>?
            Esta ação é irreversível e removerá todas as aulas associadas.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            variant="ghost"
            onClick={onClose}
            disabled={isPending}
            type="button"
          >
            Cancelar
          </Button>
          <Button
            variant="destructive"
            onClick={() => handleDelete()}
            disabled={isPending}
            className="gap-2"
            type="button"
          >
            {/* CORREÇÃO: A lógica deve estar entre as tags do Button */}
            {isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Trash2 className="h-4 w-4" />
            )}
            Confirmar Exclusão
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}