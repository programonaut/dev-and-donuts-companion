import { users, events, matches, data } from '../../lib/schema';

// Database types
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

export type Event = typeof events.$inferSelect;
export type NewEvent = typeof events.$inferInsert;

export type Match = typeof matches.$inferSelect;
export type NewMatch = typeof matches.$inferInsert;

export type Data = typeof data.$inferSelect;
export type NewData = typeof data.$inferInsert;

// API Response types
export interface ApiResponse<T = any> {
    success: boolean;
    data?: T;
    error?: string;
    message?: string;
    count?: number;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
    count: number;
    page?: number;
    limit?: number;
    totalPages?: number;
}

// Request types
export interface CreateUserRequest {
    name: string;
    uniqueIdentifier: string;
    answers?: Record<string, any>;
}

export interface CreateEventRequest {
    date: string;
    name: string;
    structure?: Record<string, any>;
}

export interface CreateMatchRequest {
    userId1: number;
    userId2: number;
    reason: string;
}

// Questionnaire types (matching the frontend)
export type Questionnaire = {
    name: string;
    technicalDomain:
    | "web_development"
    | "mobile_development"
    | "ai"
    | "cloud_computing"
    | "devops"
    | "security"
    | "other"
    | undefined;
    technicalDomainOther: string;
    tonight: string;
    sideProject: string;
    helpSkill: string;
    nonSoftware: string;
};

export type EventStructure = {
    timetable: TimeTableType;
};

export type TimeTableType = TimeTableEntryType[];

export type TimeTableEntryType = {
    title: string;
    speaker?: {
        name: string;
        image: string;
    };
    summary: string;
    description: string;
    start: string;
    end: string;
};


// Environment variables
export interface EnvConfig {
    DATABASE_URL: string;
    PORT: number;
    NODE_ENV: 'development' | 'production' | 'test';
    CORS_ORIGIN: string;
    GROQ: string;
} 