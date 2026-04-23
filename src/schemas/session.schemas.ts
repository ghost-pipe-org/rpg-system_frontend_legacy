import { z } from 'zod';

export const System = {
  DND: 'D&D 5e',
  VAMPIRE: 'Vampiro: A Máscara',
  KAOS_EM_NOVA_PATOS: 'Kaos em Nova Patos',
  ORDEM_PARANORMAL: 'Ordem Paranormal',
  TORMENTA20: 'Tormenta20',
  PATHFINDER: 'Pathfinder 2e',
  CALL_OF_CTHULHU: 'Call of Cthulhu',
  OUTROS: 'Outros'
} as const;

export type System = typeof System[keyof typeof System];

export const createSessionSchema = z.object({
  title: z.string()
    .min(3, 'Título deve ter pelo menos 3 caracteres')
    .max(100, 'Título deve ter no máximo 100 caracteres'),
  
  description: z.string()
    .min(10, 'Descrição deve ter pelo menos 10 caracteres')
    .max(1000, 'Descrição deve ter no máximo 1000 caracteres'),
  
  requirements: z.string()
    .min(5, 'Requisitos devem ter pelo menos 5 caracteres')
    .max(500, 'Requisitos devem ter no máximo 500 caracteres'),
  
  system: z.enum(Object.values(System) as [string, ...string[]], {
    message: 'Sistema deve ser um dos valores válidos'
  }),
  
  possibleDates: z.array(z.date('Data deve estar no formato ISO'))
    .min(1, 'Pelo menos uma data deve ser selecionada')
    .max(10, 'Máximo de 10 datas possíveis'),
  
  period: z.enum(['MANHA', 'TARDE', 'NOITE' as const], {
    error: 'Período deve ser manhã, tarde ou noite'
  }),
  
  minPlayers: z.number()
    .int('Número mínimo de jogadores deve ser um inteiro')
    .min(1, 'Mínimo de 1 jogador')
    .max(20, 'Máximo de 20 jogadores'),
  
  maxPlayers: z.number()
    .int('Número máximo de jogadores deve ser um inteiro')
    .min(1, 'Mínimo de 1 jogador')
    .max(10, 'Máximo de 10 jogadores'),
}).refine(
  (data) => data.minPlayers <= data.maxPlayers,
  {
    message: 'Número mínimo de jogadores deve ser menor ou igual ao máximo',
    path: ['maxPlayers'],
  }
);

export type CreateSessionFormData = z.infer<typeof createSessionSchema>;

export const createWorkshopSchema = z.object({
  title: z.string()
    .min(3, 'Título deve ter pelo menos 3 caracteres')
    .max(100, 'Título deve ter no máximo 100 caracteres'),
  
  description: z.string()
    .min(10, 'Descrição deve ter pelo menos 10 caracteres')
    .max(1000, 'Descrição deve ter no máximo 1000 caracteres'),
  
  requirements: z.string()
    .max(500, 'Requisitos devem ter no máximo 500 caracteres')
    .optional(),
  
  possibleDates: z.array(z.date('Data deve estar no formato ISO'))
    .min(1, 'Pelo menos uma data deve ser selecionada')
    .max(10, 'Máximo de 10 datas possíveis'),
  
  period: z.enum(['MANHA', 'TARDE', 'NOITE' as const], {
    error: 'Período deve ser manhã, tarde ou noite'
  }),
  
  minPlayers: z.number()
    .int('Número mínimo de participantes deve ser um inteiro')
    .min(1, 'Mínimo de 1 participante')
    .max(50, 'Máximo de 50 participantes'),
  
  maxPlayers: z.number()
    .int('Número máximo de participantes deve ser um inteiro')
    .min(1, 'Mínimo de 1 participante')
    .max(50, 'Máximo de 50 participantes'),
    
  facilitatorIds: z.array(z.string()).optional(),
}).refine(
  (data) => data.minPlayers <= data.maxPlayers,
  {
    message: 'Número mínimo de participantes deve ser menor ou igual ao máximo',
    path: ['maxPlayers'],
  }
);

export type CreateWorkshopFormData = z.infer<typeof createWorkshopSchema>;
