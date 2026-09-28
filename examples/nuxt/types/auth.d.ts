// Augments the nuxt-auth-utils session so `session.user` / `session.token`
// are typed everywhere `useUserSession()` is read. Shape mirrors the backend
// login payload sealed by POST /api/auth/session.
declare module "#auth-utils" {
  interface User {
    id: number;
    name: string;
    email?: string;
    is_password_change_required?: boolean;
    [key: string]: unknown;
  }
  interface UserSessionData {
    token: string;
    loggedInAt: number;
  }
}

export {};
