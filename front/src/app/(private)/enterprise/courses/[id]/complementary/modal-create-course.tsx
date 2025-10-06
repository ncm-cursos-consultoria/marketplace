import { Modal } from "@/components/modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCreateCourse } from "@/hooks/forms/create-course";

interface modalCreateCourseProps {
  moduleId: string;
}

export function ModalCreateCourse({ moduleId }: modalCreateCourseProps) {
  const { form, isPending, onSubmit } = useCreateCourse(moduleId);

  const { register, handleSubmit } = form;

  return (
    <Modal
      title="Criar novo curso"
      headerTitle="Crie seu novo curso"
      className="bg-blue-600 font-semibold text-white p-2 rounded-md hover:bg-blue-700 cursor-pointer"
    >
      <div>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-2">
          <div>
            <Label>Título</Label>
            <Input {...register("title")} className="border border-neutral-400"/>
          </div>
          <div>
            <Label>Descrição</Label>
            <Input {...register("description")} className="border border-neutral-400"/>
          </div>
          <div>
            <Label>URL do vídeo</Label>
            <Input {...register("videoUrl")} className="border border-neutral-400"/>
          </div>
          <Button className="bg-blue-600 text-white w-full hover:bg-blue-700 cursor-pointer">
            {isPending ? "Carregando..." : "Criar curso"}
          </Button>
        </form>
      </div>
    </Modal>
  );
}
