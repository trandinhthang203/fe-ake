// Backend API type definitions
export interface ChatRequest {
    query: string;
    conversation_id?: string;
    use_cache?: boolean;
}

export interface ChatResponse {
    answer: string;
    sources: Record<string, any>; // Changed from string[] to dict
    needs_feedback: boolean; // New field
    cached: boolean;
}

export interface FeedbackRequest {
    conversation_id: string;
    user_feedback: string;
}

export interface HealthResponse {
    status: string;
    version: string;
}
