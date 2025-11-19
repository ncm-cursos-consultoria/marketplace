import { UseUserEnteprise } from "@/context/user-enterprise.context";
import { useQuery } from "@tanstack/react-query";
import { Modal } from "../modal";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useCreateModule } from "@/hooks/forms/create-module";
import ncm from "@/assets/logo-ncm-horizontal.svg"
import Image from "next/image";
import Link from "next/link";
import { getAllModules } from "@/service/module/get-all-modules";

export function CardMaterial() {
  const { userEnterprise } = UseUserEnteprise();
  const enterpriseId = userEnterprise?.enterpriseId ?? null;
  const { error, form, isError, isPending, onSubmit } = useCreateModule();
  const { register, handleSubmit, formState } = form;

  const { data, isLoading } = useQuery({
    queryKey: ["module", enterpriseId],
    queryFn: () => getAllModules(),
    enabled: !!enterpriseId,
  });

  if (data !== undefined && data.length === 0) {
    return (
      <div className="">
        <Modal
          title={"+"}
          headerTitle="Crie um curso"
          className="bg-neutral-400 h-[300px] w-[300px] rounded-md text-[60px] text-white cursor-pointer hover:bg-neutral-500"
        >
          <div>
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-2">
              <div>
                <Label>Títlo do curso</Label>
                <Input {...register("title")} className="border border-neutral-400"/>
              </div>
              <div>
                <Label>Descrição do curso</Label>
                <Input {...register("description")}  className="border border-neutral-400" />
              </div>
              <Button className="bg-blue-600 text-white cursor-pointer w-full" disabled={isPending} type="submit">
                {isPending ? "Carregando..." : "Criar"}
              </Button>
            </form>
          </div>
        </Modal>
      </div>
    );
  }

  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
      {Array.isArray(data) &&
        data.map((m: any) => (
          <Link 
          href={`/br/enterprise/courses/${m.id}`}
            key={m.id}
            className="rounded-xl overflow-hidden bg-white shadow-sm border border-gray-100"
          >
            <div className="relative aspect-video p-10">
              <div className="absolute inset-0 bg-black/15" />
              <Image src={ncm} alt="" />
            </div>
            <div className="p-4">
              <h3 className="font-semibold leading-snug mt-0.5">{m.title}</h3>
              <p className="text-sm text-gray-600 mt-1">{m.description}</p>
            </div>
          </Link>
        ))}
      <div className="">
        <Modal
          title={"+"}
          headerTitle="Crie um curso"
          className="bg-neutral-400 h-[280px] w-[300px] rounded-md text-[60px] text-white cursor-pointer hover:bg-neutral-500"
        >
          <div>
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-2">
              <div>
                <Label>Títlo do curso</Label>
                <Input {...register("title")}  className="border border-neutral-400"/>
              </div>
              <div>
                <Label>Descrição do curso</Label>
                <Input {...register("description")}  className="border border-neutral-400"/>
              </div>
              <Button className="bg-blue-600 text-white cursor-pointer w-full" disabled={isPending} type="submit">
                {isPending ? "Carregando..." : "Criar"}
              </Button>
            </form>
          </div>
        </Modal>
      </div>
    </div>
  );
}
