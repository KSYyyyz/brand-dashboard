import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://szeitkdhonapdzvdtaot.supabase.co'
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_L9bCfa5SJigYfd8xe16Lpw_EZtldrg2'

export const supabase = createClient(supabaseUrl, supabaseKey)