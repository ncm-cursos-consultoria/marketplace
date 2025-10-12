"use client";

import { useRef, useState } from "react";
import { useParams } from "next/navigation";
import { Modal } from "@/components/modal";
import { UseUserCandidate } from "@/context/user-candidate.context";
import { api } from "@/service/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Loader2, Upload, Send } from "lucide-react";

interface modalCandidateProps {
  title: string
}

export function ModalCandidate({title}: modalCandidateProps) {
  const { userCandidate } = UseUserCandidate();
  const qc = useQueryClient();
  const params = useParams<{ id: string }>();
  const jobOpeningId = (params?.id as string) ?? "";

  const [file, setFile] = useState<File | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const hasCV =
    (userCandidate as any)?.hasCurriculumVitae ??
    (userCandidate as any)?.hasCurriculumVitaeUrl ??
    false;

  const {
    mutate: uploadCV,
    isPending: isUploading,
  } = useMutation({
    mutationKey: ["candidate", "upload-cv", userCandidate?.id],
    mutationFn: async (formData: FormData) => {
      const { data } = await api.patch(
        `/user/${userCandidate?.id}/upload`,
        formData,
        {
          params: { fileType: "CURRICULUM_VITAE" },
          headers: { "Content-Type": "multipart/form-data" },
          transformRequest: (d) => d,
        }
      );
      return data;
    },
    onSuccess: () => {
      toast.success("Currículo enviado com sucesso!");
      qc.invalidateQueries({ queryKey: ["userCandidate", userCandidate?.id] });
      setFile(null);
      if (inputRef.current) inputRef.current.value = "";
    },
    onError: (err: any) => {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "Erro ao enviar currículo.";
      toast.error(msg);
    },
  });

  // ==== MUTATION: Submeter candidatura ====
  const {
    mutate: submitApplication,
    isPending: isSubmitting,
  } = useMutation({
    mutationKey: ["job-opening", "submit", jobOpeningId, userCandidate?.id],
    mutationFn: async () => {
      if (!jobOpeningId || !userCandidate?.id) {
        throw new Error("IDs inválidos para submissão.");
      }
      const { data } = await api.post(
        `/job-opening/${jobOpeningId}/submit/${userCandidate.id}`
      );
      return data;
    },
    onSuccess: () => {
      toast.success("Candidatura enviada com sucesso!");
      // Invalide o que fizer sentido no seu app:
      qc.invalidateQueries({ queryKey: ["job-opening", jobOpeningId] });
      qc.invalidateQueries({ queryKey: ["applications", userCandidate?.id] });
      window.location.reload()
    },
    onError: (err: any) => {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "Erro ao enviar candidatura.";
      toast.error(msg);
    },
  });

  function onSubmitUpload(e: React.FormEvent) {
    e.preventDefault();
    if (!file) {
      toast.error("Selecione um arquivo PDF do seu currículo.");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      toast.error("Arquivo muito grande. Máx: 10MB.");
      return;
    }

    const fd = new FormData();
    fd.append("file", file);
    uploadCV(fd);
  }

  function onSubmitApplication(e: React.FormEvent) {
    e.preventDefault();
    submitApplication();
  }

  return (
    <Modal
      title="Candidatar-se"
      headerTitle="Envie sua candidatura"
      className="bg-blue-600 hover:bg-blue-700 rounded-md p-2 font-semibold text-white cursor-pointer"
    >
      {/* Se JÁ TEM CV, mostra ação de candidatura */}
      {hasCV ? (
        <form onSubmit={onSubmitApplication} className="space-y-4">
          {(userCandidate as any)?.curriculumVitaeUrl && (
            <a
              href={(userCandidate as any).curriculumVitaeUrl}
              target="_blank"
              rel="noreferrer"
              className="text-blue-600 underline break-all"
            >
              Ver currículo atual
            </a>
          )}

          <div className="rounded-lg border p-4 bg-blue-50">
            <p className="text-sm">
              Ao prosseguir, sua candidatura será enviada para a vaga{" "}
              <strong>{title}</strong> usando seu currículo atual.
            </p>
          </div>

          <button
            type="submit"
            disabled={isSubmitting || !jobOpeningId || !userCandidate?.id}
            className="w-full inline-flex items-center justify-center gap-2 rounded-md bg-blue-600 px-4 py-2 font-semibold text-white disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Enviando candidatura…
              </>
            ) : (
              <>
                <Send className="h-4 w-4" />
                Enviar candidatura
              </>
            )}
          </button>
        </form>
      ) : (
        // Se NÃO TEM CV, mostra upload do currículo
        <form onSubmit={onSubmitUpload} className="space-y-4">
          {(userCandidate as any)?.curriculumVitaeUrl && (
            <a
              href={(userCandidate as any).curriculumVitaeUrl}
              target="_blank"
              rel="noreferrer"
              className="text-blue-600 underline break-all"
            >
              Ver currículo atual
            </a>
          )}

          <div className="border rounded-lg p-4">
            <label className="block text-sm font-medium mb-2">
              Currículo (PDF até 10 MB)
            </label>
            <input
              ref={inputRef}
              type="file"
              accept="application/pdf"
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
              className="block w-full text-sm
                         file:mr-4 file:py-2 file:px-4
                         file:rounded-full file:border-0
                         file:bg-blue-50 file:text-blue-700
                         hover:file:bg-blue-100"
            />
            {file && (
              <p className="text-xs mt-2">
                Selecionado: <strong>{file.name}</strong> (
                {(file.size / 1024 / 1024).toFixed(2)} MB)
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isUploading || !file}
            className="w-full inline-flex items-center justify-center gap-2 rounded-md bg-blue-600 px-4 py-2 font-semibold text-white disabled:opacity-50"
          >
            {isUploading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Enviando…
              </>
            ) : (
              <>
                <Upload className="h-4 w-4" />
                Enviar currículo
              </>
            )}
          </button>
        </form>
      )}
    </Modal>
  );
}
