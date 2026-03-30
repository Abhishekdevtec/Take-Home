export declare class AuthService {
    register(data: {
        email: string;
        password: string;
        name: string;
    }): Promise<{
        user: import("@supabase/supabase-js").AuthUser | null;
        session: import("@supabase/supabase-js").AuthSession | null;
    }>;
    login(data: {
        email: string;
        password: string;
    }): Promise<{
        user: import("@supabase/supabase-js").AuthUser;
        session: import("@supabase/supabase-js").AuthSession;
    }>;
}
