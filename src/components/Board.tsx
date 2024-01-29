'use client'

import { authAtom } from "@/state/atoms"
import { useAtom } from "jotai"
import Link from "next/link"

type BoardProps = {
  // Some problem with id type
  id: any,
  name: string,
  theme: string,
}

export const Board = ({ id, name, theme }: BoardProps) => {
  const [user] = useAtom(authAtom)

  return (
    <Link href="/[userId]/[id]" as={`/boards/${user?.id}/${id}`} id={id} className={`flex flex-col items-center justify-center rounded-lg w-[350px] h-[175px] cursor-pointer standard_transition ${theme}`}>
      <h1 className="text-1xl">{name}</h1>
    </Link>
  )
}