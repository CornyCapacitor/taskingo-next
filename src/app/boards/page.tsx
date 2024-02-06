'use client'

import { Board } from "@/components/Board"
import { authAtom } from "@/state/atoms"
import { useAtom } from "jotai"
import { useEffect, useState } from "react"

import Swal from "sweetalert2"
import supabase from "../config/supabaseClient"

const BoardsPage = () => {
  const [boards, setBoards] = useState<Board[]>()
  const [user] = useAtom(authAtom)

  const handleCreateNewBoard = () => {
    Swal.fire({
      color: "#fff",
      background: "#111827",
      title: 'Enter new board name',
      input: "text",
      inputPlaceholder: "New board",
      showConfirmButton: true,
      confirmButtonText: "Create",
      confirmButtonColor: "#2563eb",
      showCancelButton: true,
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        createNewBoard(result.value)
        return
      } else {
        return
      }
    })
  }

  const createNewBoard = (boardName: string) => {
    if (user && !Object.keys(user).length) return

    const shortid = require('shortid')
    const uniqueId = shortid.generate()
    let updateValue: Board[] | Board

    if (boards) {
      // If at least 1 board
      const val = [...boards, { id: uniqueId, name: `${boardName ? boardName : "New board"}`, theme: "standard_board", lists: [] }]
      updateValue = val
    } else {
      // If no boards
      const val = [{ id: uniqueId, name: `${boardName ? boardName : "New board"}`, theme: "standard_board", lists: [] }]
      updateValue = val
    }

    const updateData = async () => {
      // Updating data to database
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
    if (!user) {
      return
    }

    const createUserDatabase = async () => {
      await supabase
        .from('users_boards')
        .insert({ user_id: user?.id, boards: [] })
    }

    const fetchData = async () => {
      // Fetching the data from database
      const { data } = await supabase
        .from('users_boards')
        .select()
        .eq('user_id', user?.id)

      if (data?.length) {
        // If boards
        setBoards(data[0].boards)
      } else if (!data?.length) {
        // If no boards
        createUserDatabase()
      }
    }

    fetchData()
  }, [user])

  if (!user || !boards) {
    return (
      <div className="poppins w-screen h-full flex flex-wrap gap-2 items-center justify-center p-5 text-center">
        <h1 className="text-3xl text-white">Loading boards...</h1>
      </div>
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
