import { Modal } from "@/components/modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UseUserCandidate } from "@/context/user-candidate.context";
import { getUniqueUser } from "@/service/user/get-unique-user";
import { updateUser } from "@/service/user/update-user";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

const updateUserFormSchema = z.object({
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  email: z.string().optional(),
  birthday: z.string().optional(),
  cpf: z.string().optional(),
  linkedInUrl: z.string().optional(),
  githubUrl: z.string().optional(),
  mySiteUrl: z.string().optional(),
  phoneNumber: z.string().optional(),
});

type UpdateUserFormSchema = z.infer<typeof updateUserFormSchema>;

export function ModalUpdateUser() {
  const { userCandidate } = UseUserCandidate();
  const qc = useQueryClient();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { isSubmitting },
  } = useForm<UpdateUserFormSchema>({
    resolver: zodResolver(updateUserFormSchema),
  });

  const { data: user, isLoading } = useQuery({
    queryKey: ["candidateProfile", userCandidate?.id],
    queryFn: () => getUniqueUser(userCandidate!.id),
    enabled: !!userCandidate?.id,
    staleTime: 0,
  });

  useEffect(() => {
    if (!user) return;

    setValue("firstName", user.firstName ?? "");
    setValue("lastName", user.lastName ?? "");
    setValue("email", user.email ?? "");
    setValue("birthday", user.birthday ?? "");
    setValue("cpf", user.cpf ?? "");
    setValue("linkedInUrl", user.linkedInUrl ?? "");
    setValue("githubUrl", user.githubUrl ?? "");
    setValue("mySiteUrl", user.mySiteUrl ?? "");
    setValue("phoneNumber", user.phoneNumber ?? "");
  }, [user, setValue]);

  const { mutate, isPending } = useMutation({
    mutationFn: (data: UpdateUserFormSchema) => {
      if (!userCandidate?.id) {
        throw new Error("ID do usuário não encontrado");
      }
      return updateUser(userCandidate.id, data);
    },
    mutationKey: ["authUser"],
    onSuccess: (data) => {
      toast.success("Sucesso ao atualizar usuario ")
      qc.invalidateQueries({ queryKey: ["candidateProfile", userCandidate?.id] });
      qc.invalidateQueries({ queryKey: ["authUser"] });
      // window.location.reload()
    },
    onError: (err) => {
      toast.error("Erro ao atualizar usário")
    }
  });

  const onSubmit = async (data: UpdateUserFormSchema) => {
    mutate(data);
  };

  const loading = isLoading || isPending || isSubmitting;

  return (
    <Modal
      title={"Editar perfil"}
      headerTitle="Edite seu perfil"
      className="cursor-pointer"
    >
      <div>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-5 overflow-auto"
        >
          <div className="flex flex-col gap-2 p-2">
            <div>
              <Label>Primeiro nome</Label>
              <Input {...register("firstName")} disabled={loading} />
            </div>
            <div>
              <Label>Sobrenome</Label>
              <Input {...register("lastName")} disabled={loading} />
            </div>
            <div>
              <Label>Data de nascimento</Label>
              <Input {...register("birthday")} disabled={loading} placeholder="DD/MM/AAAA" />
              <p className="text-xs text-gray-400 mt-1">Formato: DD/MM/AAAA. Ex: 01/02/2004</p>
            </div>
            <div>
              <Label>CPF</Label>
              <Input {...register("cpf")} disabled={loading} />
            </div>
            <div>
              <Label>LinkedIn</Label>
              <Input {...register("linkedInUrl")} disabled={loading} placeholder="https://www.linkedin.com/in/seu-perfil" />
               <p className="text-xs text-gray-400 mt-1">Inclua o https://. Ex: https://www.linkedin.com/in/seu-perfil</p>
            </div>
            <div>
              <Label>Github</Label>
              <Input {...register("githubUrl")} disabled={loading} placeholder="https://github.com/seu-usuario" />
              <p className="text-xs text-gray-400 mt-1">Inclua o https://. Ex: https://github.com/seu-usuario</p>
            </div>
            <div>
              <Label>Portfólio</Label>
              <Input {...register("mySiteUrl")} disabled={loading} placeholder="https://seu-portfolio.com" />
              <p className="text-xs text-gray-400 mt-1">Inclua o https://. Ex: https://seu-portfolio.com</p>
            </div>
            <div>
              <Label>Telefone</Label>
              <Input {...register("phoneNumber")} disabled={loading} placeholder="seu telefone"/>
              <p className="text-xs text-gray-400 mt-1">Formato: DDD9XXXX-XXXX Ex: 11999998888 </p>
            </div>
          </div>

          <Button type="submit" disabled={loading}>
            {loading ? "Atualizando..." : "Atualizar"}
          </Button>
        </form>
      </div>
    </Modal>
  );
}
