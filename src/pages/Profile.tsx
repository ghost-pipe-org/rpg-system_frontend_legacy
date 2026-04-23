import RootLayout from "@/components/layout/RootLayout";
import { SessionCard, SessionSkeleton } from "@/components/custom/SessionCard";
import { MasterSessionCard } from "@/components/custom/MasterSessionCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

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
import { getMyEmittedSessions, getMyEnrolledSessions } from "@/services/sessionServices/session.services";
import { formatPhoneNumber } from "@/utils/formatPhoneNumber";

const Profile = () => {
  const [expandedSessions, setExpandedSessions] = useState<string[]>([]);
  const [emittedSessions, setEmittedSessions] = useState<Session[]>([]);
  const [enrolledSessions, setEnrolledSessions] = useState<Session[]>([]);
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

    const fetchEmittedSessions = async () => {
      try {
        const response = await getMyEmittedSessions();
        console.log("Emitted Sessions - Full Response:", response);
        
        if (isMounted) {
          // Tenta diferentes formatos de resposta
          let sessionsData = [];
          if (Array.isArray(response)) {
            sessionsData = response;
          } else if (response.emittedSessions && Array.isArray(response.emittedSessions)) {
            sessionsData = response.emittedSessions;
          } else if (response.sessions && Array.isArray(response.sessions)) {
            sessionsData = response.sessions;
          } else if (response.data && Array.isArray(response.data)) {
            sessionsData = response.data;
          } else if (response.data?.sessions && Array.isArray(response.data.sessions)) {
            sessionsData = response.data.sessions;
          }
          
          // Calcula as vagas disponíveis para cada sessão
          const sessionsWithSlots = sessionsData.map((session: Session) => {
            const enrolledCount = session.enrollments?.length || 0;
            const slots = session.maxPlayers - enrolledCount;
            return {
              ...session,
              slots: slots >= 0 ? slots : 0
            };
          });
          
          console.log("Emitted Sessions - Processed Data:", sessionsWithSlots);
          setEmittedSessions(sessionsWithSlots);
        }
      } catch (error) {
        console.error("Erro ao buscar sessões emitidas:", error);
        
        if (isMounted) {
          setEmittedSessions([]);
        }
      } finally {
        if (isMounted) {
          setLoadingEmitted(false);
        }
      }
    };

    const fetchEnrolledSessions = async () => {
      try {
        const response = await getMyEnrolledSessions();
        console.log("Enrolled Sessions - Full Response:", response);
        
        if (isMounted) {
          // Tenta diferentes formatos de resposta
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
          
          // Extrai as sessions de dentro dos enrollments
          // O backend retorna SessionEnrollment[] que tem { session: Session }
          const sessionsData = enrollmentsData
            .map((item: { session?: Session } | Session) => {
              if ('session' in item && item.session) {
                return item.session;
              }
              return item as Session;
            })
            .filter(Boolean);
          
          console.log("Sessions extraídas dos enrollments:", sessionsData);
          
          // Calcula as vagas disponíveis para cada sessão
          const sessionsWithSlots = sessionsData.map((session: Session) => {
            const enrolledCount = session.enrollments?.length || 0;
            const slots = session.maxPlayers - enrolledCount;
            return {
              ...session,
              slots: slots >= 0 ? slots : 0
            };
          });
          
          console.log("Enrolled Sessions - Processed Data:", sessionsWithSlots);
          setEnrolledSessions(sessionsWithSlots);
        }
      } catch (error) {
        console.error("Erro ao buscar sessões inscritas:", error);
        
        if (isMounted) {
          setEnrolledSessions([]);
        }
      } finally {
        if (isMounted) {
          setLoadingEnrolled(false);
        }
      }
    };

    fetchEmittedSessions();
    fetchEnrolledSessions();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleEnrollmentCanceled = () => {
    // Optionally trigger a re-fetch or filter out the state. We'll reload the state by fetching again since there are many dependencies:
    setLoadingEnrolled(true);
    // Refresh page hack or state
    window.location.reload();
  };

  return (
    <RootLayout>
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-4xl font-bold mb-8 text-center">
          Minhas Mesas
        </h1>

        <Tabs defaultValue="emitted" className="w-full">
          <TabsList className="grid w-full grid-cols-1 sm:grid-cols-3">
            <TabsTrigger value="emitted">Mesas Emitidas</TabsTrigger>
            <TabsTrigger value="enrolled">Mesas Inscritas</TabsTrigger>
            <TabsTrigger value="settings">Configurações</TabsTrigger>
          </TabsList>

          <TabsContent value="emitted" className="mt-6">
            {loadingEmitted && <SessionSkeleton />}

            {!loadingEmitted && emittedSessions.length === 0 && (
              <p className="text-muted-foreground text-center">
                Você ainda não criou nenhuma mesa.
              </p>
            )}

            {!loadingEmitted && emittedSessions.length > 0 && (
              <div>
                {emittedSessions.map((session) => (
                  <MasterSessionCard
                    key={session.id || `session-${Math.random()}`}
                    session={session}
                    isExpanded={
                      session.id ? expandedSessions.includes(session.id) : false
                    }
                    onToggleExpand={toggleExpand}
                    onCancelSuccess={() => window.location.reload()}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="enrolled" className="mt-6">
            {loadingEnrolled && <SessionSkeleton />}

            {!loadingEnrolled && enrolledSessions.length === 0 && (
              <p className="text-muted-foreground text-center">
                Você ainda não está inscrito em nenhuma mesa.
              </p>
            )}

            {!loadingEnrolled && enrolledSessions.length > 0 && (
              <div>
                {enrolledSessions.map((session) => (
                  <SessionCard
                    key={session.id || `session-${Math.random()}`}
                    session={session}
                    isExpanded={
                      session.id ? expandedSessions.includes(session.id) : false
                    }
                    onToggleExpand={toggleExpand}
                    variant="enrolled"
                    onCancelSuccess={handleEnrollmentCanceled}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="settings" className="mt-6">
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
                      {isUpdatingProfile ? "Salvando..." : "Salvar Alterações"}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
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
                        {isUpdatingEmail ? "Salvando..." : "Atualizar Email"}
                      </Button>
                    </form>
                  </Form>
                </CardContent>
              </Card>

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
                        {isUpdatingPassword ? "Salvando..." : "Atualizar Senha"}
                      </Button>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </RootLayout>
  );
};

export default Profile;
