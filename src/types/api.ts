// Backend API type definitions

// Auth types
export interface UserLogin {
    email: string;
    password: string;
}

export interface UserToken {
    token: string;
    token_type: string;
}

export interface UserRegister {
    email: string;
    password: string;
    fullname?: string;
    avatar_url?: string;
}

export interface UserResponse {
    user_id: number;
    email: string;
    avatar_url: string;
    fullname: string;
}

export interface UserUpdate {
    email?: string;
    password?: string;
    avatar_url?: string;
    fullname?: string;
}

// Chat types
export interface ChatRequest {
    query: string;
    session_id: number;
    use_cache?: boolean;
}

export interface ChatResponse {
    answer: string;
    sources: Record<string, any>;
    needs_feedback: boolean;
    cached: boolean;
}

export interface FeedbackRequest {
    session_id: number;
    user_feedback?: string;
}

export interface HealthResponse {
    status: string;
    version: string;
}

// Session types
export interface SessionResponse {
    session_id: number;
    created_at: string; // ISO date string
    title: string;
}

export interface SessionUpdate {
    title: string;
}

export interface ConversationResponse {
    conversation_id: string; // UUID
    content: string;
    is_user: boolean;
    created_at: string; // ISO date string
}

export interface SessionDetailResponse {
    session_id: number;
    title: string;
    created_at: string; // ISO date string
    conversations: ConversationResponse[];
}
