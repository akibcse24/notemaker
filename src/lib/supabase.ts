import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://uelswuipmaazissqfqzo.supabase.co';
const supabaseKey = 'sb_publishable_4lKypj4d4oVXiG5LYpjNLA_IWV5YTGC';

export const supabase = createClient(supabaseUrl, supabaseKey);
