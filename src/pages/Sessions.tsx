import RootLayout from "@/components/layout/RootLayout";
import { SessionCard, SessionSkeleton } from "@/components/custom/SessionCard";
import { WorkshopCard, WorkshopSkeleton } from "@/components/custom/WorkshopCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState, useEffect } from "react";
import type { Session } from "@/services/sessionServices/session.types";
import { getAprovedSessions, getApprovedWorkshops } from "@/services/sessionServices/session.services";
import { Info, Swords, ScrollText, CalendarX, Clock, Ban, AlertCircle } from "lucide-react";
import { EventBanner } from "@/components/custom/EventBanner"; // 🚀 REMOVER APÓS O EVENTO

interface AnimatedCardProps {
  index: number;
  children: React.ReactNode;
}

function AnimatedCard({ index, children }: AnimatedCardProps) {
  return (
    <div
      className="animate-card-in"
      style={{
        animationDelay: `${index * 80}ms`,
        animationFillMode: 'both',
      }}
    >
      {children}
    </div>
  );
}

const sessionRules = [
  {
    icon: Swords,
    title: "1 mesa por dia",
    desc: "Você só pode se inscrever em uma Mesa de RPG no mesmo dia.",
  },
  {
    icon: Clock,
    title: "Sem conflito de período",
    desc: "Não é possível se inscrever em dois eventos no mesmo período (Manhã, Tarde ou Noite) do mesmo dia.",
  },
  {
    icon: CalendarX,
    title: "Inscrições encerram no dia",
    desc: "As inscrições ficam abertas até o dia do evento. Após isso, não é mais possível se inscrever.",
  },
  {
    icon: Ban,
    title: "Cancelamento até 24h antes",
    desc: "Você pode cancelar sua inscrição até 24 horas antes do início do evento.",
  },
];

const workshopRules = [
  {
    icon: ScrollText,
    title: "Oficinas independentes",
    desc: "Oficinas não bloqueiam inscrições em Mesas de RPG — a restrição é apenas de período (horário) no mesmo dia.",
  },
  {
    icon: Clock,
    title: "Sem conflito de período",
    desc: "Não é possível se inscrever em dois eventos (mesa ou oficina) no mesmo período do mesmo dia.",
  },
  {
    icon: CalendarX,
    title: "Inscrições encerram no dia",
    desc: "As inscrições ficam abertas até o dia do evento.",
  },
  {
    icon: Ban,
    title: "Cancelamento até 24h antes",
    desc: "Você pode cancelar sua inscrição até 24 horas antes do início da oficina.",
  },
];

function RulesPanel({ rules }: { rules: typeof sessionRules }) {
  const [open, setOpen] = useState(false);

  return (
    <div
      className="mb-6 rounded-xl border overflow-hidden"
      style={{
        borderColor: 'rgba(113, 86, 247, 0.25)',
        background: 'rgba(113, 86, 247, 0.05)',
      }}
    >
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-4 py-3 text-left group cursor-pointer"
      >
        <div className="flex items-center gap-2 text-sm font-semibold text-primary">
          <Info size={15} />
          Regras de inscrição
        </div>
        <span
          className="text-muted-foreground text-xs transition-transform duration-300"
          style={{ display: 'inline-block', transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }}
        >
          ▾
        </span>
      </button>

      <div
        style={{
          maxHeight: open ? '600px' : '0px',
          overflow: 'hidden',
          transition: 'max-height 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        <div className="px-4 pb-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
          {rules.map((rule) => (
            <div
              key={rule.title}
              className="flex items-start gap-3 p-3 rounded-lg"
              style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
            >
              <div className="mt-0.5 shrink-0 text-primary">
                <rule.icon size={16} />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">{rule.title}</p>
                <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{rule.desc}</p>
              </div>
            </div>
          ))}
        </div>
        <div
          className="px-4 pb-3 pt-2 flex items-center gap-2 text-xs text-muted-foreground border-t"
          style={{ borderColor: 'rgba(255,255,255,0.06)' }}
        >
          <AlertCircle size={12} className="text-primary shrink-0" />
          Inscrições são pessoais e intransferíveis. Respeite os outros participantes.
        </div>
      </div>
    </div>
  );
}

const Sessions = () => {
  const [expandedSessions, setExpandedSessions] = useState<string[]>([]);
  const [expandedWorkshops, setExpandedWorkshops] = useState<string[]>([]);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [workshops, setWorkshops] = useState<Session[]>([]);
  const [loadingSessions, setLoadingSessions] = useState(true);
  const [loadingWorkshops, setLoadingWorkshops] = useState(false);
  const [workshopsFetched, setWorkshopsFetched] = useState(false);

  const toggleExpandSession = (sessionId: string) => {
    setExpandedSessions((prev) =>
      prev.includes(sessionId)
        ? prev.filter((id) => id !== sessionId)
        : [...prev, sessionId]
    );
  };

  const toggleExpandWorkshop = (workshopId: string) => {
    setExpandedWorkshops((prev) =>
      prev.includes(workshopId)
        ? prev.filter((id) => id !== workshopId)
        : [...prev, workshopId]
    );
  };

  const periodOrder: Record<string, number> = { MANHA: 0, TARDE: 1, NOITE: 2 };

  const processResponse = (response: any) => {
    let data = [];
    if (Array.isArray(response)) {
      data = response;
    } else if (response.sessions && Array.isArray(response.sessions)) {
      data = response.sessions;
    } else if (response.data && Array.isArray(response.data)) {
      data = response.data;
    }

    return data
      .map((item: Session) => {
        const enrolledCount = item.enrollments?.length || 0;
        const slots = item.maxPlayers - enrolledCount;
        return { ...item, slots: slots >= 0 ? slots : 0 };
      })
      .sort((a: Session, b: Session) => {
        const pa = periodOrder[a.period ?? ''] ?? 99;
        const pb = periodOrder[b.period ?? ''] ?? 99;
        return pa - pb;
      });
  };

  const fetchSessions = async () => {
    try {
      setLoadingSessions(true);
      const response = await getAprovedSessions();
      setSessions(processResponse(response));
    } catch (error) {
      console.error("Erro ao buscar sessões:", error);
      setSessions([]);
    } finally {
      setLoadingSessions(false);
    }
  };

  const fetchWorkshops = async () => {
    try {
      setLoadingWorkshops(true);
      const response = await getApprovedWorkshops();
      setWorkshops(processResponse(response));
      setWorkshopsFetched(true);
    } catch (error) {
      console.error("Erro ao buscar oficinas:", error);
      setWorkshops([]);
    } finally {
      setLoadingWorkshops(false);
    }
  };

  useEffect(() => {
    fetchSessions();
  }, []);

  const handleTabChange = (value: string) => {
    if (value === "workshops" && !workshopsFetched) {
      fetchWorkshops();
    }
  };

  const handleEnrollSuccess = async () => {
    await fetchSessions();
  };

  const handleWorkshopEnrollSuccess = async () => {
    await fetchWorkshops();
  };

  return (
    <RootLayout>
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-4xl font-bold mb-8 text-center">
          Eventos Disponíveis
        </h1>

        {/* 🚀 REMOVER APÓS O EVENTO — apagar linha abaixo e o import no topo */}
        <EventBanner />

        <Tabs defaultValue="sessions" onValueChange={handleTabChange} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="sessions">Mesas de RPG</TabsTrigger>
            <TabsTrigger value="workshops">Oficinas</TabsTrigger>
          </TabsList>

          <TabsContent value="sessions" className="space-y-4">
            <RulesPanel rules={sessionRules} />

            {loadingSessions && <SessionSkeleton />}

            {!loadingSessions && sessions.length === 0 && (
              <p className="text-muted-foreground text-center py-8">
                Não há mesas de RPG disponíveis no momento.
              </p>
            )}

            {!loadingSessions && sessions.length > 0 && (
              <div>
                {sessions.map((session, index) => (
                  <AnimatedCard key={session.id || `session-${index}`} index={index}>
                    <SessionCard
                      session={session}
                      isExpanded={
                        session.id ? expandedSessions.includes(session.id) : false
                      }
                      onToggleExpand={toggleExpandSession}
                      onEnrollSuccess={handleEnrollSuccess}
                    />
                  </AnimatedCard>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="workshops" className="space-y-4">
            <RulesPanel rules={workshopRules} />

            {loadingWorkshops && <WorkshopSkeleton />}

            {!loadingWorkshops && workshopsFetched && workshops.length === 0 && (
              <p className="text-muted-foreground text-center py-8">
                Não há oficinas disponíveis no momento.
              </p>
            )}

            {!loadingWorkshops && workshops.length > 0 && (
              <div>
                {workshops.map((workshop, index) => (
                  <AnimatedCard key={workshop.id || `workshop-${index}`} index={index}>
                    <WorkshopCard
                      workshop={workshop}
                      isExpanded={
                        workshop.id ? expandedWorkshops.includes(workshop.id) : false
                      }
                      onToggleExpand={toggleExpandWorkshop}
                      onEnrollSuccess={handleWorkshopEnrollSuccess}
                    />
                  </AnimatedCard>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </RootLayout>
  );
};

export default Sessions;
