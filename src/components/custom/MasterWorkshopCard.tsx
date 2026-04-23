import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { Session } from "@/services/sessionServices/session.types";
import { cancelApprovedWorkshop } from "@/services/sessionServices/session.services";
import { formatDateBR } from "@/utils/formatDate";
import { Users, Mail, Phone } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";


interface MasterWorkshopCardProps {
  workshop: Session;
  isExpanded: boolean;
  onToggleExpand: (workshopId: string) => void;
  onCancelSuccess?: () => void;
}

export function MasterWorkshopCard({
  workshop,
  isExpanded,
  onToggleExpand,
  onCancelSuccess,
}: MasterWorkshopCardProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const [canceling, setCanceling] = useState(false);

  const enrolledParticipants = workshop.enrollments?.filter(e => e.user) || [];
  const enrolledCount = enrolledParticipants.length;
  const availableSlots = workshop.maxPlayers - enrolledCount;

  const canCancelApproved = workshop.status === "APROVADA" && (() => {
    if (!workshop.approvedDate) return false;
    const diffMs = new Date(workshop.approvedDate).getTime() - Date.now();
    return diffMs / (1000 * 60 * 60) >= 48;
  })();

  const handleCancelApproved = async () => {
    if (!workshop.id) return;
    setCanceling(true);
    try {
      await cancelApprovedWorkshop(workshop.id, cancelReason);
      toast.success("Oficina cancelada com sucesso.");
      setDialogOpen(false);
      setCancelReason("");
      onCancelSuccess?.();
    } catch (error: unknown) {
      const message =
        error instanceof Error && "response" in error
          ? (error as { response?: { data?: { message?: string } } }).response?.data?.message
          : undefined;
      toast.error(message || "Não foi possível cancelar a oficina. Tente novamente.");
    } finally {
      setCanceling(false);
    }
  };

  const statusBadgeVariant = (status: string) => {
    if (status === "APROVADA") return "default";
    if (status === "CANCELADA") return "destructive";
    return "secondary";
  };

  const facilitatorNames = workshop.facilitators
    ? workshop.facilitators.map(f => f.user.name).join(', ')
    : 'Não informado';

  return (
    <>
      <Card className="mb-6 bg-background border-2 border-primary/20 shadow-lg">
        <CardHeader className="flex flex-row items-start gap-4 pb-3 font-pixelsans text-foreground">
          <div className="flex-1 space-y-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-2xl">{workshop.title}</CardTitle>
              <div className="flex items-center gap-2">
                <Badge variant={statusBadgeVariant(workshop.status || "")}>
                  {workshop.status}
                </Badge>
                <Badge
                  variant={availableSlots > 0 ? "secondary" : "destructive"}
                >
                  {enrolledCount}/{workshop.maxPlayers} participantes
                </Badge>
              </div>
            </div>
            <p className="text-sm text-muted-foreground font-prompt">
              {workshop.approvedDate ? formatDateBR(workshop.approvedDate) : (workshop.createdAt && formatDateBR(workshop.createdAt))} |{" "}
              {workshop.period}
            </p>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          <p className="leading-relaxed text-foreground">{workshop.description}</p>

          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Users className="w-4 h-4" />
            <span>
              {enrolledCount === 0 && "Nenhum participante inscrito ainda"}
              {enrolledCount === 1 && "1 participante inscrito"}
              {enrolledCount > 1 && `${enrolledCount} participantes inscritos`}
            </span>
          </div>

          <div className="flex flex-col sm:flex-row gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => workshop.id && onToggleExpand(workshop.id)}
              className="text text-accent-foreground font-semibold cursor-pointer py-2 uppercase flex-1"
            >
              <span className="text-sm">{isExpanded ? "Ocultar Detalhes" : "Ver Detalhes"}</span>
              <span>{isExpanded ? "−" : "+"}</span>
            </Button>

            {workshop.status === "APROVADA" && (
              <Button
                variant="destructive"
                size="sm"
                disabled={!canCancelApproved || canceling}
                onClick={() => setDialogOpen(true)}
                className="uppercase font-semibold"
                title={
                  !canCancelApproved
                    ? "Cancelamento não permitido com menos de 48h de antecedência"
                    : undefined
                }
              >
                {!canCancelApproved ? "Prazo de cancelamento encerrado" : "Cancelar Oficina"}
              </Button>
            )}
          </div>

          {isExpanded && (
            <div className="space-y-4 animate-in fade-in duration-300">
              <Separator />

              <div className="space-y-3 text-foreground">
                <p>
                  <strong className="font-mono">Ministrante(s):</strong> {facilitatorNames}
                </p>
                <p>
                  <strong className="font-mono">Local:</strong> {workshop.location || 'Não informado'}
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

              <Separator />

              <div className="space-y-3">
                <h3 className="font-bold text-lg flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Participantes Inscritos
                </h3>

                {enrolledParticipants.length === 0 ? (
                  <p className="text-sm text-muted-foreground italic">
                    Nenhum participante inscrito ainda.
                  </p>
                ) : (
                  <div className="space-y-3">
                    {enrolledParticipants.map((enrollment) => (
                      <Card key={enrollment.id} className="bg-muted/50 border-muted">
                        <CardContent className="p-4 space-y-2">
                          <div className="flex items-center justify-between">
                            <h4 className="font-semibold text-base">
                              {enrollment.user?.name}
                            </h4>
                            <Badge variant="outline" className="text-xs">
                              {enrollment.status}
                            </Badge>
                          </div>

                          <div className="space-y-1 text-sm">
                            <div className="flex items-center gap-2 text-muted-foreground">
                              <Mail className="w-4 h-4" />
                              <a
                                href={`mailto:${enrollment.user?.email}`}
                                className="hover:text-primary hover:underline"
                              >
                                {enrollment.user?.email}
                              </a>
                            </div>

                            {enrollment.user?.phoneNumber && (
                              <div className="flex items-center gap-2 text-muted-foreground">
                                <Phone className="w-4 h-4" />
                                <a
                                  href={`tel:${enrollment.user.phoneNumber}`}
                                  className="hover:text-primary hover:underline"
                                >
                                  {enrollment.user.phoneNumber}
                                </a>
                              </div>
                            )}
                          </div>

                          <p className="text-xs text-muted-foreground">
                            Inscrito em: {formatDateBR(enrollment.createdAt)}
                          </p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cancelar oficina: {workshop.title}</DialogTitle>
            <DialogDescription>
              Esta ação não poderá ser desfeita. Informe o motivo do cancelamento para que os participantes inscritos sejam notificados.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-2">
            <label className="text-sm font-medium">Motivo do cancelamento</label>
            <Textarea
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              placeholder="Descreva o motivo do cancelamento (mínimo 10 caracteres)..."
              rows={4}
            />
            {cancelReason.length > 0 && cancelReason.length < 10 && (
              <p className="text-sm text-destructive">
                O motivo deve ter pelo menos 10 caracteres.
              </p>
            )}
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setDialogOpen(false);
                setCancelReason("");
              }}
            >
              Voltar
            </Button>
            <Button
              variant="destructive"
              disabled={cancelReason.length < 10 || canceling}
              onClick={handleCancelApproved}
            >
              {canceling ? "Cancelando..." : "Confirmar cancelamento"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
