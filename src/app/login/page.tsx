'use client'

import { useState } from "react"

const LoginPage = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(true)

  const handleSignUp = () => {
    return
  }

  const handleSignIn = () => {
    return
  }

  const handleLogout = () => {
    return
  }

  if (!user) {
    return (
      <main className="h-screen flex items-center justify-center bg-gray-800 p-6 text-white">
        <div className="bg-gray-900 p-8 rounded-lg shadow-md w-96 flex flex-col items-center justify-center gap-5">
          <h1 className="text-3xl">You are already logged in</h1>
          <button onClick={handleLogout} className="w-full p-3 rounded-md bg-gray-700 text-white hover:bg-gray-600 focus:outline-none">Logout</button>
        </div>
      </main>
    )
  }

  return (
    <main className="h-screen flex items-center justify-center bg-gray-800 p-6 text-white">
      <div className="bg-gray-900 p-8 rounded-lg shadow-md w-96 flex flex-col items-center justify-center gap-5">
        <h1 className="text-3xl">Login</h1>
        <input type="email" name="email" value={email} placeholder="email" onChange={(e) => setEmail(e.target.value)} className="w-full p-3 rounded-md border border-gray-700 bg-gray-800 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500" />
        <input type="password" name="password" value={password} placeholder="password" onChange={(e) => setPassword(e.target.value)} className="w-full p-3 rounded-md border border-gray-700 bg-gray-800 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500" />
        <button onClick={handleSignUp} className="w-full p-3 rounded-md bg-blue-600 text-white hover:bg-blue-700 focus:outline-none">Sign Up</button>
        <button onClick={handleSignIn} className="w-full p-3 rounded-md bg-gray-700 text-white hover:bg-gray-600 focus:outline-none">Sign In</button>
      </div>
    </main>
  )
}

export default LoginPage