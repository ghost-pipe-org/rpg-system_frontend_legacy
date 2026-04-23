interface Session {
    id?: string;
    title: string;
    description: string;
    status?: string;
    system: string;
    period: string;
    minPlayers: number;
    maxPlayers: number;
    masterId?: string;
    createdAt?: string;
    updatedAt?: string;

    possibleDates?: {
        id: string;
        date: string;
    }[];
    master?: {
        name: string;
    };

    slots?: number;
    requirements: string;
    iconUrl?: string;
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

interface ApproveSessionRequest {
    approvedDate: string;
    location: string;
}

interface RejectSessionRequest {
    cancelEvent: string;
}

export type { Session, CreateSessionRequest, ApproveSessionRequest, RejectSessionRequest };