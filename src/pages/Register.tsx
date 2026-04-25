import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
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
import { Checkbox } from "../components/ui/checkbox";
import { Label } from "../components/ui/label";
import { Link } from "react-router";
import { createUser } from "../services";
import { registerSchema, type RegisterFormData } from "../schemas/auth.schemas";
import { useAppNavigation } from "../hooks/useAuth";
import { useAuth } from "../context/AuthContext";
import { ROUTES } from "../routes/routes";
import { formatPhoneNumber } from "../utils/formatPhoneNumber";
import logo from "../assets/icons/logo.png";

export default function SingUp() {
  const [isLoading, setIsLoading] = useState(false);
  const { goToLogin, goToHome } = useAppNavigation();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      toast.info("Você já está logado! Redirecionando...");
      goToHome();
    }
  }, [isAuthenticated, goToHome]);

  const form = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullname: "",
      email: "",
      masterConfirm: false,
      registrationNumber: "",
      phone: "",
      password: "",
      confirmPassword: "",
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

  async function onSubmit(values: RegisterFormData) {
    setIsLoading(true);
    try {
      const userData = {
        name: values.fullname,
        email: values.email,
        password: values.password,
        enrollment: values.registrationNumber || undefined,
        phoneNumber: values.phone.replace(/\D/g, ''), // Remove formatação: (83) 99999-9999 -> 83999999999
        masterConfirm: values.masterConfirm,
      };

      await createUser(userData);
      toast.success("Conta criada com sucesso! Faça login para continuar.");
      goToLogin();
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Erro ao criar conta";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
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
        <div className="absolute top-20 left-10 w-64 h-64 rounded-full opacity-20" style={{ background: 'radial-gradient(circle, var(--primary), transparent)' }} />
        <div className="absolute bottom-20 right-10 w-48 h-48 rounded-full opacity-15" style={{ background: 'radial-gradient(circle, var(--accent), transparent)' }} />

        <div className="relative z-10 flex flex-col items-center gap-6 px-12 text-center">
          <img src={logo} alt="Logo" className="w-24 h-24 drop-shadow-lg" />
          <h1 className="font-pixelsans text-4xl text-white leading-tight" style={{ textShadow: '0 0 30px rgba(17,192,184,0.5)' }}>
            Interfaces Narrativas
          </h1>
          <p className="text-muted-foreground text-lg max-w-xs">
            Crie sua conta e faça parte da comunidade de RPG.
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

          <h2 className="text-2xl font-semibold text-foreground mb-2">Crie sua conta</h2>
          <p className="text-muted-foreground text-sm mb-8">Preencha os dados abaixo para se cadastrar</p>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              <FormField
                control={form.control}
                name="fullname"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-prompt">Nome Completo</FormLabel>
                    <FormControl>
                      <Input placeholder="Seu nome completo" className="font-prompt" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-prompt">Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="seu@email.com" className="font-prompt" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="masterConfirm"
                render={({ field }) => (
                  <FormItem className="flex items-start space-x-3 space-y-0 rounded-md p-2">
                    <FormControl>
                      <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                    <div className="flex flex-col gap-1">
                      <Label className="font-prompt">Desejo mestrar</Label>
                      <p className="text-muted-foreground text-sm font-prompt">
                        Ao selecionar esta opção, você confirma que{" "}
                        <span className="bg-gradient-to-l from-primary to-accent bg-clip-text text-transparent">
                          deseja emitir mesas de RPG.
                        </span>
                      </p>
                    </div>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="registrationNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-prompt">Número de Matrícula (Obrigatório para mestres)</FormLabel>
                    <FormControl>
                      <Input placeholder="Sua matrícula" className="font-prompt" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-prompt">Telefone</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="(00) 99999-9999"
                        className="font-prompt"
                        {...field}
                        onChange={(e) => {
                          const formatted = formatPhoneNumber(e.target.value);
                          field.onChange(formatted);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 gap-4">
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-prompt">Senha</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="Digite sua senha" className="font-prompt" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-prompt">Confirmar Senha</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="Digite sua senha novamente" className="font-prompt" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormDescription className="flex justify-center gap-1 font-prompt">
                Já tem uma conta?
                <Link to={ROUTES.LOGIN} className="text-accent hover:text-primary no-underline hover:cursor-pointer">
                  Faça login
                </Link>
              </FormDescription>

              <Button type="submit" className="w-full font-prompt uppercase" disabled={isLoading}>
                {isLoading ? "Criando conta..." : "Criar conta"}
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}
