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
  const [boards, setBoards] = useState<null | Board[]>(null)
  const [user] = useAtom(authAtom)
  const [refetch, setRefetch] = useState<boolean>(true)

  const handleCreateNewBoard = (e: any) => {
    e.preventDefault()
    // const shortid = require('shortid')
    // const uniqueId = shortid.generate()
    // let updateValue: Board[] | Board

    // if (boards) {
    //   const val = [...boards, { id: uniqueId, name: "New Board", theme: "standard_board" }]
    //   updateValue = val
    // } else {
    //   const val = { id: uniqueId, name: "New Board", theme: "standard_board" }
    //   updateValue = val
    // }

    // const updateData = async () => {
    //   const { data, error } = await supabase
    //     .from('users_boards')
    //     .update(updateValue)
    //     .eq('user_id', user.id)
    //     .select()
    // }

    // updateData();
    // setRefetch(true)

    console.log(user.id)
  }

  useEffect(() => {
    if (user) {
      const fetchData = async () => {
        const { data, error } = await supabase
          .from('users_boards')
          .select()
          .eq('user_id', user.id)

        if (error) {
          return
        }

        if (data) {
          setBoards(data[0].boards)
          setRefetch(false)
        }
      }

      fetchData()
    }
  }, [user])

  return (
    <main className="poppins w-screen flex flex-wrap gap-2 items-start justify-center p-5 text-center">
      {boards && boards.map((board) => (
        <Board key={board.id} id={board.id} name={board.name} theme={board.theme} />
      ))}
      <div className="flex flex-col items-center justify-center rounded-lg w-[350px] h-[175px] cursor-pointer standard_transition standard_board" onClick={(e) => handleCreateNewBoard(e)}>
        <h1 className="text-1xl">Create new board</h1>
      </div>
    </main>
  )
}

export default BoardsPage
