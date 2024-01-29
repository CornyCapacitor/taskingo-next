'use client'

import { authAtom } from '@/state/atoms'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useAtom } from 'jotai'
import { useEffect } from 'react'

export const AuthListener = () => {
  const [, setUser] = useAtom(authAtom)

  const supabase = createClientComponentClient();

  useEffect(() => {
    const getUser = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        setUser(user)
      } catch (error) {
        console.error(error)
      }
    }

    const authListener = supabase.auth.onAuthStateChange((event, session) => {
      console.log(event, session)
      if (event === 'INITIAL_SESSION') {
        getUser()
      } else if (event === 'SIGNED_IN') {
        getUser()
      } else if (event === 'SIGNED_OUT') {
        setUser(null)
      } else if (event === 'TOKEN_REFRESHED') {
        getUser()
      } else if (event === 'USER_UPDATED') {
        getUser()
      }
    })

    return () => {
      authListener.data.subscription.unsubscribe()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return null
}

export default AuthListener
