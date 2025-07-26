import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://mhxvdiykojlbfgrvgtsv.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1oeHZkaXlrb2psYmZncnZndHN2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMzMjkyNjEsImV4cCI6MjA2ODkwNTI2MX0.8dnSowLvTczhZN7mw4ss2cA4ACrbqC7015T4l6BlVRk'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)