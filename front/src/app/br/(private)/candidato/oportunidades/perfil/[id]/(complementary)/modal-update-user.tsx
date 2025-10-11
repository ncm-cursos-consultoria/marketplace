import { Modal } from "@/components/modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UseUserCandidate } from "@/context/user-candidate.context";
import { getUniqueUser } from "@/service/user/get-unique-user";
import { updateUser } from "@/service/user/update-user";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import z from "zod";

const updateUserFormSchema = z.object({
  firstName: z.string().optional().default(""),
  lastName: z.string().optional().default(""),
  email: z.string().optional().default(""),
  birthday: z.string().optional().default(""),
  cpf: z.string().optional().default(""),
  linkediInUrl: z.string().optional().default(""),
  githubUrl: z.string().optional().default(""),
  mySiteUrl: z.string().optional().default(""),
});

type UpdateUserFormSchema = z.infer<typeof updateUserFormSchema>;

export function ModalUpdateUser() {
  const { userCandidate } = UseUserCandidate();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { isSubmitting },
  } = useForm<UpdateUserFormSchema>({
    resolver: zodResolver(updateUserFormSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      birthday: "",
      cpf: "",
      linkediInUrl: "",
      githubUrl: "",
      mySiteUrl: "",
    },
  });

  const { data: user, isLoading } = useQuery({
    queryKey: ["authUser", userCandidate?.id],
    queryFn: () => getUniqueUser(userCandidate!.id),
    enabled: !!userCandidate?.id,
  });

  useEffect(() => {
    if (!user) return;

    setValue("firstName", user.firstName ?? "");
    setValue("lastName", user.lastName ?? "");
    setValue("email", user.email ?? "");
    setValue("birthday", user.birthday ?? "");
    setValue("cpf", user.cpf ?? "");
    setValue("linkediInUrl", user.linkediInUrl ?? "");
    setValue("githubUrl", user.githubUrl ?? "");
    setValue("mySiteUrl", user.mySiteUrl ?? "");
  }, [user, setValue]);

  const { mutate, isPending } = useMutation({
    mutationFn: (data: UpdateUserFormSchema) => {
      if (!userCandidate?.id) {
        throw new Error("ID do usuário não encontrado");
      }
      return updateUser(userCandidate.id, data);
    },
    mutationKey: ["authUser"],
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
              <Label>Email</Label>
              <Input type="email" {...register("email")} disabled={loading} />
            </div>
            <div>
              <Label>Data de nascimento</Label>
              <Input {...register("birthday")} disabled={loading} />
            </div>
            <div>
              <Label>CPF</Label>
              <Input {...register("cpf")} disabled={loading} />
            </div>
            <div>
              <Label>LinkedIn</Label>
              <Input {...register("linkediInUrl")} disabled={loading} />
            </div>
            <div>
              <Label>Github</Label>
              <Input {...register("githubUrl")} disabled={loading} />
            </div>
            <div>
              <Label>Portfólio</Label>
              <Input {...register("mySiteUrl")} disabled={loading} />
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
