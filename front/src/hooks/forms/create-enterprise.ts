import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  CreateEnterpriseFormSchema,
  createEnterpriseFormSchema,
} from "../schemas/create-enterprise-formschema";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postEnterprise } from "@/service/enterprise/post-enterprise";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

// mesmo extractor usado no fluxo de candidato
function extractErrorMessage(err: unknown) {
  const anyErr = err as any;
  const fallback = anyErr?.message || "Erro ao criar empresa";
  const data = anyErr?.response?.data;

  if (!data) return fallback;
  if (typeof data === "string") return data;
  if (typeof data.message === "string" && data.message.trim()) return data.message;
  if (typeof data.error === "string" && data.error.trim()) return data.error;

  if (Array.isArray(data.errors)) {
    return data.errors.filter(Boolean).join("\n");
  }

  if (data.errors && typeof data.errors === "object") {
    const parts: string[] = [];
    for (const [field, msgs] of Object.entries<any>(data.errors)) {
      if (Array.isArray(msgs)) parts.push(`${field}: ${msgs.join(", ")}`);
      else if (msgs) parts.push(`${field}: ${String(msgs)}`);
    }
    if (parts.length) return parts.join("\n");
  }

  return fallback;
}

export function useCreateEnterprise() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const form = useForm<CreateEnterpriseFormSchema>({
    resolver: zodResolver(createEnterpriseFormSchema),
  });

  const { mutate, isPending, error, isError } = useMutation({
    mutationFn: (data: CreateEnterpriseFormSchema) => postEnterprise(data),
    mutationKey: ["auth-enterprise"],
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["auth-enterprise"] });
      toast.success("Empresa criada com sucesso");
      router.push("/br/auth/sign-in");
    },
    onError: (err) => {
      const msg = extractErrorMessage(err);
      // útil para logs de dev
      console.error("Erro ao criar empresa:", err);
      toast.error(msg);
    },
  });

  const onSubmit = (data: CreateEnterpriseFormSchema) => {
    mutate(data);
  };

  return { onSubmit, isPending, form, error, isError };
}
