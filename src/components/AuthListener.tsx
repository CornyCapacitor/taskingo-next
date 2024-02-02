'use client'

import { authAtom } from '@/state/atoms'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useAtom } from 'jotai'
import { useEffect } from 'react'


export const AuthListener = () => {
  const [user, setUser] = useAtom(authAtom)

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
      // Temporarily set off
      // console.log(event, session)

      if (event === 'SIGNED_OUT') {
        setUser(null)
        return
      }

      if (event === 'TOKEN_REFRESHED') {
        getUser()
        return
      }

      if (user) {
        return
      }

      getUser()
    })

    return () => {
      authListener.data.subscription.unsubscribe()
    }
  }, [supabase, setUser, user])

  return null
}

export default AuthListener
