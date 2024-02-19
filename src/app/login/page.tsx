'use client'

import { authAtom } from "@/state/atoms"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { useAtom } from "jotai"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import Swal from "sweetalert2"

const LoginPage = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [user] = useAtom(authAtom)
  const [error, setError] = useState<any | null>(null)
  const [loading, setLoading] = useState(true);

  const router = useRouter()
  const supabase = createClientComponentClient();

  const LoginToast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 2500,
    timerProgressBar: true,
    color: "#fff",
    background: "#111827",
    didOpen: (toast) => {
      toast.onmouseenter = Swal.stopTimer;
      toast.onmouseleave = Swal.resumeTimer;
      toast.onclick = () => Swal.close();
    }
  })

  const handleSignIn = async () => {
    try {
      const res = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (res.error) {
        LoginToast.fire({
          icon: "error",
          title: `${res.error.message}`,
        })
      } else {
        LoginToast.fire({
          icon: "success",
          title: "Signed in succesfully"
        })
      }
    } catch (error) {
      setError(error)
      console.error(error)
    }
    setEmail('')
    setPassword('')
  }

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    event.preventDefault
    if (event.key === "Enter") {
      handleSignIn();
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.refresh()
    LoginToast.fire({
      icon: "success",
      title: "Logged out succesfully"
    })
  }

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
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
      <main className="flex items-center justify-center bg-gray-800 p-6 text-white">
        <div className="bg-gray-900 p-8 rounded-lg shadow-md w-96 flex flex-col items-center justify-center gap-5">
          <h1 className="text-center text-2xl">Hello again <br /><span className="text-blue-600">{user?.user_metadata?.username}</span></h1>
          <button onClick={handleLogout} className="w-full p-3 rounded-md bg-gray-700 text-white hover:bg-gray-600 focus:outline-none">Logout</button>
          <Link href="/" className="w-full p-3 rounded-md bg-blue-600 text-white hover:bg-blue-700 focus:outline-none text-center">To home page</Link>
        </div>
      </main>
    )
  }

  return (
    <main className="flex items-center justify-center bg-gray-800 p-6 text-white">
      <div className="bg-gray-900 p-8 rounded-lg shadow-md w-96 flex flex-col items-center justify-center gap-5">
        <h1 className="text-3xl">Login</h1>
        {error &&
          <p className="text-center text-red-500">Error: {error.message}</p>
        }
        <input type="email" name="email" value={email} placeholder="email" onChange={(e) => setEmail(e.target.value)} className="w-full p-3 rounded-md border border-gray-700 bg-gray-800 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500" />
        <input type="password" name="password" value={password} placeholder="password" onChange={(e) => setPassword(e.target.value)} onKeyDown={(e) => handleKeyDown(e)} className="w-full p-3 rounded-md border border-gray-700 bg-gray-800 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500" />
        <button onClick={handleSignIn} className="w-full p-3 rounded-md bg-blue-600 text-white hover:bg-blue-700 focus:outline-none">Login</button>
        <Link href="/signup" className="w-full p-3 rounded-md bg-gray-700 text-white hover:bg-gray-600 focus:outline-none text-center">Sign Up</Link>
      </div>
    </main>
  )
}

export default LoginPage