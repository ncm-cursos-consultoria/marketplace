import { useForm } from "react-hook-form";
import {
  createUserFormSchema,
  CreateUserFormSchema,
} from "../schemas/create-user-formschema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { postUser } from "@/service/user/post-user";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

function extractErrorMessage(err: unknown) {
  const anyErr = err as any;
  const fallback = anyErr?.message || "Erro ao criar conta";

  // axios-like: err.response.data
  const data = anyErr?.response?.data;

  if (!data) return fallback;

  // string direto
  if (typeof data === "string") return data;

  // campos comuns
  if (typeof data.message === "string" && data.message.trim()) return data.message;
  if (typeof data.error === "string" && data.error.trim()) return data.error;

  // array de erros: ["email já existe", "senha fraca"]
  if (Array.isArray(data.errors)) {
    return data.errors.filter(Boolean).join("\n");
  }

  // objeto de erros por campo: { email: ["já existe"], password: ["muito curta"] }
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

export function useCreateUser() {
  const router = useRouter();

  const form = useForm<CreateUserFormSchema>({
    resolver: zodResolver(createUserFormSchema),
  });

  const { mutate, isPending } = useMutation({
    mutationFn: (data: CreateUserFormSchema) => postUser(data),
    mutationKey: ["user"],
    onSuccess: () => {
      toast.success("Conta criada com sucesso");
      router.push(`/br/auth/sign-in`);
    },
    onError: (err) => {
      const msg = extractErrorMessage(err);
      console.log("Erro", err);
      toast.error(msg);
    },
  });

  const onSubmit = (data: CreateUserFormSchema) => {
    console.log("enviando dados de cadastro:", data);
    mutate(data);
  };

  return { form, isPending, onSubmit };
}
