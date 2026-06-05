import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL  = 'https://szgpqouxkxwwyfrbrlab.supabase.co'
const SUPABASE_KEY  = 'sb_publishable_yU_8p8IYprUU15Iw-M2QcQ_LPN64G1w'

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)
