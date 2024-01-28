import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import Link from "next/link";

export default async function Home() {
  const cookieStore = cookies()
  const supabase = createServerComponentClient({ cookies: () => cookieStore })
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return (
      <main className="poppins w-screen flex flex-col gap-3 items-center justify-center">
        <span className="text-white">Welcome to Taskingo!</span>
        <span className="text-white">In order to access the page, you must be logged in.</span>
        <Link href="/login" className="w-[320px] p-3 rounded-md bg-blue-600 text-white hover:bg-blue-700 focus:outline-none text-center">To login page</Link>
      </main>
    );
  }

  return (
    <main className="poppins w-screen flex flex-col gap-3 items-center justify-center">
      <span className="text-white">Hello <span className="text-blue-600">{user.user_metadata.username}</span>!</span>
    </main>
  )

}
