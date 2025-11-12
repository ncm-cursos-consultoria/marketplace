"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { Loader2, Mail, ArrowLeft } from "lucide-react";

// Imports de UI
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import Image from "next/image";
import logo from "@/assets/ncm-logo.png"; // Importe seu logo

// Import da nova service
import { sendRecoveryCode } from "@/service/auth/send-recovery-code";

// Schema de validação para este formulário
const forgotPasswordSchema = z.object({
  email: z.string().email({ message: "Por favor, insira um e-mail válido." }),
});

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordPage() {
  const [isSuccess, setIsSuccess] = useState(false); // Controla a msg de sucesso
  
  const form = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: sendRecoveryCode,
    onSuccess: () => {
      toast.success("E-mail de recuperação enviado!");
      setIsSuccess(true); // Mostra a mensagem de sucesso
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.message || "E-mail não encontrado ou falha no envio.";
      toast.error(errorMessage);
    },
  });

  function onSubmit(data: ForgotPasswordFormData) {
    mutate(data);
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-100 p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center">
          <Image src={logo} alt="NCM Marketplace" width={150} className="mx-auto" />
          <CardTitle className="text-2xl pt-4">Recuperar Senha</CardTitle>
          <CardDescription>
            {isSuccess
              ? "Verifique sua caixa de entrada!"
              : "Digite seu e-mail para enviarmos um código de recuperação."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isSuccess ? (
            // --- TELA DE SUCESSO ---
            <div className="text-center space-y-4">
              <p className="text-neutral-700">
                Enviamos um e-mail para <strong>{form.getValues("email")}</strong> com
                um código de 4 dígitos e as instruções para redefinir sua senha.
              </p>
              <p className="text-sm text-neutral-500">
                (Não se esqueça de checar sua caixa de spam)
              </p>
            </div>
          ) : (
            // --- FORMULÁRIO DE PEDIDO ---
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>E-mail</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="seu@email.com"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" disabled={isPending}>
                  {isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <>
                      <Mail className="h-4 w-4 mr-2" />
                      Enviar Código
                    </>
                  )}
                </Button>
              </form>
            </Form>
          )}

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