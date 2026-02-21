import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLogin } from "@/hooks/forms/login-user";
import Link from "next/link";
import { LinkedInButton } from "@/components/auth/linkedin-login-button";

export function CandidateLogin() {
  const [showPassword, setShowPassword] = useState(false);
  const { form, isPending, onSubmit } = useLogin();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = form;

  return (
    <div className="w-full">
      <form
        className="flex flex-col gap-6 w-full"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="flex flex-col gap-1">
          <Label>Email Pessoal</Label>
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
            className="bg-green-600 w-full py-3 text-white font-semibold rounded-md hover:bg-green-700 transition cursor-pointer"
            type="submit"
            disabled={isPending}
          >
            {isPending ? "Carregando..." : "Entrar"}
          </Button>

          <div className="w-full flex items-center gap-2">
            <div className="h-[1px] bg-gray-200 flex-1"></div>
            <span className="text-xs font-semibold text-gray-400 uppercase">Ou</span>
            <div className="h-[1px] bg-gray-200 flex-1"></div>
          </div>

          <LinkedInButton />
        </div>
      </form>
    </div>
  );
}
