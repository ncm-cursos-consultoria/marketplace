import { Modal } from "@/components/modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCreateEnterprise } from "@/hooks/forms/create-enterprise";
import Link from "next/link";

export function EnterpriseCandidate() {
  const { form, isPending, onSubmit } = useCreateEnterprise();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = form;

  return (
    <form
      className="flex flex-col gap-6 lg:w-[500px]"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="flex flex-col gap-4">
        <div className="w-full flex flex-col md:flex-row gap-4">
          <div className="flex-1 min-w-0">
            <Label>Razão social</Label>
            <Input
              className="border border-neutral-300 w-full"
              placeholder="Digite a razão social"
              aria-invalid={!!errors.legalName}
              {...register("legalName")}
            />
            {errors.legalName && (
              <span className="text-sm text-red-600">
                {errors.legalName.message}
              </span>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <Label>Nome fantasia</Label>
            <Input
              className="border border-neutral-300 w-full"
              placeholder="Digite o nome fantasia"
              aria-invalid={!!errors.tradeName}
              {...register("tradeName")}
            />
            {errors.tradeName && (
              <span className="text-sm text-red-600">
                {errors.tradeName.message}
              </span>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <Label>CNPJ</Label>
          <Input
            className="border border-neutral-300"
            placeholder="Digite o CNPJ"
            type="text"
            inputMode="numeric"
            aria-invalid={!!errors.cnpj}
            {...register("cnpj")}
          />
          {errors.cnpj && (
            <span className="text-sm text-red-600">
              {errors.cnpj.message}
            </span>
          )}
        </div>

        <div className="w-full flex flex-col md:flex-row gap-4">
          <div className="flex-1 min-w-0">
            <Label>Email</Label>
            <Input
              type="email"
              className="border border-neutral-300 w-full"
              placeholder="Digite o email corporativo"
              aria-invalid={!!errors.email}
              {...register("email")}
            />
            {errors.email && (
              <span className="text-sm text-red-600">
                {errors.email.message}
              </span>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <Label>Senha</Label>
            <Input
              type="password"
              className="border border-neutral-300 w-full"
              placeholder="Crie uma senha"
              aria-invalid={!!errors.password}
              {...register("password")}
            />
            {errors.password && (
              <span className="text-sm text-red-600">
                {errors.password.message}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-3 items-center">
                <div className="w-full">
                  <Button
                    className="bg-[#008000] w-full py-3 text-white font-semibold rounded-md hover:bg-green-700 transition cursor-pointer"
                    type="submit"
                    disabled={isPending}
                  >
                    {isPending ? "Criando..." : "Criar conta"}
                  </Button>
                  <div className="flex items-center gap-1">
                    <input type="checkbox" />
                    <Modal
                      title="Concorda com os termos e condições?"
                      className="text-[12px] underline text-blue-700 cursor-pointer hover:text-blue-800"
                      headerTitle="Termos e condições"
                    >
                      <div>
                        <p>
                          Bem-vindo ao Marketplace da NCM. Estes Termos e Condições de
                          Uso regulam o acesso e a utilização da Plataforma e dos
                          serviços oferecidos por NCM CONSULTORIA LTDA - ME, inscrita no
                          CNPJ sob nº 08.631.537/0001-61, com sede em [Endereço
                          Completo]. Ao criar uma conta, acessar ou usar
                          a Plataforma, você concorda com estes Termos e com nossa
                          Política de Privacidade . Se você não concorda, não deve
                          utilizar a Plataforma.
                        </p>
                      </div>
                    </Modal>
                  </div>
                </div>

        <span className="font-semibold text-gray-500">OU</span>

        <Link
          href="/br/auth/sign-in"
          className="bg-gray-800 text-white py-2 w-full text-center rounded-md font-medium hover:bg-gray-700 transition"
        >
          Entrar
        </Link>
      </div>
    </form>
  );
}
