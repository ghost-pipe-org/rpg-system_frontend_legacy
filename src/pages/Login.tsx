import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Link } from "react-router";
import { useEffect } from "react";
import { toast } from "sonner";
import { Toaster } from "sonner";
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
import { loginSchema, type LoginFormData } from "../schemas/auth.schemas";
import { useAppNavigation } from "../hooks/useAuth";
import { ROUTES } from "../routes/routes";
import logo from "../assets/icons/logo.png";

export default function LogIn() {
  const { goToHome } = useAppNavigation();
  const { login, isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      toast.info("Você já está logado! Redirecionando...");
      goToHome();
    }
  }, [isAuthenticated, goToHome]);

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
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

  async function onSubmit(values: LoginFormData) {
    try {
      await login(values);
      toast.success("Login realizado com sucesso!");
      goToHome();
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Erro ao fazer login";
      toast.error(errorMessage);
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-stretch">
      <Toaster className="text-foreground" />
      {/* Painel esquerdo — branding */}
      <div
        className="hidden lg:flex flex-col items-center justify-center flex-1 relative overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, var(--secondary) 0%, var(--background) 60%, var(--chart-4) 100%)',
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
                    <FormLabel className="font-prompt">Senha</FormLabel>
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

              <Button type="submit" className="w-full font-prompt uppercase">
                Entrar
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}
