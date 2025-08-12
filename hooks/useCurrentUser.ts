import { useEffect, useState } from 'react'
import { User } from '@/lib/types'
import { supabase } from '@/utils/supabase/client'

export interface CurrentUser extends User {
  mosqueName?: string
}

export const useCurrentUser = () => {
  const [user, setUser] = useState<CurrentUser | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const getUser = async () => {
      try {
        // Get current authenticated user
        const { data: { user: authUser }, error: authError } = await supabase.auth.getUser()
        console.log('authUser', user)
        if (authError || !authUser) {
          setUser(null)
          setLoading(false)
          return
        }

        console.log('authUser', authUser)

        // Get mosque information for this user
        const { data: mosque, error: mosqueError } = await supabase
          .from('mosques')
          .select('name')
          .eq('uid', authUser.id)
          .single()

        const currentUser: CurrentUser = {
          id: authUser.id,
          email: authUser.email || '',
          mosqueName: mosque?.name || 'Unknown Mosque'
        }

        setUser(currentUser)
      } catch (error) {
        console.error('Error fetching user:', error)
        setUser(null)
      } finally {
        setLoading(false)
      }
    }

    getUser()
  }, [])

  return { user, loading }
} 