import RootLayout from "@/components/layout/RootLayout";
import { SessionCard, SessionSkeleton } from "@/components/custom/SessionCard";
import { WorkshopCard, WorkshopSkeleton } from "@/components/custom/WorkshopCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState, useEffect } from "react";
import type { Session } from "@/services/sessionServices/session.types";
import { getAprovedSessions, getApprovedWorkshops } from "@/services/sessionServices/session.services";

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

  const processResponse = (response: any) => {
    let data = [];
    if (Array.isArray(response)) {
      data = response;
    } else if (response.sessions && Array.isArray(response.sessions)) {
      data = response.sessions;
    } else if (response.data && Array.isArray(response.data)) {
      data = response.data;
    }
    
    return data.map((item: Session) => {
      const enrolledCount = item.enrollments?.length || 0;
      const slots = item.maxPlayers - enrolledCount;
      return {
        ...item,
        slots: slots >= 0 ? slots : 0
      };
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

        <Tabs defaultValue="sessions" onValueChange={handleTabChange} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="sessions">Mesas de RPG</TabsTrigger>
            <TabsTrigger value="workshops">Oficinas</TabsTrigger>
          </TabsList>

          <TabsContent value="sessions" className="space-y-4">
            {loadingSessions && <SessionSkeleton />}

            {!loadingSessions && sessions.length === 0 && (
              <p className="text-muted-foreground text-center py-8">
                Não há mesas de RPG disponíveis no momento.
              </p>
            )}

            {!loadingSessions && sessions.length > 0 && (
              <div>
                {sessions.map((session) => (
                  <SessionCard
                    key={session.id || `session-${Math.random()}`}
                    session={session}
                    isExpanded={
                      session.id ? expandedSessions.includes(session.id) : false
                    }
                    onToggleExpand={toggleExpandSession}
                    onEnrollSuccess={handleEnrollSuccess}
                  />
                ))}     
              </div>
            )}
          </TabsContent>

          <TabsContent value="workshops" className="space-y-4">
            {loadingWorkshops && <WorkshopSkeleton />}

            {!loadingWorkshops && workshopsFetched && workshops.length === 0 && (
              <p className="text-muted-foreground text-center py-8">
                Não há oficinas disponíveis no momento.
              </p>
            )}

            {!loadingWorkshops && workshops.length > 0 && (
              <div>
                {workshops.map((workshop) => (
                  <WorkshopCard
                    key={workshop.id || `workshop-${Math.random()}`}
                    workshop={workshop}
                    isExpanded={
                      workshop.id ? expandedWorkshops.includes(workshop.id) : false
                    }
                    onToggleExpand={toggleExpandWorkshop}
                    onEnrollSuccess={handleWorkshopEnrollSuccess}
                  />
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
