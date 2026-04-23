import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import RootLayout from '../components/layout/RootLayout';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '../components/ui/form';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Plus, X, Search, Loader2 } from 'lucide-react';
import { createWorkshopSchema, type CreateWorkshopFormData } from '../schemas';
import { createWorkshop } from '../services/sessionServices/session.services';
import { searchUserByEmail } from '../services/userServices/user.services';
import { toast } from 'sonner';
import type { CreateWorkshopRequest, UserSearchResult } from '@/services/sessionServices/session.types';
import { dateToISONoon } from '@/utils/formatDate';
import { useAuth } from '@/context/AuthContext';

const CreateWorkshop = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [possibleDates, setPossibleDates] = useState<Date[]>([]);
  const [facilitators, setFacilitators] = useState<UserSearchResult[]>([]);
  const [searchEmail, setSearchEmail] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  
  const { user } = useAuth();

  const form = useForm<CreateWorkshopFormData>({
    resolver: zodResolver(createWorkshopSchema),
    defaultValues: {
      title: '',
      description: '',
      requirements: '',
      possibleDates: [],
      period: 'NOITE',
      minPlayers: 3,
      maxPlayers: 15,
      facilitatorIds: [],
    },
  });

  const handleSearchUser = async () => {
    if (!searchEmail.trim()) return;
    
    // Evita adicionar a si mesmo novamente se o backend já o faz, ou permite para feedback visual
    if (user && searchEmail.toLowerCase() === user.email.toLowerCase()) {
      toast.info('Você já é automaticamente um ministrante desta oficina.');
      setSearchEmail('');
      return;
    }

    if (facilitators.some(f => f.email.toLowerCase() === searchEmail.toLowerCase())) {
      toast.error('Este usuário já foi adicionado.');
      return;
    }

    setIsSearching(true);
    try {
      const response = await searchUserByEmail(searchEmail);
      if (response && response.data) {
        const newUser = response.data;
        const newFacilitators = [...facilitators, newUser];
        setFacilitators(newFacilitators);
        form.setValue('facilitatorIds', newFacilitators.map(f => f.id));
        toast.success(`Usuário ${newUser.name} adicionado com sucesso!`);
        setSearchEmail('');
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Usuário não encontrado.');
    } finally {
      setIsSearching(false);
    }
  };

  const removeFacilitator = (idToRemove: string) => {
    const updatedFacilitators = facilitators.filter(f => f.id !== idToRemove);
    setFacilitators(updatedFacilitators);
    form.setValue('facilitatorIds', updatedFacilitators.map(f => f.id));
  };

  const addDate = () => {
    const newDate = new Date();
    newDate.setDate(newDate.getDate() + 7);
    newDate.setHours(12, 0, 0, 0);
    
    const updatedDates = [...possibleDates, newDate];
    setPossibleDates(updatedDates);
    form.setValue('possibleDates', updatedDates);
  };

  const removeDate = (index: number) => {
    const updatedDates = possibleDates.filter((_, i) => i !== index);
    setPossibleDates(updatedDates);
    form.setValue('possibleDates', updatedDates);
  };

  const updateDate = (index: number, newDate: string) => {
    const updatedDates = [...possibleDates];
    updatedDates[index] = new Date(newDate);
    setPossibleDates(updatedDates);
    form.setValue('possibleDates', updatedDates);
  };

  const onSubmit = async (data: CreateWorkshopFormData) => {
    setIsSubmitting(true);
    try {
      const workshopData: CreateWorkshopRequest = {
        ...data,
        possibleDates: data.possibleDates.map(date => dateToISONoon(date)),
        facilitatorIds: facilitators.map(f => f.id)
      };
      
      await createWorkshop(workshopData);
      toast.success('Oficina criada com sucesso!');
      form.reset();
      setPossibleDates([]);
      setFacilitators([]);
    } catch (error) {
      console.error('Erro ao emitir oficina:', error);
      toast.error('Erro ao emitir oficina. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('pt-BR', {
      weekday: 'short',
      day: '2-digit',
      month: 'short',
    });
  };

  return (
    <RootLayout>
      <div className="mx-auto max-w-md w-full">
        <h1 className="text-4xl font-bold text-foreground mb-8 text-center">
          Emitir Nova Oficina
        </h1>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6 md:px-0 px-6"
          >
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-prompt">Título da Oficina</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Ex: Workshop de Criação de Mundos"
                      className="font-prompt"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-prompt">Ementa / Descrição</FormLabel>
                  <FormDescription className="font-prompt">
                    Dê detalhes sobre o conteúdo que será abordado na oficina.
                  </FormDescription>
                  <FormControl>
                    <Textarea 
                      placeholder="Descreva o conteúdo da oficina, o que será ensinado..."
                      className="min-h-[100px] font-prompt"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="requirements"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-prompt">Requisitos (Opcional)</FormLabel>
                  <FormDescription className="font-prompt">
                    Especifique qualquer requisito ou material necessário.
                  </FormDescription>
                  <FormControl>
                    <Textarea 
                      placeholder="Ex: Trazer caderno e lápis, ter lido o material X"
                      className="min-h-[80px] font-prompt"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-4 border rounded-md p-4 bg-muted/20">
              <div>
                <FormLabel className="font-prompt">Ministrantes Adicionais (Opcional)</FormLabel>
                <FormDescription className="font-prompt mb-2">
                  Você já é um ministrante. Adicione outros usuários pelo email.
                </FormDescription>
                <div className="flex gap-2">
                  <Input 
                    placeholder="email@exemplo.com"
                    value={searchEmail}
                    onChange={(e) => setSearchEmail(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleSearchUser();
                      }
                    }}
                    className="font-prompt"
                  />
                  <Button 
                    type="button" 
                    variant="secondary" 
                    onClick={handleSearchUser}
                    disabled={isSearching || !searchEmail.trim()}
                  >
                    {isSearching ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              {facilitators.length > 0 && (
                <div className="space-y-2 mt-4">
                  <p className="text-sm font-medium">Ministrantes adicionados:</p>
                  {facilitators.map((facilitator) => (
                    <div key={facilitator.id} className="flex items-center justify-between bg-background border p-2 rounded-md">
                      <div className="flex flex-col">
                        <span className="text-sm font-medium">{facilitator.name}</span>
                        <span className="text-xs text-muted-foreground">{facilitator.email}</span>
                      </div>
                      <Button 
                        type="button" 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => removeFacilitator(facilitator.id)}
                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <FormField
              control={form.control}
              name="period"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-prompt">Período</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="font-prompt bg-background w-full">
                        <SelectValue placeholder="Selecione o período" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="MANHA">Manhã</SelectItem>
                      <SelectItem value="TARDE">Tarde</SelectItem>
                      <SelectItem value="NOITE">Noite</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="minPlayers"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-prompt">Mínimo de Participantes</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        min="1" 
                        max="50"
                        className="font-prompt"
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="maxPlayers"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-prompt">Máximo de Participantes</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        min="1" 
                        max="50"
                        className="font-prompt"
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <FormLabel className="font-prompt">Datas Possíveis</FormLabel>
                <Button 
                  type="button" 
                  variant="accent"
                  size="sm"
                  onClick={addDate}
                  className="flex items-center gap-2 font-prompt"
                >
                  <Plus className="h-4 w-4" />
                  Adicionar Data
                </Button>
              </div>

              {possibleDates.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <p className="font-prompt">Nenhuma data adicionada ainda</p>
                  <p className="text-sm font-prompt">Clique em "Adicionar Data" para começar</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {possibleDates.map((date, index) => (
                    <div key={index} className="flex flex-col sm:flex-row items-start sm:items-center gap-3 p-3 border-0">
                      <div className="flex-1 w-full sm:w-auto">
                        <Input
                          type="date"
                          className="font-prompt"
                          value={date.toISOString().slice(0, 10)}
                          onChange={(e) => {
                            const newDate = new Date(e.target.value + 'T12:00:00');
                            updateDate(index, newDate.toISOString());
                          }}
                          placeholder={formatDate(date)}
                        />
                      </div>
                      <div className="flex items-center gap-2 w-full sm:w-auto">
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeDate(index)}
                          className="text-red-500 hover:text-foreground flex-shrink-0"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              
              {form.formState.errors.possibleDates && (
                <p className="text-sm text-red-500 font-prompt">
                  {form.formState.errors.possibleDates.message}
                </p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full font-prompt uppercase"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Emitindo oficina..." : "Emitir oficina"}
            </Button>
          </form>
        </Form>
      </div>
    </RootLayout>
  );
};

export default CreateWorkshop;
