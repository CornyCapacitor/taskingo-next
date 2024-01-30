'use client'

import Link from "next/link"

type BoardProps = {
  // Some problem with id type
  id: any,
  name: string,
  theme: string,
}

export const Board = ({ id, name, theme }: BoardProps) => {

  return (
    <Link href="/[id]" as={`/boards/${id}`} id={id} className={`flex flex-col items-center justify-center rounded-lg w-[350px] h-[175px] cursor-pointer standard_transition ${theme}`}>
      <h1 className="text-1xl">{name}</h1>
    </Link>
  )
}