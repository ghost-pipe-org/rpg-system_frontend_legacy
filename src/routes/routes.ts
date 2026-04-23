import { Login, Register, NotFound, Home, Sessions, Test, CreateSessions, Profile, Admin } from '../pages';

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  SESSIONS: '/sessions',
  CREATE_SESSIONS: '/sessions/create',
  PROFILE: '/profile',
  ADMIN: '/admin',
  TEST: '/test'
} as const;

export const ROUTE_LABELS = {
  [ROUTES.HOME]: 'Início',
  [ROUTES.LOGIN]: 'Login',
  [ROUTES.REGISTER]: 'Cadastro',
  [ROUTES.SESSIONS]: 'Sessões',
  [ROUTES.CREATE_SESSIONS]: 'Emitir Sessão',
  [ROUTES.PROFILE]: 'Perfil',
  [ROUTES.ADMIN]: 'Admin',
  [ROUTES.TEST]: 'Testes'
} as const;

export const routes = [
  {
    path: '/',
    element: Home,
    requireAuth: true,
    title: 'Home'
  },
  {
    path: '/login',
    element: Login,
    requireAuth: false,
    title: 'Entrar'
  },
  {
    path: '/register',
    element: Register,
    requireAuth: false,
    title: 'Criar Conta'
  },
  {
    path: '/sessions',
    element: Sessions,
    requireAuth: true,
    title: 'Sessões de RPG'
  },
  {
    path: '/sessions/create',
    element: CreateSessions,
    requireAuth: true,
    title: 'Emitir Nova Sessão'
  },
  {
    path: '/profile',
    element: Profile,
    requireAuth: true,
    title: 'Meu Perfil'
  },
  {
    path: '/admin',
    element: Admin,
    requireAuth: true,
    title: 'Administração'
  },
  {
    path: '/test',
    element: Test,
    requireAuth: true,
    title: 'Testes'
  },
  {
    path: '*',
    element: NotFound,
    requireAuth: false,
    title: 'Página não encontrada'
  }
];
