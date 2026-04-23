import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import type { Session } from "@/services/sessionServices/session.types";
import { enrollInSession, cancelEnrollment } from "@/services/sessionServices/session.services";
import { toast } from "sonner";
import { useState } from "react";
import { formatDateBR } from "@/utils/formatDate";


export function SessionSkeleton() {
  return (
    <Card className="mb-6 bg-background border-1 border-accent">
      <CardHeader className="flex flex-row items-start gap-4 pb-3 font-pixelsans">
        <Skeleton className="w-16 h-16 rounded animate-pulse" />
        <div className="space-y-1 flex-1">
          <Skeleton className="h-8 w-3/4 animate-pulse" />
          <Skeleton className="h-4 w-1/2 animate-pulse" />
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Skeleton className="h-4 w-full animate-pulse" />
          <Skeleton className="h-4 w-full animate-pulse" />
          <Skeleton className="h-4 w-2/3 animate-pulse" />
        </div>
        <Skeleton className="h-10 w-full animate-pulse" />
      </CardContent>
    </Card>
  );
}

interface SessionCardProps {
  session: Session;
  isExpanded: boolean;
  onToggleExpand: (sessionId: string) => void;
  onEnrollSuccess?: () => void;
  onCancelSuccess?: () => void;
  variant?: 'default' | 'enrolled';
}

const systemLogos: Record<string, string> = {
  'D&D 5e': '/icons/d&d-logo.svg',
  'Vampiro: A Máscara': '/icons/vampiro-logo.png',
  'Kaos em Nova Patos': '/logos/kaos.png',
  'Ordem Paranormal': '/icons/ordem-paranormal-logo.svg',
  'Tormenta20': '/icons/t20-logo.png',
  'Pathfinder 2e': '/icons/pathfinder-logo.png',
  'Call of Cthulhu': '/icons/coc-logo.png',
  'Outros': '/icons/logo.png'
};

export function SessionCard({
  session,
  isExpanded,
  onToggleExpand,
  onEnrollSuccess,
  onCancelSuccess,
  variant = 'default',
}: SessionCardProps) {
  const [enrolling, setEnrolling] = useState(false);
  const [canceling, setCanceling] = useState(false);

  const isEnrollmentClosed = session.approvedDate 
    ? new Date().setHours(0,0,0,0) >= new Date(session.approvedDate).setHours(0,0,0,0)
    : false;

  const isCancellationWindowClosed = session.approvedDate
    ? (new Date(session.approvedDate).getTime() - Date.now()) / (1000 * 60 * 60) < 24
    : false;

  const handleEnroll = async () => {
    if (!session.id) {
      toast.error("ID da sessão não encontrado");
      return;
    }

    try {
      setEnrolling(true);
      await enrollInSession(session.id);
      toast.success("Inscrição realizada com sucesso!");
      
      // Chama callback para atualizar a lista
      if (onEnrollSuccess) {
        onEnrollSuccess();
      }
    } catch (error: unknown) {
      console.error("Erro ao se inscrever:", error);
      
      let errorMessage = "Erro ao realizar inscrição";
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as { response?: { data?: { message?: string } } };
        errorMessage = axiosError.response?.data?.message || errorMessage;
      }
      
      toast.error(errorMessage);
    } finally {
      setEnrolling(false);
    }
  };

  const handleCancelEnrollment = async () => {
    if (!session.id) {
      toast.error("ID da sessão não encontrado");
      return;
    }

    try {
      setCanceling(true);
      await cancelEnrollment(session.id);
      toast.success("Inscrição cancelada com sucesso!");
      
      if (onCancelSuccess) {
        onCancelSuccess();
      }
    } catch (error: unknown) {
      console.error("Erro ao cancelar inscrição:", error);
      
      let errorMessage = "Erro ao cancelar inscrição";
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as { response?: { data?: { message?: string } } };
        errorMessage = axiosError.response?.data?.message || errorMessage;
      }
      
      toast.error(errorMessage);
    } finally {
      setCanceling(false);
    }
  };

  const systemLogo = systemLogos[session.system] || systemLogos['Outros'];

  return (
    <Card className="mb-6 bg-background border-1 border-accent">
      <CardHeader className="flex flex-row items-start gap-4 pb-3 font-pixelsans text-foreground">
      <img
        src={systemLogo}
        alt={session.system}
        className="w-16 h-16 object-contain"
        onError={(e) => {
          e.currentTarget.src = systemLogos['Outros'];
        }}
      />

        <div className="space-y-1">
          <CardTitle className="text-2xl">{session.title}</CardTitle>
          <p className="text-sm text-muted-foreground font-prompt">
            {session.system} | {session.approvedDate ? formatDateBR(session.approvedDate) : (session.createdAt && formatDateBR(session.createdAt))} |{" "}
            {session.period}
          </p>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <p className="leading-relaxed text-foreground">{session.description}</p>

        <div className="flex justify-between items-center">
          <Button
            variant="outline"
            size="sm"
            onClick={() => session.id && onToggleExpand(session.id)}
            className="text text-accent-foreground font-semibold cursor-pointer py-2 uppercase w-full"
          >
            <span className="text-sm">Saiba</span>
            <span>{isExpanded ? "−" : "+"}</span>
          </Button>
        </div>

        {isExpanded && (
          <div className="space-y-4 animate-in fade-in duration-300">
            <Separator />

            <div className="space-y-3 text-foreground">
              <p>
                <strong className="font-mono">Mestre:</strong> {session.master?.name || 'Não informado'}
              </p>
              <p>
                <strong className="font-mono">Local:</strong> {session.location || 'Não informado'}
              </p>
              <p>
                <strong className="font-mono">Vagas disponíveis:</strong>
                <Badge
                  variant={(session.slots || 0) > 0 ? "secondary" : "destructive"}
                  className="ml-2"
                >
                  {session.slots || 0}
                </Badge>
              </p>
              <div className="space-y-1">
                <p>
                  <strong className="font-mono">
                    Requisitos de participação:
                  </strong>{" "}
                  {session.requirements}
                </p>
              </div>
            </div>

            {variant === 'default' ? (
              <Button
                className="w-full mt-2 uppercase"
                disabled={(session.slots || 0) === 0 || enrolling || isEnrollmentClosed}
                onClick={handleEnroll}
              >
                {enrolling 
                  ? "Inscrevendo..." 
                  : isEnrollmentClosed
                    ? "Inscrições Encerradas"
                    : (session.slots || 0) > 0 
                      ? "Inscreva-se" 
                      : "Sem Vagas Disponíveis"
                }
              </Button>
            ) : (
              <Button
                variant="destructive"
                className="w-full mt-2 uppercase"
                disabled={canceling || isCancellationWindowClosed}
                onClick={handleCancelEnrollment}
                title={
                  isCancellationWindowClosed
                    ? "Não é possível cancelar com menos de 24h de antecedência"
                    : undefined
                }
              >
                {canceling
                  ? "Cancelando..."
                  : isCancellationWindowClosed
                    ? "Prazo de cancelamento encerrado"
                    : "Cancelar Inscrição"
                }
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
