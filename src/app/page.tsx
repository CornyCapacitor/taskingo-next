'use client'

import { authAtom } from "@/state/atoms";
import { useAtom } from "jotai";
import Link from "next/link";

export default function Home() {
  const [user] = useAtom(authAtom)

  if (!user) {
    return (
      <main className="poppins w-screen flex flex-col flex-grow gap-10 items-center justify-center p-10 text-white text-center">
        <h1 className="text-3xl">Welcome to Taskingo!</h1>
        <span className="text-2xl max-w-[600px]">In order to fully experience what Taskingo offers, you need to be logged in. Remember to use real e-mail adress due to authentication e-mail which is required to grant access to your fresh created account. If you lost or forgot your password, send me an e-mail so I can send you a password recovery service e-mail: <span className="text-blue-500">mateusz.minder99@gmail.com</span></span>
        <Link href="/login" className="w-[320px] p-3 rounded-md bg-blue-600 text-white hover:bg-blue-700 focus:outline-none text-center mb-5">To login page</Link>
      </main>
    );
  }

  return (
    <main className="poppins w-screen flex flex-col flex-grow gap-10 items-center justify-center p-10 text-white text-center">
      <h1 className="text-3xl">Hello <span className="text-blue-600">{user.user_metadata.username}</span>!</h1>
      <span className="text-2xl max-w-[600px]">Thanks for using Taskingo! Create boards, add lists and manage tasks to improve your daily task management! Play with boards by pressing the button below.</span>
      <Link href="/boards" className="w-[320px] p-3 rounded-md bg-blue-600 text-white hover:bg-blue-700 focus:outline-none text-center mb-5">To boards</Link>
    </main>
  )

}
