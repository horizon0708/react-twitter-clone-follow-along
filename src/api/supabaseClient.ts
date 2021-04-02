import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://prfdplzygvxkggwfbzfj.supabase.co'
const supabaseKey = process.env.REACT_APP_SUPABASE_KEY as string

export const supabaseClient = createClient(supabaseUrl, supabaseKey)