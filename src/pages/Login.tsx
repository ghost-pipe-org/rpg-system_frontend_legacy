import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Link } from "react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../components/ui/form";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { useAuth } from "../context/AuthContext";
import { ApiRequestError, authService } from "../services";
import { loginSchema, type LoginFormData } from "../schemas/auth.schemas";
import { useAppNavigation } from "../hooks/useAuth";
import { ROUTES } from "../routes/routes";
import logo from "../assets/icons/logo.png";
import bgArt from "../assets/images/bg_art.png";
import { House, CalendarDays, Mail } from "lucide-react";

const UNVERIFIED_EMAIL_STORAGE_KEY = "unverified_login_email";

export default function LogIn() {
  const { goToHome } = useAppNavigation();
  const { login, isAuthenticated, isLoading } = useAuth();
  const [unverifiedEmail, setUnverifiedEmail] = useState<string | null>(() => {
    try {
      return sessionStorage.getItem(UNVERIFIED_EMAIL_STORAGE_KEY);
    } catch {
      return null;
    }
  });
  const [isResending, setIsResending] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      toast.info("Você já está logado! Redirecionando...");
      goToHome();
    }
  }, [isAuthenticated, goToHome]);

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: unverifiedEmail ?? "",
      password: "",
    },
  });

  if (isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl text-foreground mb-4">Redirecionando...</h1>
          <p className="text-muted-foreground">
            Você já está logado. Redirecionando para a página inicial.
          </p>
        </div>
      </div>
    );
  }

  function rememberUnverifiedEmail(email: string) {
    setUnverifiedEmail(email);
    try {
      sessionStorage.setItem(UNVERIFIED_EMAIL_STORAGE_KEY, email);
    } catch {
      void 0;
    }
  }

  function clearUnverifiedEmail() {
    setUnverifiedEmail(null);
    try {
      sessionStorage.removeItem(UNVERIFIED_EMAIL_STORAGE_KEY);
    } catch {
      void 0;
    }
  }

  async function onSubmit(values: LoginFormData) {
    try {
      await login(values);
      clearUnverifiedEmail();
      toast.success("Login realizado com sucesso!");
      goToHome();
    } catch (error: unknown) {
      if (error instanceof ApiRequestError && error.code === "EMAIL_NOT_VERIFIED") {
        rememberUnverifiedEmail(values.email.trim());
        toast.error(error.message || "Confirme seu e-mail antes de fazer login.");
        return;
      }
      const errorMessage = error instanceof Error ? error.message : "Erro ao fazer login";
      toast.error(errorMessage);
    }
  }

  async function handleResendVerification() {
    const email = (unverifiedEmail || form.getValues("email")).trim();
    if (!email) {
      toast.error("Informe seu e-mail para reenviar a confirmação.");
      return;
    }

    setIsResending(true);
    try {
      await authService.resendVerification(email);
      toast.success("Reenviamos um novo link de confirmação para o seu e-mail.");
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Erro ao reenviar verificação";
      toast.error(errorMessage);
    } finally {
      setIsResending(false);
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
      {/* Painel esquerdo — branding */}
      <div
        className="hidden lg:flex flex-col items-center justify-center flex-1 relative overflow-hidden bg-background/80"
        style={{
          backdropFilter: "blur(12px)",
          borderRight: "1px solid rgba(255,255,255,0.05)"
        }}
      >
        {/* Orbs decorativos */}
        <div className="absolute top-20 left-10 w-64 h-64 rounded-full opacity-20" style={{ background: 'radial-gradient(circle, var(--primary), transparent)' }} />
        <div className="absolute bottom-20 right-10 w-48 h-48 rounded-full opacity-15" style={{ background: 'radial-gradient(circle, var(--accent), transparent)' }} />

        <div className="relative z-10 flex flex-col items-center gap-6 px-12 text-center">
          <img src={logo} alt="Logo" className="w-24 h-24 drop-shadow-lg" />
          <h1 className="font-pixelsans text-4xl text-white leading-tight" style={{ textShadow: '0 0 30px rgba(17,192,184,0.5)' }}>
            Interfaces Narrativas
          </h1>
          <p className="text-muted-foreground text-lg max-w-xs">
            O sistema de gerenciamento de sessões de RPG da sua comunidade.
          </p>
        </div>
      </div>

      {/* Painel direito — formulário */}
      <div className="flex flex-1 items-center justify-center px-6 py-12">
        <div
          className="w-full max-w-md rounded-2xl p-8 border border-border"
          style={{
            background: 'rgba(20, 20, 35, 0.8)',
            backdropFilter: 'blur(16px)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.4), 0 0 0 1px rgba(113,86,247,0.1)',
          }}
        >
          {/* Logo mobile */}
          <div className="flex lg:hidden items-center gap-3 mb-8">
            <img src={logo} alt="Logo" className="w-10 h-10" />
            <span className="font-pixelsans text-xl text-white">Interfaces Narrativas</span>
          </div>

          <h2 className="text-2xl font-semibold text-foreground mb-2">Bem-vindo de volta</h2>
          <p className="text-muted-foreground text-sm mb-8">Entre com sua conta para continuar</p>

          {unverifiedEmail && (
            <div className="mb-6 rounded-xl border border-amber-500/40 bg-amber-500/10 p-4 space-y-3">
              <div className="flex items-start gap-2.5 text-sm font-prompt text-amber-200">
                <Mail className="w-4 h-4 mt-0.5 shrink-0 text-amber-400" />
                <div className="space-y-2">
                  <p>
                    Agora é necessário ter um <strong>e-mail válido e verificado</strong> para acessar sua conta. Enviamos um link de confirmação para <strong>{unverifiedEmail}</strong>.
                  </p>
                  <p className="text-xs text-amber-200/80">
                    Caso esse e-mail não seja válido ou você queira trocá-lo, entre em contato conosco em{" "}
                    <a
                      href="mailto:rpg.uepbpatos@gmail.com"
                      className="underline hover:text-white"
                    >
                      rpg.uepbpatos@gmail.com
                    </a>{" "}
                    ou pelo Instagram{" "}
                    <a
                      href="https://www.instagram.com/rpg.uepbpatos"
                      target="_blank"
                      rel="noreferrer"
                      className="underline hover:text-white"
                    >
                      @rpg.uepbpatos
                    </a>
                    .
                  </p>
                </div>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={isResending}
                onClick={handleResendVerification}
                className="w-full font-prompt text-xs uppercase"
              >
                {isResending ? "Reenviando..." : "Reenviar e-mail de confirmação"}
              </Button>
            </div>
          )}

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-prompt">Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="Insira seu email"
                        className="font-prompt"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center justify-between">
                      <FormLabel className="font-prompt">Senha</FormLabel>
                      <Link
                        to={ROUTES.RESET_PASSWORD}
                        className="text-xs font-prompt text-accent hover:text-primary no-underline"
                      >
                        Esqueceu a senha?
                      </Link>
                    </div>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Insira sua senha"
                        className="font-prompt"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormDescription className="flex justify-center gap-1 font-prompt">
                Não possuí uma conta?
                <Link to={ROUTES.REGISTER} className="text-accent hover:text-primary no-underline hover:cursor-pointer">
                  Criar uma conta.
                </Link>
              </FormDescription>

              <Button type="submit" disabled={isLoading} className="w-full font-prompt uppercase">
                {isLoading ? "Entrando..." : "Entrar"}
              </Button>

              {/* Acesso sem conta */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border" />
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="bg-[rgba(20,20,35,0.8)] px-3 text-muted-foreground font-prompt">
                    ou acesse sem conta
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Link to={ROUTES.HOME}>
                  <Button variant="outline" type="button" className="w-full font-prompt text-xs gap-1.5">
                    <House size={14} /> Página inicial
                  </Button>
                </Link>
                <Link to={ROUTES.SESSIONS}>
                  <Button variant="outline" type="button" className="w-full font-prompt text-xs gap-1.5">
                    <CalendarDays size={14} /> Ver eventos
                  </Button>
                </Link>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}
