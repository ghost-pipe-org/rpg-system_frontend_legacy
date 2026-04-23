import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import RootLayout from '../components/layout/RootLayout';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '../components/ui/form';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Plus, X } from 'lucide-react';
import { createSessionSchema, type CreateSessionFormData, System } from '../schemas';
import { createSession } from '../services/sessionServices/session.services';
import { toast } from 'sonner';
import type { CreateSessionRequest } from '@/services/sessionServices/session.types';
import { dateToISONoon } from '@/utils/formatDate';

const CreateSessions = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [possibleDates, setPossibleDates] = useState<Date[]>([]);

  const form = useForm<CreateSessionFormData>({
    resolver: zodResolver(createSessionSchema),
    defaultValues: {
      title: '',
      description: '',
      requirements: '',
      system: System.DND,
      possibleDates: [],
      period: 'NOITE',
      minPlayers: 3,
      maxPlayers: 6,
    },
  });

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

  const onSubmit = async (data: CreateSessionFormData) => {
    setIsSubmitting(true);
    try {
      const sessionData: CreateSessionRequest = {
        ...data,
        possibleDates: data.possibleDates.map(date => dateToISONoon(date))
      };
      
      console.log("Datas enviadas:", sessionData.possibleDates);
      
      await createSession(sessionData);
      toast.success('Sessão criada com sucesso!');
      form.reset();
      setPossibleDates([]);
    } catch (error) {
      console.error('Erro ao emitir sessão:', error);
      toast.error('Erro ao emitir sessão. Tente novamente.');
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
          Emitir Nova Sessão
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
                  <FormLabel className="font-prompt">Título da Sessão</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Ex: Campanha de D&D: A Maldição de Strahd"
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
                  <FormLabel className="font-prompt">Descrição</FormLabel>
                  <FormDescription className="font-prompt">
                    Dê detalhes sobre o que os jogadores podem esperar da sessão.
                  </FormDescription>
                  <FormControl>
                    <Textarea 
                      placeholder="Descreva a aventura, cenário e o que os jogadores podem esperar..."
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
                  <FormLabel className="font-prompt">Requisitos</FormLabel>
                  <FormDescription className="font-prompt">
                    Especifique qualquer requisito necessário para participar da sessão.
                  </FormDescription>
                  <FormControl>
                    <Textarea 
                      placeholder="Ex: Conhecimento básico de D&D 5e, disponibilidade para sessões semanais"
                      className="min-h-[80px] font-prompt"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="system"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-prompt">Sistema de RPG</FormLabel>
                  <FormDescription className="font-prompt">
                    Escolha o sistema de RPG que será usado na sessão.
                  </FormDescription>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="font-prompt bg-background w-full">
                        <SelectValue placeholder="Selecione um sistema" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Object.values(System).map((system) => (
                        <SelectItem key={system} value={system}>
                          {system}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

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
                    <FormLabel className="font-prompt">Mínimo de Jogadores</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        min="1" 
                        max="20"
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
                    <FormLabel className="font-prompt">Máximo de Jogadores</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        min="1" 
                        max="20"
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
              {isSubmitting ? "Emitindo sessão..." : "Emitir sessão"}
            </Button>
          </form>
        </Form>
      </div>
    </RootLayout>
  );
};

export default CreateSessions;