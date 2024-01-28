'use client'

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

export const Navbar = () => {
  const [toggleDropdown, setToggleDropdown] = useState(false)
  const [user, setUser] = useState<any | null>(null)

  const router = useRouter()
  const supabase = createClientComponentClient();

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.refresh()
  }

  useEffect(() => {
    // Data fetch
    const getUser = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        setUser(user)
      } catch (error) {
        console.error(error)
      }
    }

    getUser()

    const authListener = supabase.auth.onAuthStateChange((event, session) => {
      console.log(event, session)
      if (event === 'SIGNED_IN') {
        getUser()
      } else if (event === 'SIGNED_OUT') {
        setUser(null)
      }
    })

    return () => {
      authListener.data.subscription.unsubscribe()
    }
  }, [supabase.auth])

  return (
    <nav className="h-[100px] bg-gray-900 text-white flex items-center justify-between items py-8 px-2">
      <section className="flex w-[80px] text-center justify-center"></section>
      <h1 className="text-5xl">Taskingo</h1>
      <section className="flex w-[80px] justify-center">
        <div className="relative inline-block">
          <Image src="hamburger.svg" alt="Dropdown menu" width={50} height={50} className={`hover:cursor-pointer border rounded-md p-2 ${toggleDropdown ? 'border-blue-500' : 'border-transparent'}`} onClick={() => setToggleDropdown(prev => !prev)} />
          {toggleDropdown &&
            <ul className="absolute flex flex-col gap-3 rounded-md bg-gray-700 z-1 min-w-[250px] p-3 mt-2 right-0 text-center dropdown_animation">
              <li>Home</li>
              <li>Boards</li>
              <li>About</li>
              <li>Help</li>
              {user ?
                <button onClick={handleLogout} className="w-full p-3 rounded-md bg-blue-600 text-white hover:bg-blue-700 focus:outline-none">Log Out</button>
                :
                <Link href="/login" className="w-full p-3 rounded-md bg-blue-600 text-white hover:bg-blue-700 focus:outline-none">Sign In</Link>
              }
            </ul>
          }
        </div>
      </section>
    </nav>
  )
}

export default Navbar
