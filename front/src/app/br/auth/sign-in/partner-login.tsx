import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLoginPartner } from "@/hooks/forms/login-partner";

export default function PartnerLogin() {
  const { form, isPending, onSubmit } = useLoginPartner();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = form;

  return (
    <form className="flex flex-col gap-6 w-full" onSubmit={handleSubmit(onSubmit)}>
      <div className="flex flex-col gap-4 w-full">
        <div className="flex flex-col gap-1">
          <Label>Email Parceiro</Label>
          <Input
            type="email"
            className="border border-neutral-300"
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
            className="border border-neutral-300"
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
        {errors.root && (
            <p className="text-sm font-medium text-red-600 text-center">
              {errors.root.message}
            </p>
          )}
          
        <Button
          className="bg-[#008000] w-full py-3 text-white font-semibold rounded-md hover:bg-green-700 transition"
          type="submit"
          disabled={isPending}
        >
          {isPending ? "Carregando..." : "Entrar"}
        </Button>
      </div>
    </form>
  );
}
