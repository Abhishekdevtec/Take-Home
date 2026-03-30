export declare class AuthService {
    register(data: {
        email: string;
        password: string;
        name: string;
    }): Promise<{
        user: import("@supabase/auth-js").User | null;
        session: import("@supabase/auth-js").Session | null;
    }>;
    login(data: {
        email: string;
        password: string;
    }): Promise<{
        user: import("@supabase/auth-js").User;
        session: import("@supabase/auth-js").Session;
    }>;
}
