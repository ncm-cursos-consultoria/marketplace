import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Modal } from "../modal";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useCreateJob } from "@/hooks/forms/create-job";

export function ModalCreateJob() {
  const {error,form,isError,isPending,onSubmit} = useCreateJob()

  const {register, handleSubmit, formState: {errors}} = form

  return (
    <div>
      <Modal
        className="p-2 bg-blue-500 text-white rounded-md w-[120px] font-medium cursor-pointer"
        headerTitle="Crie uma nova vaga"
        title="Nova Vaga"
      >
        <form className="flex flex-col gap-2" onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col gap-1">
            <Label>Título da vaga</Label>
            <Input className="border-neutral-400" {...register("title")}/>
          </div>
          <div className="flex flex-col gap-1">
            <Label>Descrição</Label>
            <textarea className="border-neutral-400 border p-2 rounded-md" {...register("description")}/>
          </div>
          <div className="flex flex-col gap-1">
            <Label>Salário</Label>
            <Input className="border-neutral-400" {...register("salary")}/>
          </div>
          <Button className="bg-blue-500 hover:bg-blue-600 cursor-pointer" type="submit">Criar</Button>
        </form>
      </Modal>
    </div>
  );
}
