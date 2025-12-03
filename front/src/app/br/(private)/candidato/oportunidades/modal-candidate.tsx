"use client";

import { useRef, useState } from "react";
import { useParams } from "next/navigation";
import { Modal } from "@/components/modal";
import { Badge } from "@/components/ui/badge";
import { UseUserCandidate } from "@/context/user-candidate.context";
import { api } from "@/service/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Loader2, Upload, Send, Clipboard } from "lucide-react";
import { getUniqueJob } from "@/service/job/get-unique-job";
import { getApplicationStatusStyle } from "@/service/job/get-all-jobs";

interface modalCandidateProps {
  title: string;
}

export function ModalCandidate({ title }: modalCandidateProps) {
  const { userCandidate, isLoading: isLoadingUser } = UseUserCandidate();
  const qc = useQueryClient();
  const [cacheBuster, setCacheBuster] = useState(Date.now());
  const isCheckingCandidate = isLoadingUser || userCandidate === undefined;
  const params = useParams<{ id: string }>();
  const jobOpeningId = (params?.id as string) ?? "";
  const [isEditingCV, setIsEditingCV] = useState(false);
  const [justUploaded, setJustUploaded] = useState(false);
  const [tempCVUrl, setTempCVUrl] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const { data: jobData, isLoading: isLoadingJob } = useQuery({
    queryKey: ['job-opening', jobOpeningId],
    queryFn: () => getUniqueJob(jobOpeningId),
    enabled: !!jobOpeningId,
  });

  const applicationStatus = jobData?.myApplicationStatus
    ? getApplicationStatusStyle(jobData.myApplicationStatus)
    : null;

  const hasCV =
    justUploaded ||
    (userCandidate as any)?.hasCurriculumVitae ||
    !!(userCandidate as any)?.hasCurriculumVitaeUrl;

  const backendUrl = (userCandidate as any)?.curriculumVitaeUrl;
  const displayCvUrl = tempCVUrl
    ? tempCVUrl
    : backendUrl
      ? `${backendUrl}?v=${cacheBuster}`
      : null;

  const { mutate: uploadCV, isPending: isUploading } = useMutation({
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
    onSuccess: async () => {
      toast.success("Currículo enviado com sucesso!");
      qc.invalidateQueries({ queryKey: ["userCandidate", userCandidate?.id] });
      if (file) {
        const objectUrl = URL.createObjectURL(file);
        setTempCVUrl(objectUrl);
      }
      setJustUploaded(true);
      setIsEditingCV(false);
      if (inputRef.current) inputRef.current.value = "";
      setFile(null);
      setCacheBuster(Date.now());
      await qc.invalidateQueries({ queryKey: ["authUser"] }); // Tenta achar por prefixo
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
  const { mutate: submitApplication, isPending: isSubmitting } = useMutation({
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
      qc.invalidateQueries({ queryKey: ["job-opening", jobOpeningId] });
      qc.invalidateQueries({ queryKey: ["applications", userCandidate?.id] });
      // window.location.reload();
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
    // window.location.reload();
  }

  if (isLoadingJob) {
    // Se está carregando os dados da vaga, mostra um botão desabilitado
    return (
      <button
        disabled
        className="bg-gray-400 rounded-md p-2 font-semibold text-white cursor-wait"
      >
        <Loader2 className="h-4 w-4 animate-spin" />
      </button>
    );
  }

  // Se JÁ SE CANDIDATOU, mostra o Badge de Status
  if (applicationStatus) {
    return (
      <Badge
        variant="secondary"
        className={`border text-sm ${applicationStatus.className}`}
      >
        {applicationStatus.text}
      </Badge>
    );
  }

  return (
    <Modal
      title="Candidatar-se"
      headerTitle="Envie sua candidatura"
      className="bg-blue-600 hover:bg-blue-700 rounded-md p-2 font-semibold text-white cursor-pointer"
    >
      {(isLoadingJob || isCheckingCandidate) ? (
        <div className="flex flex-col items-center justify-center py-8 space-y-3">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          <p className="text-sm text-gray-500">Verificando seu perfil...</p>
        </div>
      ) : (
        <>
          {hasCV && !isEditingCV ? (
            <form onSubmit={onSubmitApplication} className="space-y-4">
              {displayCvUrl && (
                <div className="flex items-center justify-between p-3 bg-gray-50 border rounded-lg">
                  <a
                    href={displayCvUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-600 underline hover:text-blue-800 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <Clipboard className="h-4 w-4" />
                      <span className="text-sm font-medium">Ver currículo atual</span>
                    </div>
                  </a>

                  {/* 3. Botão para trocar para o modo de Upload */}
                  <button
                    type="button"
                    onClick={() => setIsEditingCV(true)}
                    className="text-xs text-gray-500 underline hover:text-gray-800"
                  >
                    Alterar arquivo
                  </button>
                </div>
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
                className="w-full inline-flex items-center justify-center gap-2 rounded-md bg-blue-600 px-4 py-2 font-semibold text-white disabled:opacity-50 hover:bg-blue-700 transition"
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
            // 4. Se NÃO tem CV ou se CLICOU em alterar, mostra o form de Upload
            <form onSubmit={onSubmitUpload} className="space-y-4">

              {/* Cabeçalho com botão de voltar caso o usuário desista de alterar */}
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium">
                  {hasCV ? "Atualizar Currículo (PDF)" : "Enviar Currículo (PDF)"}
                </label>

                {hasCV && (
                  <button
                    type="button"
                    onClick={() => setIsEditingCV(false)}
                    className="text-xs text-red-500 hover:text-red-700 underline"
                  >
                    Cancelar alteração
                  </button>
                )}
              </div>

              <div className="border rounded-lg p-4">
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
                className="w-full inline-flex items-center justify-center gap-2 rounded-md bg-blue-600 px-4 py-2 font-semibold text-white disabled:opacity-50 hover:bg-blue-700 transition"
              >
                {isUploading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Enviando…
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4" />
                    {hasCV ? "Atualizar currículo" : "Salvar currículo"}
                  </>
                )}
              </button>
            </form>
          )}
        </>
      )}
    </Modal>
  );
}
