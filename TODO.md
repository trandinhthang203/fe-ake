# TODO: Create API Interfaces for Backend

## Tasks
- [x] Update `src/types/api.ts` to include all backend schema types (UserLogin, UserToken, UserRegister, UserResponse, UserUpdate, SessionResponse, SessionDetailResponse, SessionUpdate)
- [x] Create `src/services/authService.ts` for login and register
- [x] Create `src/services/userService.ts` for user operations (get profile, update, etc.)
- [x] Create `src/services/sessionService.ts` for session management
- [x] Update `src/services/chatService.ts` to use `session_id` (number) instead of `conversation_id`

## Followup Steps
- [x] Integrate ChatContext with backend sessions (load, create, delete conversations)
- [x] Integrate services into components and contexts (e.g., AuthContext)
- [ ] Test API calls

## Summary
All API interfaces have been created successfully. The frontend now has complete service layers for auth, user management, chat, and session operations, matching the backend APIs. Types have been updated to align with backend schemas, and chat service now uses session_id as a number.
