'use client'

import { Board } from "@/components/Board"
import { authAtom } from "@/state/atoms"
import { useAtom } from "jotai"
import { useEffect, useState } from "react"

import supabase from "../config/supabaseClient"

type Board = {
  id: string,
  name: string,
  theme: string,
}

const BoardsPage = () => {
  const [boards, setBoards] = useState<Board[]>()
  const [user] = useAtom(authAtom)

  const handleCreateNewBoard = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault()
    if (user && !Object.keys(user).length) return

    const shortid = require('shortid')
    const uniqueId = shortid.generate()
    let updateValue: Board[] | Board

    if (boards) {
      const val = [...boards, { id: uniqueId, name: "New Board", theme: "standard_board" }]
      updateValue = val
    } else {
      const val = { id: uniqueId, name: "New Board", theme: "standard_board" }
      updateValue = val
    }

    const updateData = async () => {
      const { data } = await supabase
        .from('users_boards')
        .update({ 'boards': updateValue })
        .eq('user_id', user?.id)
        .select()

      if (data) {
        setBoards(data[0].boards)
      }
    }

    updateData();
  }

  useEffect(() => {
    if (user && !Object.keys(user).length) return

    const fetchData = async () => {
      const { data } = await supabase
        .from('users_boards')
        .select()
        .eq('user_id', user?.id)

      if (data?.length) {
        setBoards(data[0].boards)
      }
    }

    fetchData()
  }, [user])

  if (!user) {
    return (
      <main className="poppins w-screen flex flex-wrap gap-2 items-start justify-center p-5 text-center">
        <span className="text-1xl text-white">Free user content</span>
      </main>
    )
  }

  return (
    <main className="poppins w-screen flex flex-wrap gap-2 items-start justify-center p-5 text-center">
      {boards && boards.map((board) => (
        <Board key={board.id} {...board} />
      ))}
      <div className="flex flex-col items-center justify-center rounded-lg w-[350px] h-[175px] cursor-pointer standard_transition standard_board" onClick={handleCreateNewBoard}>
        <h1 className="text-1xl">Create new board</h1>
      </div>
    </main>
  )
}

export default BoardsPage
