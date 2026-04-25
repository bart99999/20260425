import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Supabase 환경변수가 설정되지 않았습니다.')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Inquiry = {
  id?: number
  created_at?: string
  customer_name: string
  inquiry: string
  category: string
  urgency: '높음' | '보통' | '낮음'
  summary: string
  department: string
  script: string
}
