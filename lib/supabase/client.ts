import { createBrowserClient } from "@supabase/ssr"

export function createClient() {
  // For v0 environment, we'll use the Supabase integration environment variables
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    // Provide more helpful error message for v0 users
    throw new Error(
      `Missing Supabase environment variables. 
      
Please add the Supabase integration to your v0 project:
1. Click "Add Integration" in the v0 interface
2. Select "Supabase" 
3. Enter your project URL: https://nedokweyutodtnzrothl.supabase.co
4. Enter your anon key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5lZG9rd2V5dXRvZHRuenJvdGhsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM0MzA0ODMsImV4cCI6MjA2OTAwNjQ4M30.Rc8-3LDoW2RTLjVMOwhOZiYxCsSjtLDitNAZa3HihTc

Or manually add these environment variables:
NEXT_PUBLIC_SUPABASE_URL=https://nedokweyutodtnzrothl.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5lZG9rd2V5dXRvZHRuenJvdGhsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM0MzA0ODMsImV4cCI6MjA2OTAwNjQ4M30.Rc8-3LDoW2RTLjVMOwhOZiYxCsSjtLDitNAZa3HihTc`,
    )
  }

  return createBrowserClient(supabaseUrl, supabaseAnonKey)
}
