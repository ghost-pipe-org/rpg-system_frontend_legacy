import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Link, useSearchParams } from "react-router";
import { toast } from "sonner";
import { CheckCircle2 } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../components/ui/form";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import {
  forgotPasswordSchema,
  resetPasswordSchema,
  type ForgotPasswordFormData,
  type ResetPasswordFormData,
} from "../schemas/auth.schemas";
import { authService } from "../services";
import { useAppNavigation } from "../hooks/useAuth";
import { ROUTES } from "../routes/routes";
import logo from "../assets/icons/logo.png";
import bgArt from "../assets/images/bg_art.png";

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token")?.trim() ?? "";
  const { goToLogin } = useAppNavigation();

  const [isLoading, setIsLoading] = useState(false);
  const [emailSentTo, setEmailSentTo] = useState<string | null>(null);

  const forgotForm = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const resetForm = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  async function onRequestReset(values: ForgotPasswordFormData) {
    setIsLoading(true);
    try {
      const targetEmail = values.email.trim();
      const response = await authService.forgotPassword(targetEmail);
      setEmailSentTo(targetEmail);
      toast.success(
        response.message ||
          "Se existir uma conta com este e-mail, um link de redefinição foi enviado."
      );
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Não foi possível solicitar a recuperação de senha";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }

  async function onResetPassword(values: ResetPasswordFormData) {
    setIsLoading(true);
    try {
      await authService.resetPassword({
        token,
        password: values.password,
      });
      toast.success("Senha redefinida com sucesso! Faça login com a nova senha.");
      goToLogin();
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Não foi possível redefinir a senha";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div
      className="min-h-screen flex items-stretch bg-gradient-to-b from-background to-primary bg-fixed bg-cover bg-center"
      style={{
        backgroundImage: `radial-gradient(var(--chart-1), var(--chart-4)), url(${bgArt})`,
        backgroundBlendMode: "multiply",
      }}
    >
      <div
        className="hidden lg:flex flex-col items-center justify-center flex-1 relative overflow-hidden bg-background/80"
        style={{
          backdropFilter: "blur(12px)",
          borderRight: "1px solid rgba(255,255,255,0.05)",
        }}
      >
        <div
          className="absolute top-20 left-10 w-64 h-64 rounded-full opacity-20"
          style={{ background: "radial-gradient(circle, var(--primary), transparent)" }}
        />
        <div
          className="absolute bottom-20 right-10 w-48 h-48 rounded-full opacity-15"
          style={{ background: "radial-gradient(circle, var(--accent), transparent)" }}
        />

        <div className="relative z-10 flex flex-col items-center gap-6 px-12 text-center">
          <img src={logo} alt="Logo" className="w-24 h-24 drop-shadow-lg" />
          <h1
            className="font-pixelsans text-4xl text-white leading-tight"
            style={{ textShadow: "0 0 30px rgba(17,192,184,0.5)" }}
          >
            Interfaces Narrativas
          </h1>
          <p className="text-muted-foreground text-lg max-w-xs">
            Recupere o acesso à sua conta de forma rápida e segura.
          </p>
        </div>
      </div>

      <div className="flex flex-1 items-center justify-center px-6 py-12">
        <div
          className="w-full max-w-md rounded-2xl p-8 border border-border"
          style={{
            background: "rgba(20, 20, 35, 0.8)",
            backdropFilter: "blur(16px)",
            boxShadow: "0 8px 32px rgba(0,0,0,0.4), 0 0 0 1px rgba(113,86,247,0.1)",
          }}
        >
          <div className="flex lg:hidden items-center gap-3 mb-8">
            <img src={logo} alt="Logo" className="w-10 h-10" />
            <span className="font-pixelsans text-xl text-white">Interfaces Narrativas</span>
          </div>

          {token ? (
            <>
              <h2 className="text-2xl font-semibold text-foreground mb-2">
                Nova senha
              </h2>
              <p className="text-muted-foreground text-sm mb-8">
                Escolha uma nova senha segura para sua conta
              </p>

              <Form {...resetForm}>
                <form onSubmit={resetForm.handleSubmit(onResetPassword)} className="space-y-5">
                  <FormField
                    control={resetForm.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-prompt">Nova Senha</FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            placeholder="Digite sua nova senha"
                            className="font-prompt"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={resetForm.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-prompt">Confirmar Nova Senha</FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            placeholder="Confirme sua nova senha"
                            className="font-prompt"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button type="submit" className="w-full font-prompt uppercase" disabled={isLoading}>
                    {isLoading ? "Salvando..." : "Redefinir Senha"}
                  </Button>
                </form>
              </Form>
            </>
          ) : emailSentTo ? (
            <div className="flex flex-col items-center text-center gap-4">
              <CheckCircle2 className="w-12 h-12 text-emerald-400" />
              <h2 className="text-2xl font-semibold text-foreground">
                Verifique seu e-mail
              </h2>
              <p className="text-muted-foreground text-sm font-prompt">
                Se existir uma conta vinculada a <strong className="text-foreground">{emailSentTo}</strong>, enviamos um link para redefinir sua senha.
              </p>
              <Button
                type="button"
                variant="outline"
                className="w-full font-prompt uppercase mt-2"
                onClick={() => setEmailSentTo(null)}
              >
                Tentar outro e-mail
              </Button>
            </div>
          ) : (
            <>
              <h2 className="text-2xl font-semibold text-foreground mb-2">
                Recuperar senha
              </h2>
              <p className="text-muted-foreground text-sm mb-8">
                Informe o e-mail da sua conta para receber o link de redefinição
              </p>

              <Form {...forgotForm}>
                <form onSubmit={forgotForm.handleSubmit(onRequestReset)} className="space-y-5">
                  <FormField
                    control={forgotForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-prompt">Email</FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="seu@email.com"
                            className="font-prompt"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button type="submit" className="w-full font-prompt uppercase" disabled={isLoading}>
                    {isLoading ? "Enviando..." : "Enviar Link"}
                  </Button>
                </form>
              </Form>
            </>
          )}

          <div className="mt-6 text-center text-sm font-prompt text-muted-foreground">
            Lembrou sua senha?{" "}
            <Link
              to={ROUTES.LOGIN}
              className="text-accent hover:text-primary no-underline hover:cursor-pointer"
            >
              Voltar para o login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

