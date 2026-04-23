import RootLayout from "@/components/layout/RootLayout";
import { SessionSkeleton } from "@/components/custom/SessionCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  rejectSession,
  getWorkshops,
  approveWorkshop,
  rejectWorkshop
} from "@/services/sessionServices/session.services";
import { toast } from "sonner";
import { formatDateBR, datetimeLocalToISO } from "@/utils/formatDate";

const Admin = () => {
  const { user } = useAuth();
  const [sessions, setSessions] = useState<Session[]>([]);
  const [workshops, setWorkshops] = useState<Session[]>([]);
  const [loadingSessions, setLoadingSessions] = useState(true);
  const [loadingWorkshops, setLoadingWorkshops] = useState(true);
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);
  const [selectedWorkshop, setSelectedWorkshop] = useState<Session | null>(null);
  
  const [approveDialogOpen, setApproveDialogOpen] = useState(false);
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  
  const [approveWorkshopDialogOpen, setApproveWorkshopDialogOpen] = useState(false);
  const [rejectWorkshopDialogOpen, setRejectWorkshopDialogOpen] = useState(false);

  const [processing, setProcessing] = useState(false);

  // Approve form state
  const [selectedDate, setSelectedDate] = useState("");
  const [location, setLocation] = useState("");

  // Reject form state
  const [cancelEvent, setCancelEvent] = useState("");

  const isAdmin = user?.role === 'ADMIN';

  const fetchPendingSessions = async () => {
    try {
      setLoadingSessions(true);
      const response = await getSessions();

      let sessionsData = [];
      if (Array.isArray(response)) {
        sessionsData = response;
      } else if (response.sessions && Array.isArray(response.sessions)) {
        sessionsData = response.sessions;
      } else if (response.data && Array.isArray(response.data)) {
        sessionsData = response.data;
      }

      const pendingSessions = sessionsData.filter(
        (session: Session) => session.status === 'PENDENTE' || session.status === 'PENDING'
      );

      setSessions(pendingSessions);
    } catch (error) {
      console.error("Erro ao buscar sessões pendentes:", error);
      toast.error("Erro ao carregar sessões pendentes");
      setSessions([]);
    } finally {
      setLoadingSessions(false);
    }
  };

  const fetchPendingWorkshops = async () => {
    try {
      setLoadingWorkshops(true);
      const response = await getWorkshops();

      let workshopsData = [];
      if (Array.isArray(response)) {
        workshopsData = response;
      } else if (response.sessions && Array.isArray(response.sessions)) {
        workshopsData = response.sessions;
      } else if (response.data && Array.isArray(response.data)) {
        workshopsData = response.data;
      }

      const pendingWorkshops = workshopsData.filter(
        (workshop: Session) => workshop.status === 'PENDENTE' || workshop.status === 'PENDING'
      );

      setWorkshops(pendingWorkshops);
    } catch (error) {
      console.error("Erro ao buscar oficinas pendentes:", error);
      toast.error("Erro ao carregar oficinas pendentes");
      setWorkshops([]);
    } finally {
      setLoadingWorkshops(false);
    }
  };

  useEffect(() => {
    fetchPendingSessions();
    fetchPendingWorkshops();
  }, []);

  const handleApproveClick = (session: Session) => {
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

  const handleApproveWorkshopClick = (workshop: Session) => {
    setSelectedWorkshop(workshop);
    setSelectedDate("");
    setLocation("");
    setApproveWorkshopDialogOpen(true);
  };

  const handleRejectWorkshopClick = (workshop: Session) => {
    setSelectedWorkshop(workshop);
    setCancelEvent("");
    setRejectWorkshopDialogOpen(true);
  };

  const handleApprove = async () => {
    if (!selectedSession?.id || !selectedDate || !location.trim()) {
      toast.error("Preencha todos os campos");
      return;
    }

    try {
      setProcessing(true);
      const approvedDateISO = datetimeLocalToISO(selectedDate);
      
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

  const handleApproveWorkshop = async () => {
    if (!selectedWorkshop?.id || !selectedDate || !location.trim()) {
      toast.error("Preencha todos os campos");
      return;
    }

    try {
      setProcessing(true);
      const approvedDateISO = datetimeLocalToISO(selectedDate);
      
      await approveWorkshop(selectedWorkshop.id, {
        approvedDate: approvedDateISO,
        location: location.trim(),
      });

      toast.success("Oficina aprovada com sucesso!");
      setApproveWorkshopDialogOpen(false);
      fetchPendingWorkshops();
    } catch (error) {
      console.error("Erro ao aprovar oficina:", error);
      toast.error("Erro ao aprovar oficina");
    } finally {
      setProcessing(false);
    }
  };

  const handleRejectWorkshop = async () => {
    if (!selectedWorkshop?.id || !cancelEvent.trim()) {
      toast.error("Preencha o motivo da rejeição");
      return;
    }

    try {
      setProcessing(true);
      await rejectWorkshop(selectedWorkshop.id, {
        cancelEvent: cancelEvent.trim(),
      });

      toast.success("Oficina rejeitada");
      setRejectWorkshopDialogOpen(false);
      fetchPendingWorkshops();
    } catch (error) {
      console.error("Erro ao rejeitar oficina:", error);
      toast.error("Erro ao rejeitar oficina");
    } finally {
      setProcessing(false);
    }
  };

  const systemLogos: Record<string, string> = {
    'D&D 5e': '/icons/d&d-logo.svg',
    'Vampiro: A Máscara': '/icons/vampiro-logo.png',
    'Ordem Paranormal': '/icons/ordem-paranormal-logo.svg',
    'Tormenta20': '/icons/t20-logo.png',
    'Pathfinder 2e': '/icons/pathfinder-logo.png',
    'Call of Cthulhu': '/icons/coc-logo.png',
    'Outros': '/icons/logo.png'
  };

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  return (
    <RootLayout>
      <div className="container mx-auto px-4 max-w-6xl">
        <h1 className="text-4xl font-bold mb-8 text-center">
          Administração - Eventos Pendentes
        </h1>

        <Tabs defaultValue="sessions" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="sessions">Mesas Pendentes ({sessions.length})</TabsTrigger>
            <TabsTrigger value="workshops">Oficinas Pendentes ({workshops.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="sessions" className="space-y-4">
            {loadingSessions && <SessionSkeleton />}

            {!loadingSessions && sessions.length === 0 && (
              <p className="text-muted-foreground text-center py-8">
                Não há mesas pendentes para análise.
              </p>
            )}

            {!loadingSessions && sessions.length > 0 && (
              <div className="space-y-6">
                {sessions.map((session) => {
                  const systemLogo = systemLogos[session.system || 'Outros'] || systemLogos['Outros'];
                  
                  return (
                    <Card key={session.id} className="bg-background border-accent">
                      <CardHeader className="flex flex-row items-start gap-4 pb-3">
                        <img
                          src={systemLogo}
                          alt={session.system || 'Sistema'}
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
          </TabsContent>

          <TabsContent value="workshops" className="space-y-4">
            {loadingWorkshops && <SessionSkeleton />}

            {!loadingWorkshops && workshops.length === 0 && (
              <p className="text-muted-foreground text-center py-8">
                Não há oficinas pendentes para análise.
              </p>
            )}

            {!loadingWorkshops && workshops.length > 0 && (
              <div className="space-y-6">
                {workshops.map((workshop) => {
                  const facilitatorNames = workshop.facilitators
                    ? workshop.facilitators.map(f => f.user.name).join(', ')
                    : 'Não informado';

                  return (
                    <Card key={workshop.id} className="bg-background border-accent">
                      <CardHeader className="flex flex-row items-start gap-4 pb-3">
                        <div className="flex-1">
                          <CardTitle className="text-2xl font-pixelsans">
                            {workshop.title}
                          </CardTitle>
                          <p className="text-sm text-muted-foreground font-prompt">
                            Oficina | {workshop.period} | Ministrantes: {facilitatorNames}
                          </p>
                        </div>
                        <Badge variant="secondary" className="text-xs">
                          {workshop.status}
                        </Badge>
                      </CardHeader>

                      <CardContent className="space-y-4">
                        <p className="text-foreground leading-relaxed">
                          {workshop.description}
                        </p>

                        <Separator />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                          {workshop.requirements && (
                            <div>
                              <strong className="font-mono">Requisitos:</strong>
                              <p className="text-muted-foreground">{workshop.requirements}</p>
                            </div>
                          )}
                          <div>
                            <strong className="font-mono">Participantes:</strong>
                            <p className="text-muted-foreground">
                              {workshop.minPlayers} - {workshop.maxPlayers} participantes
                            </p>
                          </div>
                        </div>

                        {workshop.possibleDates && workshop.possibleDates.length > 0 && (
                          <div>
                            <strong className="font-mono text-sm">Datas Possíveis:</strong>
                            <div className="flex flex-wrap gap-2 mt-2">
                              {workshop.possibleDates.map((dateObj) => (
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
                            onClick={() => handleRejectWorkshopClick(workshop)}
                          >
                            Rejeitar
                          </Button>
                          <Button
                            variant="default"
                            onClick={() => handleApproveWorkshopClick(workshop)}
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
          </TabsContent>
        </Tabs>

        {/* Approve Session Dialog */}
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
                <Label htmlFor="session-date">Data Aprovada *</Label>
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
                    id="session-date"
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
                <Label htmlFor="session-location">Localização *</Label>
                <Input
                  id="session-location"
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

        {/* Reject Session Dialog */}
        <Dialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Rejeitar Sessão</DialogTitle>
              <DialogDescription>
                Informe o motivo da rejeição da sessão.
              </DialogDescription>
            </DialogHeader>

            <div>
              <Label htmlFor="session-cancelEvent">Motivo da Rejeição *</Label>
              <Textarea
                id="session-cancelEvent"
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

        {/* Approve Workshop Dialog */}
        <Dialog open={approveWorkshopDialogOpen} onOpenChange={setApproveWorkshopDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Aprovar Oficina</DialogTitle>
              <DialogDescription>
                Selecione a data aprovada e informe a localização da oficina.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div>
                <Label htmlFor="workshop-date">Data Aprovada *</Label>
                {selectedWorkshop?.possibleDates && selectedWorkshop.possibleDates.length > 0 ? (
                  <Select value={selectedDate} onValueChange={setSelectedDate}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione uma data" />
                    </SelectTrigger>
                    <SelectContent>
                      {selectedWorkshop.possibleDates.map((dateObj) => (
                        <SelectItem key={dateObj.id} value={dateObj.date}>
                          {formatDateBR(dateObj.date)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <Input
                    id="workshop-date"
                    type="datetime-local"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    placeholder="Selecione a data e hora"
                  />
                )}
                {!selectedWorkshop?.possibleDates && (
                  <p className="text-xs text-muted-foreground mt-1">
                    Esta oficina não possui datas sugeridas. Insira uma data manualmente.
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="workshop-location">Localização *</Label>
                <Input
                  id="workshop-location"
                  placeholder="Ex: Sala 101 - Prédio Principal"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
              </div>
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setApproveWorkshopDialogOpen(false)}
                disabled={processing}
              >
                Cancelar
              </Button>
              <Button onClick={handleApproveWorkshop} disabled={processing}>
                {processing ? "Aprovando..." : "Confirmar Aprovação"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Reject Workshop Dialog */}
        <Dialog open={rejectWorkshopDialogOpen} onOpenChange={setRejectWorkshopDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Rejeitar Oficina</DialogTitle>
              <DialogDescription>
                Informe o motivo da rejeição da oficina.
              </DialogDescription>
            </DialogHeader>

            <div>
              <Label htmlFor="workshop-cancelEvent">Motivo da Rejeição *</Label>
              <Textarea
                id="workshop-cancelEvent"
                placeholder="Ex: Falta de informações detalhadas sobre a oficina"
                value={cancelEvent}
                onChange={(e) => setCancelEvent(e.target.value)}
                rows={4}
              />
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setRejectWorkshopDialogOpen(false)}
                disabled={processing}
              >
                Cancelar
              </Button>
              <Button 
                variant="destructive" 
                onClick={handleRejectWorkshop} 
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
