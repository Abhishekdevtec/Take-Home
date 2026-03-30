import { Injectable } from '@nestjs/common';
import { supabase } from '../../common/supabase.client';

@Injectable()
export class AuthService {
  async register(data: { email: string; password: string; name: string }) {
    const { data: authData, error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
    });

    if (error) throw error;

    // Optionally store user profile data
    if (authData.user) {
      const { error: profileError } = await supabase
        .from('users')
        .insert([
          {
            id: authData.user.id,
            email: data.email,
            name: data.name,
          },
        ]);

      if (profileError) throw profileError;
    }

    return {
      user: authData.user,
      session: authData.session,
    };
  }

  async login(data: { email: string; password: string }) {
    const { data: authData, error } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    });

    if (error) throw error;

    return {
      user: authData.user,
      session: authData.session,
    };
  }
}
