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
        <span className="text-2xl max-w-[600px]">If you wish, you can experience taskingo without having to register. Although you will be able to create and manage your boards, these will not save in the database, having to rely only on your local storage options. If you wish to create saves of your boards without having to worry about them getting lost, I recommend logging in and managing the boards whilst being logged.</span>
        <Link href="/login" className="w-[320px] p-3 rounded-md bg-blue-600 text-white hover:bg-blue-700 focus:outline-none text-center">To login page</Link>
      </main>
    );
  }

  return (
    <main className="poppins w-screen flex flex-col flex-grow gap-10 items-center justify-center p-10 text-white text-center">
      <h1 className="text-3xl">Hello <span className="text-blue-600">{user.user_metadata.username}</span>!</h1>
      <span className="text-2xl max-w-[600px]">Thanks for using Taskingo! Create boards, add lists and manage tasks to improve your daily task management! Play with boards by pressing the button below.</span>
      <Link href="/boards" className="w-[320px] p-3 rounded-md bg-blue-600 text-white hover:bg-blue-700 focus:outline-none text-center">To boards</Link>
    </main>
  )

}
