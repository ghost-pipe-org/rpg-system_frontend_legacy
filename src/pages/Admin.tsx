import RootLayout from "@/components/layout/RootLayout";
import { SessionSkeleton } from "@/components/custom/SessionCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState, useEffect } from "react";
import { Navigate } from "react-router";
import { useAuth } from "@/context/AuthContext";
import type { Session } from "@/services/sessionServices/session.types";
import { 
  getSessions, 
  approveSession, 
  rejectSession 
} from "@/services/sessionServices/session.services";
import { toast } from "sonner";
import { formatDateBR, datetimeLocalToISO } from "@/utils/formatDate";

const Admin = () => {
  const { user } = useAuth();
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);
  const [approveDialogOpen, setApproveDialogOpen] = useState(false);
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [processing, setProcessing] = useState(false);

  // Approve form state
  const [selectedDate, setSelectedDate] = useState("");
  const [location, setLocation] = useState("");

  // Reject form state
  const [cancelEvent, setCancelEvent] = useState("");

  // Verifica se o usuário é admin
  const isAdmin = user?.role === 'ADMIN';

  const fetchPendingSessions = async () => {
    try {
      setLoading(true);
      const response = await getSessions();

      let sessionsData = [];
      if (Array.isArray(response)) {
        sessionsData = response;
      } else if (response.sessions && Array.isArray(response.sessions)) {
        sessionsData = response.sessions;
      } else if (response.data && Array.isArray(response.data)) {
        sessionsData = response.data;
      }

      // Filtra apenas sessões com status PENDENTE
      const pendingSessions = sessionsData.filter(
        (session: Session) => session.status === 'PENDENTE' || session.status === 'PENDING'
      );

      console.log("Sessões pendentes:", pendingSessions);
      console.log("Primeira sessão possibleDates:", pendingSessions[0]?.possibleDates);

      setSessions(pendingSessions);
    } catch (error) {
      console.error("Erro ao buscar sessões pendentes:", error);
      toast.error("Erro ao carregar sessões pendentes");
      setSessions([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingSessions();
  }, []);

  const handleApproveClick = (session: Session) => {
    console.log("Session selecionada:", session);
    console.log("Datas possíveis:", session.possibleDates);
    setSelectedSession(session);
    setSelectedDate("");
    setLocation("");
    setApproveDialogOpen(true);
  };

  const handleRejectClick = (session: Session) => {
    setSelectedSession(session);
    setCancelEvent("");
    setRejectDialogOpen(true);
  };

  const handleApprove = async () => {
    if (!selectedSession?.id || !selectedDate || !location.trim()) {
      toast.error("Preencha todos os campos");
      return;
    }

    try {
      setProcessing(true);
      
      // Usa função utilitária para converter mantendo a data correta
      const approvedDateISO = datetimeLocalToISO(selectedDate);
      
      console.log("Data selecionada:", selectedDate);
      console.log("Data ISO enviada:", approvedDateISO);
      
      await approveSession(selectedSession.id, {
        approvedDate: approvedDateISO,
        location: location.trim(),
      });

      toast.success("Sessão aprovada com sucesso!");
      setApproveDialogOpen(false);
      fetchPendingSessions();
    } catch (error) {
      console.error("Erro ao aprovar sessão:", error);
      toast.error("Erro ao aprovar sessão");
    } finally {
      setProcessing(false);
    }
  };

  const handleReject = async () => {
    if (!selectedSession?.id || !cancelEvent.trim()) {
      toast.error("Preencha o motivo da rejeição");
      return;
    }

    try {
      setProcessing(true);
      await rejectSession(selectedSession.id, {
        cancelEvent: cancelEvent.trim(),
      });

      toast.success("Sessão rejeitada");
      setRejectDialogOpen(false);
      fetchPendingSessions();
    } catch (error) {
      console.error("Erro ao rejeitar sessão:", error);
      toast.error("Erro ao rejeitar sessão");
    } finally {
      setProcessing(false);
    }
  };

  // Usa função utilitária de formatação

  const systemLogos: Record<string, string> = {
    'D&D 5e': '/icons/d&d-logo.svg',
    'Vampiro: A Máscara': '/icons/vampiro-logo.png',
    'Ordem Paranormal': '/icons/ordem-paranormal-logo.svg',
    'Tormenta20': '/icons/t20-logo.png',
    'Pathfinder 2e': '/icons/pathfinder-logo.png',
    'Call of Cthulhu': '/icons/coc-logo.png',
    'Outros': '/icons/logo.png'
  };

  // Redireciona se não for admin
  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  return (
    <RootLayout>
      <div className="container mx-auto px-4 max-w-6xl">
        <h1 className="text-4xl font-bold mb-8 text-center">
          Administração - Sessões Pendentes
        </h1>

        <div className="mb-4 p-4 bg-secondary rounded">
          <p className="font-mono">Debug Info:</p>
          <p>Loading: {loading ? 'Sim' : 'Não'}</p>
          <p>Total de sessões: {sessions.length}</p>
          <button 
            onClick={fetchPendingSessions}
            className="mt-2 px-4 py-2 bg-primary text-primary-foreground rounded"
          >
            Recarregar Sessões
          </button>
        </div>

        {loading && <SessionSkeleton />}

        {!loading && sessions.length === 0 && (
          <p className="text-muted-foreground text-center">
            Não há sessões pendentes para análise.
          </p>
        )}

        {!loading && sessions.length > 0 && (
          <div className="space-y-6">
            {sessions.map((session) => {
              const systemLogo = systemLogos[session.system] || systemLogos['Outros'];
              
              return (
                <Card key={session.id} className="bg-background border-accent">
                  <CardHeader className="flex flex-row items-start gap-4 pb-3">
                    <img
                      src={systemLogo}
                      alt={session.system}
                      className="w-16 h-16 object-contain"
                      onError={(e) => {
                        e.currentTarget.src = systemLogos['Outros'];
                      }}
                    />
                    <div className="flex-1">
                      <CardTitle className="text-2xl font-pixelsans">
                        {session.title}
                      </CardTitle>
                      <p className="text-sm text-muted-foreground font-prompt">
                        {session.system} | {session.period} | Mestre: {session.master?.name || "Não informado"}
                      </p>
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {session.status}
                    </Badge>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    <p className="text-foreground leading-relaxed">
                      {session.description}
                    </p>

                    <Separator />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <strong className="font-mono">Requisitos:</strong>
                        <p className="text-muted-foreground">{session.requirements}</p>
                      </div>
                      <div>
                        <strong className="font-mono">Jogadores:</strong>
                        <p className="text-muted-foreground">
                          {session.minPlayers} - {session.maxPlayers} jogadores
                        </p>
                      </div>
                    </div>

                    {session.possibleDates && session.possibleDates.length > 0 && (
                      <div>
                        <strong className="font-mono text-sm">Datas Possíveis:</strong>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {session.possibleDates.map((dateObj) => (
                            <Badge key={dateObj.id} variant="outline">
                              {formatDateBR(dateObj.date)}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    <Separator />

                    <div className="flex gap-3 justify-end">
                      <Button
                        variant="destructive"
                        onClick={() => handleRejectClick(session)}
                      >
                        Rejeitar
                      </Button>
                      <Button
                        variant="default"
                        onClick={() => handleApproveClick(session)}
                      >
                        Aprovar
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        {/* Approve Dialog */}
        <Dialog open={approveDialogOpen} onOpenChange={setApproveDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Aprovar Sessão</DialogTitle>
              <DialogDescription>
                Selecione a data aprovada e informe a localização da sessão.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div>
                <Label htmlFor="date">Data Aprovada *</Label>
                {selectedSession?.possibleDates && selectedSession.possibleDates.length > 0 ? (
                  <Select value={selectedDate} onValueChange={setSelectedDate}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione uma data" />
                    </SelectTrigger>
                    <SelectContent>
                      {selectedSession.possibleDates.map((dateObj) => (
                        <SelectItem key={dateObj.id} value={dateObj.date}>
                          {formatDateBR(dateObj.date)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <Input
                    id="date"
                    type="datetime-local"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    placeholder="Selecione a data e hora"
                  />
                )}
                {!selectedSession?.possibleDates && (
                  <p className="text-xs text-muted-foreground mt-1">
                    Esta sessão não possui datas sugeridas. Insira uma data manualmente.
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="location">Localização *</Label>
                <Input
                  id="location"
                  placeholder="Ex: Sala 101 - Prédio Principal"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
              </div>
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setApproveDialogOpen(false)}
                disabled={processing}
              >
                Cancelar
              </Button>
              <Button onClick={handleApprove} disabled={processing}>
                {processing ? "Aprovando..." : "Confirmar Aprovação"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Reject Dialog */}
        <Dialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Rejeitar Sessão</DialogTitle>
              <DialogDescription>
                Informe o motivo da rejeição da sessão.
              </DialogDescription>
            </DialogHeader>

            <div>
              <Label htmlFor="cancelEvent">Motivo da Rejeição *</Label>
              <Textarea
                id="cancelEvent"
                placeholder="Ex: Falta de informações detalhadas sobre a sessão"
                value={cancelEvent}
                onChange={(e) => setCancelEvent(e.target.value)}
                rows={4}
              />
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setRejectDialogOpen(false)}
                disabled={processing}
              >
                Cancelar
              </Button>
              <Button 
                variant="destructive" 
                onClick={handleReject} 
                disabled={processing}
              >
                {processing ? "Rejeitando..." : "Confirmar Rejeição"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </RootLayout>
  );
};

export default Admin;
