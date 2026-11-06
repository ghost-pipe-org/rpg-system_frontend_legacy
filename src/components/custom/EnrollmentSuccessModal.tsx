import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Calendar, MapPin, User, Swords, ScrollText, ArrowRight } from "lucide-react";
import type { Session } from "@/services/sessionServices/session.types";
import { formatDateBR } from "@/utils/formatDate";
import { useNavigate } from "react-router";
import { EVENT_THEME } from "@/config/eventTheme";

interface EnrollmentSuccessModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  event: Session | null;
  type?: "session" | "workshop";
}

export function EnrollmentSuccessModal({
  open,
  onOpenChange,
  event,
  type = "session",
}: EnrollmentSuccessModalProps) {
  const navigate = useNavigate();

  if (!event) return null;

  const isSession = type === "session";
  const organizerName = isSession
    ? event.master?.name || "Não informado"
    : event.facilitators && event.facilitators.length > 0
    ? event.facilitators.map((f) => f.user.name).join(", ")
    : "Não informado";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="sm:max-w-md text-foreground font-sans p-6 rounded-xl shadow-2xl"
        style={{
          background: `linear-gradient(160deg, ${EVENT_THEME.black} 0%, #1a0505 55%, ${EVENT_THEME.wine} 100%)`,
          border: "1px solid rgba(232, 96, 76, 0.45)",
          boxShadow: "0 0 40px rgba(180, 30, 20, 0.35)",
        }}
      >
        <DialogHeader className="flex flex-col items-center text-center pt-2 space-y-2">
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center mb-1 animate-pulse"
            style={{
              background: "rgba(232, 96, 76, 0.15)",
              border: "1px solid rgba(232, 96, 76, 0.5)",
              color: EVENT_THEME.coral,
            }}
          >
            <CheckCircle2 className="w-10 h-10 stroke-[2.5]" />
          </div>
          <span
            className="text-[10px] tracking-[0.3em] uppercase"
            style={{ color: EVENT_THEME.coral }}
          >
            Dia de los Muertos · 07 Nov (adiado)
          </span>
          <DialogTitle
            className="text-3xl tracking-wide font-normal"
            style={{ fontFamily: EVENT_THEME.titleFont, color: EVENT_THEME.cream }}
          >
            Inscrição Confirmada!
          </DialogTitle>
          <DialogDescription
            className="text-sm font-prompt italic"
            style={{ color: "rgba(246,236,224,0.75)" }}
          >
            Sua vaga foi reservada. Prepare-se: algumas almas ainda não descansaram...
          </DialogDescription>
        </DialogHeader>

        {/* Detalhes do Evento */}
        <div
          className="space-y-3 my-2 p-4 rounded-lg"
          style={{
            background: "rgba(74, 10, 10, 0.35)",
            border: "1px solid rgba(232, 96, 76, 0.3)",
          }}
        >
          <div
            className="flex items-start justify-between gap-2 pb-2"
            style={{ borderBottom: "1px solid rgba(232, 96, 76, 0.3)" }}
          >
            <h4
              className="font-semibold text-lg line-clamp-2"
              style={{ fontFamily: EVENT_THEME.titleFont, color: EVENT_THEME.cream }}
            >
              {event.title}
            </h4>
            <Badge
              variant="secondary"
              className="gap-1 flex-shrink-0 font-prompt border-0"
              style={{ background: "rgba(232, 96, 76, 0.2)", color: EVENT_THEME.cream }}
            >
              {isSession ? (
                <>
                  <Swords className="w-3 h-3 text-[#e8604c]" /> Mesa RPG
                </>
              ) : (
                <>
                  <ScrollText className="w-3 h-3 text-[#e8604c]" /> Oficina
                </>
              )}
            </Badge>
          </div>

          <div className="space-y-2 text-sm text-muted-foreground font-prompt pt-1">
            {event.system && (
              <p className="flex items-center gap-2">
                <span className="font-mono text-foreground font-semibold">Sistema:</span>
                <span className="text-foreground/90">{event.system}</span>
              </p>
            )}

            <p className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[#e8604c] shrink-0" />
              <span>
                {event.approvedDate
                  ? formatDateBR(event.approvedDate)
                  : event.createdAt
                  ? formatDateBR(event.createdAt)
                  : "Data a definir"}
              </span>
              {event.period && (
                <Badge variant="outline" className="ml-auto text-xs uppercase font-mono">
                  {event.period}
                </Badge>
              )}
            </p>

            <p className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#e8604c] shrink-0" />
              <span>{event.location || "Local a definir (UEPB)"}</span>
            </p>

            <p className="flex items-center gap-2">
              <User className="w-4 h-4 text-[#e8604c] shrink-0" />
              <span>
                <strong className="font-mono text-foreground font-medium">
                  {isSession ? "Mestre:" : "Ministrante:"}
                </strong>{" "}
                {organizerName}
              </span>
            </p>
          </div>
        </div>

        <p
          className="text-xs text-center font-prompt px-2"
          style={{ color: "rgba(246,236,224,0.65)" }}
        >
          🕯️ Chegue com antecedência no local. Você pode acompanhar ou cancelar suas inscrições no seu perfil.
        </p>

        <DialogFooter className="flex flex-col sm:flex-row gap-2 mt-3">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="w-full sm:w-1/2 uppercase font-semibold cursor-pointer bg-transparent hover:bg-[#e8604c]/10"
            style={{ borderColor: "rgba(232, 96, 76, 0.5)", color: EVENT_THEME.cream }}
          >
            Fechar
          </Button>
          <Button
            onClick={() => {
              onOpenChange(false);
              navigate("/profile");
            }}
            className="w-full sm:w-1/2 uppercase font-semibold gap-2 cursor-pointer border-0"
            style={{
              background: "linear-gradient(135deg, #e8604c, #a31f1f)",
              color: EVENT_THEME.cream,
            }}
          >
            Ver Meu Perfil
            <ArrowRight className="w-4 h-4" />
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
