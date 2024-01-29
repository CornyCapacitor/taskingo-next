'use client'

import { authAtom } from "@/state/atoms"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { useAtom } from "jotai"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useRef, useState } from "react"

export const Navbar = () => {
  const [toggleDropdown, setToggleDropdown] = useState(false)
  const dropdownRef = useRef<HTMLDivElement | null>(null)
  const [user] = useAtom(authAtom)

  const router = useRouter()
  const supabase = createClientComponentClient();

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.refresh()
  }

  useEffect(() => {
    const handleClickOutside = (event: any) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setToggleDropdown(false);
      }
    };

    document.addEventListener('click', handleClickOutside);

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  return (
    <nav className="h-[100px] bg-gray-900 text-white flex items-center justify-between items py-8 px-2">
      <section className="flex w-[80px] text-center justify-center"></section>
      <Link href={"/"} className="text-5xl">Taskingo</Link>
      <section className="flex w-[80px] justify-center">
        <div ref={dropdownRef} className="relative inline-block">
          <Image src="hamburger.svg" alt="Dropdown menu" width={50} height={50} className={`hover:cursor-pointer border rounded-md p-2 ${toggleDropdown ? 'border-blue-500' : 'border-transparent'}`} onClick={() => setToggleDropdown(prev => !prev)} />
          {toggleDropdown &&
            <ul className="absolute flex flex-col gap-3 rounded-md bg-gray-700 z-1 min-w-[250px] p-3 mt-2 right-0 text-center dropdown_reveal overflow-hidden">
              <Link className="w-full p-3 rounded-md bg-gray-800 text-white hover:bg-gray-600 focus:outline-none text-center" href={"/"}>Home</Link>
              <Link className="w-full p-3 rounded-md bg-gray-800 text-white hover:bg-gray-600 focus:outline-none text-center" href={"/boards"}>Boards</Link>
              <Link className="w-full p-3 rounded-md bg-gray-800 text-white hover:bg-gray-600 focus:outline-none text-center" href={"/about"}>About</Link>
              <Link className="w-full p-3 rounded-md bg-gray-800 text-white hover:bg-gray-600 focus:outline-none text-center" href={"/help"}>Help</Link>
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
