'use client'

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import Swal from 'sweetalert2'

const SignupPage = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [passwordRepeat, setPasswordRepeat] = useState('')
  const [username, setUsername] = useState('')
  const [errors, setErrors] = useState<string[]>([])

  const router = useRouter()
  const supabase = createClientComponentClient()

  const handleSignUp = async () => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
    let isValidEmail = false
    let isValidPassword = false
    let isValidUsername = false


    const checkErrors = () => {
      setErrors([])
      const addError = (error: string) => {
        setErrors(prev => [...prev, error])
      }

      if (!emailRegex.test(email)) {
        addError("The email address format is incorrect. Please try again. e.g. example@gmail.com")
      } else {
        isValidEmail = true
      }

      if (password !== passwordRepeat) {
        addError("Passwords must be equal")
      } else if (password.length < 6) {
        addError("Password must be at least 6 characters long")
      } else {
        isValidPassword = true
      }

      if (username.length < 3) {
        addError("Username must be at least 3 characters long")
      } else {
        isValidUsername = true
      }
    }

    checkErrors();

    if (isValidEmail && isValidPassword && isValidUsername) {
      try {
        await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${location.origin}/login`,
            data: {
              username: username,
            }
          }
        })
        setEmail('')
        setPassword('')
        Swal.fire({
          title: "Congratulations!",
          text: "You've succesfully created an account. Please check your e-mail in order to authorize your account otherwise you won't be able to login properly.",
          icon: "success",
          color: "#fff",
          background: "#111827",
          confirmButtonText: "Back to login page"
        }).then((result) => {
          if (result.isConfirmed || result.dismiss) {
            router.push('/login')
          }
        })
      } catch (error) {
        // setMessage(error)
      }
    }
  }

  return (
    <main className="h-screen flex items-center justify-center bg-gray-800 p-6 text-white">
      <div className="bg-gray-900 p-8 rounded-lg shadow-md w-96 flex flex-col items-center justify-center gap-5">
        <h1 className="text-3xl">Sign Up</h1>
        {errors.length > 0 &&
          <ul className="text-red-600 text-sm">
            {errors.map((error) => (
              <li key={error}>{error}</li>
            ))}
          </ul>
        }
        <input type="email" name="email" value={email} placeholder="email" onChange={(e) => setEmail(e.target.value)} className="w-full p-3 rounded-md border border-gray-700 bg-gray-800 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500" />
        <input type="password" name="password" value={password} placeholder="password" onChange={(e) => setPassword(e.target.value)} className="w-full p-3 rounded-md border border-gray-700 bg-gray-800 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500" />
        <input type="password" name="password" value={passwordRepeat} placeholder="confirm password" onChange={(e) => setPasswordRepeat(e.target.value)} className="w-full p-3 rounded-md border border-gray-700 bg-gray-800 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500" />
        <input type="username" name="username" value={username} placeholder="set your username" onChange={(e) => setUsername(e.target.value)} className="w-full p-3 rounded-md border border-gray-700 bg-gray-800 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500" />
        <button onClick={handleSignUp} className="w-full p-3 rounded-md bg-blue-600 text-white hover:bg-blue-700 focus:outline-none">Sign Up</button>
        <Link href="/login" className="w-full p-3 rounded-md bg-gray-700 text-white hover:bg-gray-600 focus:outline-none text-center">Back to login screen</Link>
      </div>
    </main>
  )
}

export default SignupPage
