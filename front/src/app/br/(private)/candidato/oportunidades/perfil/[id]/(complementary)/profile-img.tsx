"use client";

import { UseUserCandidate } from "@/context/user-candidate.context";
import { patchProfilePicture } from "@/service/user/patch-profile-picture";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { Camera, Loader2 } from "lucide-react";
import test from "@/assets/avatar.png"

const MAX_FILE_SIZE = 10 * 1024 * 1024; 
const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png'];

export function ProfileImg() {
  const { userCandidate } = UseUserCandidate();
  const qc = useQueryClient();
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  

const { mutate, isPending } = useMutation({
  mutationKey: ["authUser"],
  mutationFn: (file: File) => {
    
    if (!userCandidate?.id) {
      throw new Error("ID do usuário não encontrado");
    }
    
    return patchProfilePicture(file, userCandidate.id);
  },
  onSuccess: () => {

    
    toast.success("Foto de perfil enviada com sucesso");
    
    qc.invalidateQueries({ queryKey: ["authUser"] });
    qc.invalidateQueries({ queryKey: ["userCandidate"] });
    
    qc.refetchQueries({ queryKey: ["authUser"] });
    qc.refetchQueries({ queryKey: ["userCandidate"] });

    
    setPreview(null);
  },
  onError: (error) => {
    console.error("onError - erro completo:", error);
    toast.error("Não foi possível enviar a foto de perfil");
  },
});


  function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
  
    if (!file) {
      console.log("onFileChange - nenhum arquivo selecionado");
      return;
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      toast.error("Apenas arquivos JPG e PNG são permitidos");
      if (inputRef.current) {
        inputRef.current.value = '';
      }
      return;
    }


    if (file.size > MAX_FILE_SIZE) {
      toast.error("O arquivo deve ter no máximo 10MB");
      if (inputRef.current) {
        inputRef.current.value = '';
      }
      return;
    }

    if (!userCandidate?.id) {
      toast.error("Erro: ID do usuário não encontrado");
      return;
    }
    
    const url = URL.createObjectURL(file);
    setPreview(url);
    
    mutate(file);
  }

  return (
    <div>
      <button
        type="button"
        aria-label="Alterar foto de perfil"
        disabled={isPending}
        className="
          group relative h-24 w-24 rounded-2xl ring-4 ring-white overflow-hidden bg-neutral-200 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600
          disabled:cursor-not-allowed disabled:opacity-60
        "
      >
        <Image
          src={test}
          alt="Levi avatar"
          width={96}
          height={96}
          className="h-full w-full object-cover transition group-hover:opacity-70"
        />

        <div
          className="pointer-events-none absolute inset-0 grid place-items-center opacity-0 group-hover:opacity-100 transition group-hover:bg-black/35"
        >
          <Camera className="h-7 w-7 text-white drop-shadow" />
        </div>
        {isPending && (
          <div className="absolute inset-0 grid place-items-center bg-black/40">
            <Loader2 className="h-6 w-6 text-white animate-spin" />
          </div>
        )}
      </button>
      <input
        ref={inputRef}
        type="file"
        accept=".jpg,.jpeg,.png"
        className="hidden"
        onChange={onFileChange}
        disabled={isPending}
      />
    </div>
  );
}