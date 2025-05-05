import { createClient, SupabaseClient } from '@supabase/supabase-js';
import Cookies from 'js-cookie';
import axios from 'axios';

const supabase: SupabaseClient = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);

export function useGoogleAuth() {
  const handleAuthCallback = async (): Promise<any> => {
    try {
      // Get the current user session from Supabase
      const { data: { user }, error } = await supabase.auth.getUser();
      
      // Debug: Log the result of supabase.auth.getUser
      console.log('supabase.auth.getUser result:', { user, error });
      console.log(user?.user_metadata.full_name);
      
      if (!user) {
        throw new Error("No authenticated user found");
      }
      
      // Send user info to your backend API
      const response = await axios.post('https://teamtrackbackend-production.up.railway.app/auth/google/callback', {
        user_id: user.id,
        full_name: user.user_metadata.full_name,
        email: user.email
      });
      
      if (response.data.success) {
        // Store user info in cookies
        Cookies.set('userAuthenticated', 'true', { expires: 7 });
        Cookies.set('userId', response.data.userId, { expires: 7 });
        Cookies.set('firstName', response.data.firstName, { expires: 7 });
        Cookies.set('userEmail', response.data.email, { expires: 7 });
        Cookies.set('userRole', response.data.userRole, { expires: 7 });
        Cookies.set('organizationId', response.data.organizationId, { expires: 7 });
        
        return response.data;
      } else {
        throw new Error(response.data.error || "Authentication failed");
      }
    } catch (error) {
      console.error('Error during authentication callback:', error);
      return { error };
    }
  };

  const loginWithGoogle = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: 'https://call-helper.vercel.app/auth'
        }
      });

      if (error) {
        console.error('Error al iniciar sesión con Google:', error.message);
        return { error };
      }

      return { success: true };
    } catch (error) {
      console.error('Error inesperado:', error);
      return { error };
    }
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
      
      // Clear all cookies
      Cookies.remove('userAuthenticated');
      Cookies.remove('userId');
      Cookies.remove('userEmail');
      Cookies.remove('userRole');
      Cookies.remove('organizationId');
      
      return { success: true };
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      return { error };
    }
  };

  return { loginWithGoogle, handleAuthCallback, logout };
};