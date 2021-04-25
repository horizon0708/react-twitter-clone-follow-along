import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://prfdplzygvxkggwfbzfj.supabase.co'
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlhdCI6MTYxNzI0NzM1OSwiZXhwIjoxOTMyODIzMzU5fQ._-NE7JaJ_iTjeg8Q3eT58Itz-fkmSPfWHKBxItDokM0" 

export const supabaseClient = createClient(supabaseUrl, supabaseKey)