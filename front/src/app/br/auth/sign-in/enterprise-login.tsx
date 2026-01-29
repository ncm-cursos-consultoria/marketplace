import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLoginEnterprise } from "@/hooks/forms/login-enterprise";
import Link from "next/link";

export function EnterpriseLogin() {
  const [showPassword, setShowPassword] = useState(false);
  const { form, isPending, onSubmit } = useLoginEnterprise();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = form;

  return (
    <div className="w-full">
      <form className="flex flex-col gap-6 w-full" onSubmit={handleSubmit(onSubmit)}>
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
          <div className="relative"> {/* Container relativo para posicionar o ícone */}
            <Input
              type={showPassword ? "text" : "password"} // Alterna o tipo do input
              className="border border-neutral-300 w-full pr-10" // pr-10 para não sobrepor o texto ao ícone
              placeholder="Digite sua senha"
              autoComplete="current-password"
              {...register("password")}
            />
            <button
              type="button" // IMPORTANTE: tipo button para não submeter o form
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-neutral-700 transition-colors"
            >
              {showPassword ? (
                <EyeOff className="h-5 w-5" />
              ) : (
                <Eye className="h-5 w-5" />
              )}
            </button>
          </div>
          {errors.password && (
            <span className="text-sm text-red-600">
              {errors.password.message as string}
            </span>
          )}

          <div className="flex justify-end -mt-2">
            <Button variant="link" asChild className="p-0 h-auto text-sm text-blue-600">
              <Link href="/br/auth/forgot-password">
                Esqueceu sua senha?
              </Link>
            </Button>
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
    </div>
  );
}
