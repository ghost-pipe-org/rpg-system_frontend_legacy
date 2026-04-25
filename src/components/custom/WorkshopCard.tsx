import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollText, CheckCircle2 } from "lucide-react";
import type { Session } from "@/services/sessionServices/session.types";
import { enrollInWorkshop, cancelWorkshopEnrollment } from "@/services/sessionServices/session.services";
import { toast } from "sonner";
import { useState } from "react";
import { formatDateBR } from "@/utils/formatDate";


export function WorkshopSkeleton() {
  return (
    <Card className="mb-6 bg-background border-1 border-accent">
      <CardHeader className="flex flex-row items-start gap-4 pb-3 font-pixelsans">
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

interface WorkshopCardProps {
  workshop: Session;
  isExpanded: boolean;
  onToggleExpand: (workshopId: string) => void;
  onEnrollSuccess?: () => void;
  onCancelSuccess?: () => void;
  variant?: 'default' | 'enrolled';
}

export function WorkshopCard({
  workshop,
  isExpanded,
  onToggleExpand,
  onEnrollSuccess,
  onCancelSuccess,
  variant = 'default',
}: WorkshopCardProps) {
  const [enrolling, setEnrolling] = useState(false);
  const [canceling, setCanceling] = useState(false);
  const [justEnrolled, setJustEnrolled] = useState(false);

  const isEnrollmentClosed = workshop.approvedDate 
    ? new Date().setHours(0,0,0,0) >= new Date(workshop.approvedDate).setHours(0,0,0,0)
    : false;

  const isCancellationWindowClosed = workshop.approvedDate
    ? (new Date(workshop.approvedDate).getTime() - Date.now()) / (1000 * 60 * 60) < 24
    : false;

  const handleEnroll = async () => {
    if (!workshop.id) {
      toast.error("ID da oficina não encontrado");
      return;
    }

    try {
      setEnrolling(true);
      await enrollInWorkshop(workshop.id);
      toast.success("Inscrição realizada com sucesso!");
      setJustEnrolled(true);
      setTimeout(() => setJustEnrolled(false), 3000);
      
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
      
      if (errorMessage.toLowerCase().includes("token") || errorMessage.toLowerCase().includes("unauthorized")) {
        errorMessage = "Faça login para se inscrever neste evento.";
      }

      toast.error(errorMessage);
    } finally {
      setEnrolling(false);
    }
  };

  const handleCancelEnrollment = async () => {
    if (!workshop.id) {
      toast.error("ID da oficina não encontrado");
      return;
    }

    try {
      setCanceling(true);
      await cancelWorkshopEnrollment(workshop.id);
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

  const facilitatorNames = workshop.facilitators
    ? workshop.facilitators.map(f => f.user.name).join(', ')
    : 'Não informado';

  return (
    <Card className="mb-6 bg-background border-1 border-accent">
      <CardHeader className="flex flex-row items-start gap-4 pb-3 font-pixelsans text-foreground">
        <div className="w-16 h-16 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0">
          <ScrollText className="w-8 h-8 text-primary" />
        </div>
        <div className="space-y-1">
          <CardTitle className="text-2xl">{workshop.title}</CardTitle>
          <p className="text-sm text-muted-foreground font-prompt">
            {workshop.approvedDate ? formatDateBR(workshop.approvedDate) : (workshop.createdAt && formatDateBR(workshop.createdAt))} |{" "}
            {workshop.period}
          </p>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <p className="leading-relaxed text-foreground">{workshop.description}</p>

        <div className="flex justify-between items-center">
          <Button
            variant="outline"
            size="sm"
            onClick={() => workshop.id && onToggleExpand(workshop.id)}
            className="text text-accent-foreground font-semibold cursor-pointer py-2 uppercase w-full gap-2"
          >
            <span className="text-sm">Saiba</span>
            <span
              className="inline-block transition-transform duration-300 ease-in-out"
              style={{ transform: isExpanded ? 'rotate(45deg)' : 'rotate(0deg)' }}
            >+</span>
          </Button>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateRows: isExpanded ? '1fr' : '0fr',
            transition: 'grid-template-rows 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
        >
          <div style={{ overflow: 'hidden' }}>
          <div className="space-y-4 pt-2">
            <Separator />

            <div className="space-y-3 text-foreground">
              <p>
                <strong className="font-mono">Ministrante(s):</strong> {facilitatorNames}
              </p>
              <p>
                <strong className="font-mono">Local:</strong> {workshop.location || 'Não informado'}
              </p>
              <p>
                <strong className="font-mono">Vagas disponíveis:</strong>
                <Badge
                  variant={(workshop.slots || 0) > 0 ? "secondary" : "destructive"}
                  className="ml-2"
                >
                  {workshop.slots || 0}
                </Badge>
              </p>
              {workshop.requirements && (
                <div className="space-y-1">
                  <p>
                    <strong className="font-mono">
                      Requisitos de participação:
                    </strong>{" "}
                    {workshop.requirements}
                  </p>
                </div>
              )}
            </div>

            {variant === 'default' ? (
              <Button
                className={`w-full mt-2 uppercase transition-all duration-300 ${justEnrolled ? 'bg-green-600 hover:bg-green-600' : ''}`}
                disabled={(workshop.slots || 0) === 0 || enrolling || isEnrollmentClosed || justEnrolled}
                onClick={handleEnroll}
              >
                {enrolling 
                  ? "Inscrevendo..." 
                  : justEnrolled
                    ? <><CheckCircle2 className="w-4 h-4 mr-1" /> Inscrito!</>
                    : isEnrollmentClosed
                      ? "Inscrições Encerradas"
                      : (workshop.slots || 0) > 0 
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
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
