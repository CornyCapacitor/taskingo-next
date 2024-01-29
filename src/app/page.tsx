import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import Link from "next/link";

export default async function Home() {
  // Reading the user directly* from the session
  const cookieStore = cookies()
  const supabase = createServerComponentClient({ cookies: () => cookieStore })
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return (
      <main className="poppins w-screen flex flex-col flex-grow gap-10 items-center justify-center p-10 text-white text-center">
        <h1 className="text-3xl">Welcome to Taskingo!</h1>
        <span className="text-2xl max-w-[600px]">If you wish, you can experience taskingo without having to register. Although you will be able to create and manage your boards, these won't save in the database, having to rely only on your local storage options. If you wish to create saves of your boards without having to worry about them getting lost, I recommend logging in and managing the boards whilst being logged.</span>
        <Link href="/login" className="w-[320px] p-3 rounded-md bg-blue-600 text-white hover:bg-blue-700 focus:outline-none text-center m-2">To login page</Link>
      </main>
    );
  }

  return (
    <main className="poppins w-screen flex flex-col flex-grow gap-3 items-center justify-center p-10 text-white">
      <h1 className="text-3xl">Hello <span className="text-blue-600">{user.user_metadata.username}</span>!</h1>
      <span className="text-2xl">Thanks for using Taskingo!</span>
    </main>
  )

}
