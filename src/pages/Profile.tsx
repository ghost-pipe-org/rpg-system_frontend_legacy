import RootLayout from "@/components/layout/RootLayout";
import { SessionCard, SessionSkeleton } from "@/components/custom/SessionCard";
import { MasterSessionCard } from "@/components/custom/MasterSessionCard";
import { WorkshopCard, WorkshopSkeleton } from "@/components/custom/WorkshopCard";
import { MasterWorkshopCard } from "@/components/custom/MasterWorkshopCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

import { useAuth } from "@/context/AuthContext";
import { updateUserProfile, updateUserEmail, updateUserPassword } from "@/services/userServices/user.services";
import { 
  updateProfileSchema, 
  updateSecurityEmailSchema, 
  updateSecurityPasswordSchema, 
  type UpdateProfileFormData, 
  type UpdateSecurityEmailFormData, 
  type UpdateSecurityPasswordFormData 
} from "@/schemas/user.schemas";

import type { Session } from "@/services/sessionServices/session.types";
import { getMyEmittedSessions, getMyEnrolledSessions, getMyFacilitatedWorkshops } from "@/services/sessionServices/session.services";
import { formatPhoneNumber } from "@/utils/formatPhoneNumber";

function AnimatedCard({ index, children }: { index: number; children: React.ReactNode }) {
  return (
    <div
      className="animate-card-in"
      style={{ animationDelay: `${index * 80}ms`, animationFillMode: 'both' }}
    >
      {children}
    </div>
  );
}

const Profile = () => {
  const [expandedSessions, setExpandedSessions] = useState<string[]>([]);
  const [emittedSessions, setEmittedSessions] = useState<Session[]>([]);
  const [emittedWorkshops, setEmittedWorkshops] = useState<Session[]>([]);
  const [enrolledSessions, setEnrolledSessions] = useState<Session[]>([]);
  const [enrolledWorkshops, setEnrolledWorkshops] = useState<Session[]>([]);
  const [loadingEmitted, setLoadingEmitted] = useState(true);
  const [loadingEnrolled, setLoadingEnrolled] = useState(true);
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [isUpdatingEmail, setIsUpdatingEmail] = useState(false);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

  const { user, updateUser } = useAuth();

  const profileForm = useForm<UpdateProfileFormData>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      name: user?.name || "",
      phoneNumber: user?.phoneNumber ? formatPhoneNumber(user.phoneNumber) : "",
    },
  });

  const emailForm = useForm<UpdateSecurityEmailFormData>({
    resolver: zodResolver(updateSecurityEmailSchema),
    defaultValues: {
      currentPassword: "",
      newEmail: user?.email || "",
    },
  });

  const passwordForm = useForm<UpdateSecurityPasswordFormData>({
    resolver: zodResolver(updateSecurityPasswordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmNewPassword: "",
    },
  });

  const onSubmitProfileOptions = async (data: UpdateProfileFormData) => {
    setIsUpdatingProfile(true);
    try {
      const response = await updateUserProfile(data);
      if (response && response.data) {
        // @ts-ignore Ignore minor optional typings for partial fields
        updateUser({ ...user, ...response.data });
      } else {
        // @ts-ignore
        updateUser({ ...user, ...data });
      }
      toast.success("Perfil atualizado com sucesso!");
    } catch (error) {
      toast.error("Erro ao atualizar o perfil. Verifique os dados fornecidos.");
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  const onSubmitEmailOptions = async (data: UpdateSecurityEmailFormData) => {
    setIsUpdatingEmail(true);
    try {
      const response = await updateUserEmail(data);
      if (response && response.data) {
        updateUser({ ...user, ...response.data });
      }
      toast.success("Email atualizado com sucesso!");
      emailForm.reset({ currentPassword: "", newEmail: response.data?.email || data.newEmail });
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Erro ao atualizar o email. Verifique sua senha atual.");
    } finally {
      setIsUpdatingEmail(false);
    }
  };

  const onSubmitPasswordOptions = async (data: UpdateSecurityPasswordFormData) => {
    setIsUpdatingPassword(true);
    try {
      const { confirmNewPassword, ...payload } = data;
      await updateUserPassword(payload);
      toast.success("Senha atualizada com sucesso!");
      passwordForm.reset();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Erro ao atualizar a senha. Verifique sua senha atual.");
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  const toggleExpand = (sessionId: string) => {
    setExpandedSessions((prev) =>
      prev.includes(sessionId)
        ? prev.filter((id) => id !== sessionId)
        : [...prev, sessionId]
    );
  };

  useEffect(() => {
    let isMounted = true;

    const processResponse = (response: any, arrayKeys: string[]) => {
      let data = [];
      if (Array.isArray(response)) {
        data = response;
      } else {
        for (const key of arrayKeys) {
          if (response[key] && Array.isArray(response[key])) {
            data = response[key];
            break;
          }
        }
        if (data.length === 0 && response.data) {
          if (Array.isArray(response.data)) {
            data = response.data;
          } else {
            for (const key of arrayKeys) {
              if (response.data[key] && Array.isArray(response.data[key])) {
                data = response.data[key];
                break;
              }
            }
          }
        }
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

    const fetchEmittedEvents = async () => {
      try {
        const [sessionsResponse, workshopsResponse] = await Promise.all([
          getMyEmittedSessions().catch(() => []),
          getMyFacilitatedWorkshops().catch(() => [])
        ]);
        
        if (isMounted) {
          setEmittedSessions(processResponse(sessionsResponse, ['emittedSessions', 'sessions']));
          setEmittedWorkshops(processResponse(workshopsResponse, ['workshops', 'emittedWorkshops']));
        }
      } catch (error) {
        console.error("Erro ao buscar eventos emitidos:", error);
      } finally {
        if (isMounted) {
          setLoadingEmitted(false);
        }
      }
    };

    const fetchEnrolledEvents = async () => {
      try {
        const response = await getMyEnrolledSessions();
        
        if (isMounted) {
          let enrollmentsData = [];
          if (Array.isArray(response)) {
            enrollmentsData = response;
          } else if (response.enrolledSessions && Array.isArray(response.enrolledSessions)) {
            enrollmentsData = response.enrolledSessions;
          } else if (response.enrollments && Array.isArray(response.enrollments)) {
            enrollmentsData = response.enrollments;
          } else if (response.data && Array.isArray(response.data)) {
            enrollmentsData = response.data;
          }
          
          const sessionsData = enrollmentsData
            .map((item: { session?: Session } | Session) => {
              if ('session' in item && item.session) {
                return item.session;
              }
              return item as Session;
            })
            .filter(Boolean);
          
          const allEvents = sessionsData.map((session: Session) => {
            const enrolledCount = session.enrollments?.length || 0;
            const slots = session.maxPlayers - enrolledCount;
            return {
              ...session,
              slots: slots >= 0 ? slots : 0
            };
          });
          
          setEnrolledSessions(allEvents.filter((e: Session) => e.type !== 'OFICINA'));
          setEnrolledWorkshops(allEvents.filter((e: Session) => e.type === 'OFICINA'));
        }
      } catch (error) {
        console.error("Erro ao buscar eventos inscritos:", error);
        if (isMounted) {
          setEnrolledSessions([]);
          setEnrolledWorkshops([]);
        }
      } finally {
        if (isMounted) {
          setLoadingEnrolled(false);
        }
      }
    };

    fetchEmittedEvents();
    fetchEnrolledEvents();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleEnrollmentCanceled = () => {
    setLoadingEnrolled(true);
    window.location.reload();
  };

  return (
    <RootLayout>
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-4xl font-bold mb-8 text-center">
          Meu Perfil
        </h1>

        <Tabs defaultValue="emitted" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="emitted">Emitidos</TabsTrigger>
            <TabsTrigger value="enrolled">Inscritos</TabsTrigger>
            <TabsTrigger value="settings">Config.</TabsTrigger>
          </TabsList>

          <TabsContent value="emitted" className="mt-6">
            <Tabs defaultValue="emitted-sessions" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="emitted-sessions">Mesas de RPG</TabsTrigger>
                <TabsTrigger value="emitted-workshops">Oficinas</TabsTrigger>
              </TabsList>
              
              <TabsContent value="emitted-sessions" className="mt-6">
                {loadingEmitted && <SessionSkeleton />}

                {!loadingEmitted && emittedSessions.length === 0 && (
                  <p className="text-muted-foreground text-center">
                    Você ainda não criou nenhuma mesa.
                  </p>
                )}

                {!loadingEmitted && emittedSessions.length > 0 && (
                  <div>
                    {emittedSessions.map((session, index) => (
                      <AnimatedCard key={session.id || `session-${index}`} index={index}>
                        <MasterSessionCard
                          session={session}
                          isExpanded={
                            session.id ? expandedSessions.includes(session.id) : false
                          }
                          onToggleExpand={toggleExpand}
                          onCancelSuccess={() => window.location.reload()}
                        />
                      </AnimatedCard>
                    ))}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="emitted-workshops" className="mt-6">
                {loadingEmitted && <WorkshopSkeleton />}

                {!loadingEmitted && emittedWorkshops.length === 0 && (
                  <p className="text-muted-foreground text-center">
                    Você ainda não criou nenhuma oficina.
                  </p>
                )}

                {!loadingEmitted && emittedWorkshops.length > 0 && (
                  <div>
                    {emittedWorkshops.map((workshop, index) => (
                      <AnimatedCard key={workshop.id || `workshop-${index}`} index={index}>
                        <MasterWorkshopCard
                          workshop={workshop}
                          isExpanded={
                            workshop.id ? expandedSessions.includes(workshop.id) : false
                          }
                          onToggleExpand={toggleExpand}
                          onCancelSuccess={() => window.location.reload()}
                        />
                      </AnimatedCard>
                    ))}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </TabsContent>

          <TabsContent value="enrolled" className="mt-6">
            <Tabs defaultValue="enrolled-sessions" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="enrolled-sessions">Mesas de RPG</TabsTrigger>
                <TabsTrigger value="enrolled-workshops">Oficinas</TabsTrigger>
              </TabsList>

              <TabsContent value="enrolled-sessions" className="mt-6">
                {loadingEnrolled && <SessionSkeleton />}

                {!loadingEnrolled && enrolledSessions.length === 0 && (
                  <p className="text-muted-foreground text-center">
                    Você ainda não está inscrito em nenhuma mesa.
                  </p>
                )}

                {!loadingEnrolled && enrolledSessions.length > 0 && (
                  <div>
                    {enrolledSessions.map((session, index) => (
                      <AnimatedCard key={session.id || `session-${index}`} index={index}>
                        <SessionCard
                          session={session}
                          isExpanded={
                            session.id ? expandedSessions.includes(session.id) : false
                          }
                          onToggleExpand={toggleExpand}
                          variant="enrolled"
                          onCancelSuccess={handleEnrollmentCanceled}
                        />
                      </AnimatedCard>
                    ))}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="enrolled-workshops" className="mt-6">
                {loadingEnrolled && <WorkshopSkeleton />}

                {!loadingEnrolled && enrolledWorkshops.length === 0 && (
                  <p className="text-muted-foreground text-center">
                    Você ainda não está inscrito em nenhuma oficina.
                  </p>
                )}

                {!loadingEnrolled && enrolledWorkshops.length > 0 && (
                  <div>
                    {enrolledWorkshops.map((workshop, index) => (
                      <AnimatedCard key={workshop.id || `workshop-${index}`} index={index}>
                        <WorkshopCard
                          workshop={workshop}
                          isExpanded={
                            workshop.id ? expandedSessions.includes(workshop.id) : false
                          }
                          onToggleExpand={toggleExpand}
                          variant="enrolled"
                          onCancelSuccess={handleEnrollmentCanceled}
                        />
                      </AnimatedCard>
                    ))}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </TabsContent>

          <TabsContent value="settings" className="mt-6 space-y-6">
            <div
              className="animate-card-in"
              style={{ animationDelay: '0ms', animationFillMode: 'both' }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Configurações de Perfil</CardTitle>
                  <CardDescription>
                    Atualize suas informações pessoais visíveis para mestres e jogadores.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Form {...profileForm}>
                    <form onSubmit={profileForm.handleSubmit(onSubmitProfileOptions)} className="space-y-4">
                      <FormField
                        control={profileForm.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Nome Completo</FormLabel>
                            <FormControl>
                              <Input placeholder="Seu nome" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={profileForm.control}
                        name="phoneNumber"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Telefone (com DDD)</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="(00) 00000-0000"
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
                      <Button type="submit" disabled={isUpdatingProfile} className="w-full sm:w-auto uppercase">
                        {isUpdatingProfile ? <><Loader2 className="animate-spin" /> Salvando...</> : "Salvar Alterações"}
                      </Button>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </div>

            <div
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              <div className="animate-card-in" style={{ animationDelay: '80ms', animationFillMode: 'both' }}>
                <Card>
                  <CardHeader>
                    <CardTitle>Alterar Email</CardTitle>
                    <CardDescription>
                      Mude o endereço de email de sua conta. Requer a senha atual.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Form {...emailForm}>
                      <form onSubmit={emailForm.handleSubmit(onSubmitEmailOptions)} className="space-y-4">
                        <FormField
                          control={emailForm.control}
                          name="newEmail"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Novo Email</FormLabel>
                              <FormControl>
                                <Input type="email" placeholder="Seu novo email" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={emailForm.control}
                          name="currentPassword"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Senha Atual</FormLabel>
                              <FormControl>
                                <Input type="password" placeholder="Sua senha atual" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <Button type="submit" disabled={isUpdatingEmail} className="w-full uppercase" variant="outline">
                          {isUpdatingEmail ? <><Loader2 className="animate-spin" /> Salvando...</> : "Atualizar Email"}
                        </Button>
                      </form>
                    </Form>
                  </CardContent>
                </Card>
              </div>

              <div className="animate-card-in" style={{ animationDelay: '160ms', animationFillMode: 'both' }}>
                <Card>
                  <CardHeader>
                    <CardTitle>Alterar Senha</CardTitle>
                    <CardDescription>
                      Recadastre a sua palavra passe do sistema.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Form {...passwordForm}>
                      <form onSubmit={passwordForm.handleSubmit(onSubmitPasswordOptions)} className="space-y-4">
                        <FormField
                          control={passwordForm.control}
                          name="currentPassword"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Senha Atual</FormLabel>
                              <FormControl>
                                <Input type="password" placeholder="Sua senha atual" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={passwordForm.control}
                          name="newPassword"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Nova Senha</FormLabel>
                              <FormControl>
                                <Input type="password" placeholder="Nova senha" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={passwordForm.control}
                          name="confirmNewPassword"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Confirmar Nova Senha</FormLabel>
                              <FormControl>
                                <Input type="password" placeholder="Confirme a nova senha" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <Button type="submit" disabled={isUpdatingPassword} className="w-full uppercase" variant="outline">
                          {isUpdatingPassword ? <><Loader2 className="animate-spin" /> Salvando...</> : "Atualizar Senha"}
                        </Button>
                      </form>
                    </Form>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </RootLayout>
  );
};

export default Profile;
