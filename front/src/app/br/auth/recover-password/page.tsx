"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Loader2, KeyRound, ArrowLeft, EyeOff, Eye } from "lucide-react";

// Imports de UI
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import Image from "next/image";
import logo from "@/assets/ncm-logo.png"; // Importe seu logo

// Import da service que criamos
import { resetPassword, ResetPasswordRequest } from "@/service/auth/reset-password";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";

// 1. Schema de Validação (Zod)
// Define as regras do formulário
const resetPasswordSchema = z.object({
  email: z.email({ message: "Por favor, insira um e-mail válido." }),
  fourDigitCode: z.string().length(4, { message: "O código deve ter exatamente 4 dígitos." }),
  password: z.string().min(8, { message: "A senha deve ter pelo menos 8 caracteres." }),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  // Validação para garantir que as senhas são iguais
  message: "As senhas não coincidem.",
  path: ["confirmPassword"], // Onde mostrar o erro
});

type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

// --- O Componente da Página ---
export default function RecoverPasswordPage() {
  const router = useRouter();
  const queryClient = useQueryClient();

  // 2. Lendo o e-mail da URL
  // A URL é: .../recover-password?email=user@example.com
  const searchParams = useSearchParams();
  const emailFromUrl = searchParams.get("email");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // 3. Configuração do Formulário
  const form = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      email: emailFromUrl || "", // Pré-preenche o e-mail
      fourDigitCode: "",
      password: "",
      confirmPassword: "",
    },
  });

  // Garante que o e-mail da URL seja preenchido se a página carregar
  useEffect(() => {
    if (emailFromUrl) {
      form.setValue("email", emailFromUrl);
    }
  }, [emailFromUrl, form]);

  // 4. Configuração da Mutação (API Call)
  const { mutate, isPending } = useMutation({
    mutationFn: resetPassword,
    onSuccess: () => {
      toast.success("Senha redefinida com sucesso!");
      queryClient.clear(); // Limpa o cache do usuário logado
      router.push("/br/auth/sign-in"); // Redireciona para o login
    },
    onError: (error: any) => {
      // Exibe o erro vindo do backend
      const errorMessage = error.response?.data?.message ||
        "Código inválido ou expirado. Tente novamente.";
      toast.error(errorMessage);
    },
  });

  // 5. Função de Envio
  function onSubmit(data: ResetPasswordFormData) {
    // Não precisamos enviar 'confirmPassword' para a API
    const requestData: ResetPasswordRequest = {
      email: data.email,
      fourDigitCode: data.fourDigitCode.toUpperCase(), // Garante que o código esteja em maiúsculas
      newPassword: data.password,
    };
    mutate(requestData);
  }

  // 6. O JSX (A parte visual)
  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-100 p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center">
          <Image src={logo} alt="NCM Marketplace" width={150} className="mx-auto" />
          <CardTitle className="text-2xl pt-4">Redefinir Senha</CardTitle>
          <CardDescription>
            Insira o código de 4 caracteres (enviado para seu e-mail) e sua nova senha.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">

              {/* --- CAMPO DE E-MAIL (Sem alteração) --- */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>E-mail</FormLabel>
                    <FormControl>
                      {/* Deixamos o e-mail desabilitado para o usuário não mudar */}
                      <Input
                        placeholder="seu@email.com"
                        {...field}
                        readOnly
                        className="bg-neutral-100"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="fourDigitCode"
                render={({ field }) => (
                  <FormItem className="flex flex-col items-center">
                    <FormLabel>Código de 4 Caracteres</FormLabel>
                    <FormControl>
                      <InputOTP
                        maxLength={4}
                        onChange={(value) => {
                          field.onChange(value.toUpperCase());
                        }}
                        value={field.value}
                        name={field.name}
                        onBlur={field.onBlur}
                        ref={field.ref}
                        disabled={field.disabled}
                      >
                        <InputOTPGroup>
                          <InputOTPSlot index={0} />
                          <InputOTPSlot index={1} />
                          <InputOTPSlot index={2} />
                          <InputOTPSlot index={3} />
                        </InputOTPGroup>
                      </InputOTP>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* --- 6. CAMPO DE NOVA SENHA (ATUALIZADO COM ÍCONE) --- */}
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nova Senha</FormLabel>
                    <div className="relative">
                      <FormControl>
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder="********"
                          className="pr-10" // Padding para o ícone
                          {...field}
                        />
                      </FormControl>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-0 h-full px-3 py-2 text-neutral-500 hover:text-neutral-700"
                        onClick={() => setShowPassword((prev) => !prev)}
                        tabIndex={-1} // Impede que o botão seja focado com 'Tab'
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* --- 7. CAMPO DE CONFIRMAR SENHA (ATUALIZADO COM ÍCONE) --- */}
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirme a Nova Senha</FormLabel>
                    <div className="relative">
                      <FormControl>
                        <Input
                          type={showConfirmPassword ? "text" : "password"}
                          placeholder="********"
                          className="pr-10"
                          {...field}
                        />
                      </FormControl>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-0 h-full px-3 py-2 text-neutral-500 hover:text-neutral-700"
                        onClick={() => setShowConfirmPassword((prev) => !prev)}
                        tabIndex={-1}
                      >
                        {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" disabled={isPending}>
                {isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    <KeyRound className="h-4 w-4 mr-2" />
                    Salvar Nova Senha
                  </>
                )}
              </Button>

            </form>
          </Form>

          <div className="mt-6 text-center">
            <Button variant="link" asChild className="text-neutral-600">
              <Link href="/br/auth/sign-in">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar para o Login
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}