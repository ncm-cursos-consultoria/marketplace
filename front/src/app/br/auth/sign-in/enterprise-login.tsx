import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLoginEnterprise } from "@/hooks/forms/login-enterprise";

export function EnterpriseLogin() {
  const { form, isPending, onSubmit } = useLoginEnterprise();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = form;

  return (
    <div className="w-full">
      <form className="flex flex-col gap-6 w-full" onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-col gap-4 w-full">
          <div className="flex flex-col gap-1">
            <Label>Email Corporativo</Label>
            <Input
              type="email"
              className="border border-neutral-300 w-full"
              placeholder="Digite seu email"
              autoComplete="email"
              aria-invalid={!!errors.email}
              {...register("email")}
            />
            {errors.email && (
              <span className="text-sm text-red-600">
                {errors.email.message as string}
              </span>
            )}
          </div>

          <div className="flex flex-col gap-1">
            <Label>Senha</Label>
            <Input
              type="password"
              className="border border-neutral-300 w-full"
              placeholder="Digite sua senha"
              autoComplete="current-password"
              aria-invalid={!!errors.password}
              {...register("password")}
            />
            {errors.password && (
              <span className="text-sm text-red-600">
                {errors.password.message as string}
              </span>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-4 items-center">
          <Button
            className="bg-[#008000] w-full py-3 text-white font-semibold rounded-md hover:bg-green-700 transition"
            type="submit"
            disabled={isPending}
          >
            {isPending ? "Carregando..." : "Entrar"}
          </Button>
        </div>
      </form>
    </div>
  );
}
