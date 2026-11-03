import { useEffect, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router";
import { toast } from "sonner";
import { CheckCircle2, Loader2, Mail, XCircle } from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { authService, getUserProfile } from "../services";
import { useAuth } from "../context/AuthContext";
import { ROUTES } from "../routes/routes";
import logo from "../assets/icons/logo.png";
import bgArt from "../assets/images/bg_art.png";

const verificationRequests = new Map<string, Promise<{ message: string }>>();

function verifyTokenOnce(token: string) {
  const existing = verificationRequests.get(token);
  if (existing) {
    return existing;
  }
  const request = authService.verifyEmail(token);
  verificationRequests.set(token, request);
  return request;
}

export default function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const { isAuthenticated, user, updateUser } = useAuth();
  const authSnapshotRef = useRef({ isAuthenticated, user, updateUser });
  authSnapshotRef.current = { isAuthenticated, user, updateUser };
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("Confirmando seu e-mail...");
  const [resendEmail, setResendEmail] = useState("");
  const [isResending, setIsResending] = useState(false);

  useEffect(() => {
    const token = searchParams.get("token")?.trim();

    if (!token) {
      setStatus("error");
      setMessage("Link de verificação inválido ou incompleto.");
      return;
    }

    let active = true;

    verifyTokenOnce(token)
      .then(async (response) => {
        if (!active) return;

        if (authSnapshotRef.current.isAuthenticated) {
          try {
            const profile = await getUserProfile();
            if (profile?.data?.user) {
              authSnapshotRef.current.updateUser({
                ...authSnapshotRef.current.user,
                ...profile.data.user,
              });
            }
          } catch {
            void 0;
          }
        }

        setStatus("success");
        setMessage(
          response.message || "E-mail confirmado com sucesso!"
        );
        toast.success("E-mail verificado com sucesso!");
      })
      .catch((error: unknown) => {
        if (!active) return;
        const errorMessage =
          error instanceof Error
            ? error.message
            : "Não foi possível confirmar o e-mail.";
        setStatus("error");
        setMessage(errorMessage);
      });

    return () => {
      active = false;
    };
  }, [searchParams]);

  async function handleResend(e: React.FormEvent) {
    e.preventDefault();
    const targetEmail = resendEmail.trim();
    if (!targetEmail) {
      toast.error("Informe seu e-mail para reenviar o link.");
      return;
    }

    setIsResending(true);
    try {
      await authService.resendVerification(targetEmail);
      toast.success("Se a conta existir e estiver pendente, um novo link foi enviado.");
      setResendEmail("");
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
            Confirmação de endereço de e-mail da sua conta.
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

          <div className="flex flex-col items-center text-center gap-4">
            {status === "loading" && (
              <Loader2 className="w-12 h-12 text-primary animate-spin" />
            )}
            {status === "success" && (
              <CheckCircle2 className="w-12 h-12 text-emerald-400" />
            )}
            {status === "error" && (
              <XCircle className="w-12 h-12 text-destructive" />
            )}

            <h2 className="text-2xl font-semibold text-foreground">
              Verificação de E-mail
            </h2>
            <p className="text-muted-foreground text-sm font-prompt">{message}</p>

            {status === "success" && (
              <div className="w-full pt-4">
                <Link to={isAuthenticated ? ROUTES.PROFILE : ROUTES.LOGIN}>
                  <Button className="w-full font-prompt uppercase">
                    {isAuthenticated ? "Ir para Meu Perfil" : "Ir para o Login"}
                  </Button>
                </Link>
              </div>
            )}

            {status === "error" && (
              <div className="w-full pt-4 space-y-5 text-left">
                <form onSubmit={handleResend} className="space-y-3">
                  <Label className="font-prompt text-sm">
                    Precisa de um novo link de confirmação?
                  </Label>
                  <Input
                    type="email"
                    placeholder="Digite seu email"
                    className="font-prompt"
                    value={resendEmail}
                    onChange={(e) => setResendEmail(e.target.value)}
                  />
                  <Button
                    type="submit"
                    variant="outline"
                    disabled={isResending}
                    className="w-full font-prompt uppercase gap-2"
                  >
                    <Mail size={16} />
                    {isResending ? "Enviando..." : "Reenviar Link"}
                  </Button>
                </form>

                <Link to={ROUTES.LOGIN} className="block">
                  <Button variant="ghost" type="button" className="w-full font-prompt">
                    Voltar para o Login
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
