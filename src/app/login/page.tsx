'use client'

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

const LoginPage = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState<any>(null)
  const [verifyInfo, setVerifyInfo] = useState<string | null>(null);
  const [error, setError] = useState<any | null>(null)
  const [loading, setLoading] = useState(true);

  const router = useRouter()

  const supabase = createClientComponentClient();

  const handleSignUp = async () => {
    const res = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${location.origin}/auth/callback`
      }
    })
    setUser(res.data.user)
    router.refresh();
    setEmail('')
    setPassword('')
    setVerifyInfo("You've succesfully signed up! Check your e-mail in order to proceed.")
  }

  const handleSignIn = async () => {
    try {
      const res = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      setUser(res.data.user)
      router.refresh();
      setEmail('')
      setPassword('')
    } catch (error) {
      setError(error)
      console.log(error)
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.refresh()
    setUser(null)
  }

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
      setLoading(false)
    }

    getUser()
  }, [supabase.auth])

  if (loading) {
    return (
      <main className="h-screen flex items-center justify-center bg-gray-800 p-6 text-white">
        <div className="bg-gray-900 p-8 rounded-lg shadow-md w-96 flex flex-col items-center justify-center gap-5">
          <h1 className="text-3xl">Loading...</h1>
        </div>
      </main>
    )
  }

  if (user) {
    return (
      <main className="h-screen flex items-center justify-center bg-gray-800 p-6 text-white">
        <div className="bg-gray-900 p-8 rounded-lg shadow-md w-96 flex flex-col items-center justify-center gap-5">
          <h1 className="text-center text-2xl">Hello again <br /><span className="text-blue-600">{user.email}</span></h1>
          {verifyInfo &&
            <p className="text-center text-red-600">Check your email in order to authorize your Taskingo account!</p>
          }
          <button onClick={handleLogout} className="w-full p-3 rounded-md bg-gray-700 text-white hover:bg-gray-600 focus:outline-none">Logout</button>
          <button onClick={() => console.log(user)} className="w-full p-3 rounded-md bg-gray-700 text-white hover:bg-gray-600 focus:outline-none">Console log user</button>
          <Link href="/" className="w-full p-3 rounded-md bg-blue-600 text-white hover:bg-blue-700 focus:outline-none text-center">To home page</Link>
        </div>
      </main>
    )
  }

  return (
    <main className="h-screen flex items-center justify-center bg-gray-800 p-6 text-white">
      <div className="bg-gray-900 p-8 rounded-lg shadow-md w-96 flex flex-col items-center justify-center gap-5">
        <h1 className="text-3xl">Login</h1>
        {error &&
          <p className="text-center text-red-500">Error: {error.message}</p>
        }
        <input type="email" name="email" value={email} placeholder="email" onChange={(e) => setEmail(e.target.value)} className="w-full p-3 rounded-md border border-gray-700 bg-gray-800 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500" />
        <input type="password" name="password" value={password} placeholder="password" onChange={(e) => setPassword(e.target.value)} className="w-full p-3 rounded-md border border-gray-700 bg-gray-800 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500" />
        <button onClick={handleSignIn} className="w-full p-3 rounded-md bg-blue-600 text-white hover:bg-blue-700 focus:outline-none">Sign In</button>
        <button onClick={handleSignUp} className="w-full p-3 rounded-md bg-gray-700 text-white hover:bg-gray-600 focus:outline-none">Sign up</button>
      </div>
    </main>
  )
}

export default LoginPage