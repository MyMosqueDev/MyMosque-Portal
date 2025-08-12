import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

export async function logout() {
  const supabase = await createClient()
  
  // Sign out the user
  const { error } = await supabase.auth.signOut()
  
  if (error) {
    console.error('Error during logout:', error)
    return { error: error.message }
  }
  
  // Clear local storage
  if (typeof window !== 'undefined') {
    localStorage.removeItem('authenticatedUser')
  }
  
  // Redirect to login page
  redirect('/login')
} 