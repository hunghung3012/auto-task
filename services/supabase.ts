import { createClient } from '@supabase/supabase-js';
import { SUPABASE_URL, SUPABASE_KEY } from '../constants';

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

/**
 * Helper to ensure the members table exists or guide the user.
 * In a real app, this is done via SQL migrations.
 */
export const checkDatabaseConnection = async () => {
  const { data, error } = await supabase.from('members').select('count', { count: 'exact', head: true });
  if (error) {
    console.error("Database connection error:", error);
    return false;
  }
  return true;
};
