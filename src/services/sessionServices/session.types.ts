interface Facilitator {
    id: string;
    name: string;
    email: string;
}

interface Session {
    id?: string;
    type?: 'MESA' | 'OFICINA';
    title: string;
    description: string;
    status?: string;
    system?: string;
    period: string;
    minPlayers: number;
    maxPlayers: number;
    masterId?: string | null;
    createdAt?: string;
    updatedAt?: string;

    possibleDates?: {
        id: string;
        date: string;
    }[];
    master?: {
        name: string;
    } | null;
    facilitators?: {
        userId: string;
        user: Facilitator;
    }[];

    slots?: number;
    requirements?: string;
    location?: string | null;
    approvedDate?: string | null;
    cancelEvent?: string | null;
    enrollments?: {
        id: string;
        userId: string;
        sessionId: string;
        status: string;
        createdAt: string;
        user?: {
            id: string;
            name: string;
            email: string;
            phoneNumber?: string;
        };
    }[];
}

interface CreateSessionRequest {
    title: string;
    description: string;
    requirements: string;
    system: string;
    possibleDates: string[];
    period: 'MANHA' | 'TARDE' | 'NOITE';
    minPlayers: number;
    maxPlayers: number;
}

interface CreateWorkshopRequest {
    title: string;
    description: string;
    requirements?: string;
    location?: string;
    possibleDates: string[];
    period: 'MANHA' | 'TARDE' | 'NOITE';
    minPlayers: number;
    maxPlayers: number;
    facilitatorIds: string[];
}

interface ApproveSessionRequest {
    approvedDate: string;
    location: string;
}

interface RejectSessionRequest {
    cancelEvent: string;
}

interface UserSearchResult {
    id: string;
    name: string;
    email: string;
    role: string;
}

export type {
    Session,
    Facilitator,
    CreateSessionRequest,
    CreateWorkshopRequest,
    ApproveSessionRequest,
    RejectSessionRequest,
    UserSearchResult,
};