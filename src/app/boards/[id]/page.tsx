'use client'

import supabase from '@/app/config/supabaseClient'
import { authAtom } from '@/state/atoms'
import { useAtom } from 'jotai'
import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import Swal from 'sweetalert2'

const BoardPage = () => {
  const params = useParams()
  const [user] = useAtom(authAtom)
  const [boards, setBoards] = useState<Board[]>([])
  const [board, setBoard] = useState<Board>()

  useEffect(() => {
    if (user && !Object.keys(user).length) return

    const boardId = params.id

    const fetchData = async () => {
      const { data } = await supabase
        .from('users_boards')
        .select()
        .eq('user_id', user?.id)

      if (data?.length) {
        const boards = data[0].boards
        setBoards(boards)
      }
    }

    fetchData()
  }, [user, params.id])

  useEffect(() => {
    const foundBoard = boards.find((board: { id: string }) => board.id === params.id)
    if (foundBoard) {
      setBoard(foundBoard)
    }
  }, [boards, params.id])

  const handleCreateNewList = () => {
    Swal.fire({
      color: "#fff",
      background: "#111827",
      title: 'Enter new list name',
      input: "text",
      inputPlaceholder: "New list",
      showConfirmButton: true,
      confirmButtonText: "Create",
      confirmButtonColor: "#2563eb",
      showCancelButton: true,
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        createNewList(result.value)
        return
      } else {
        return
      }
    })
  }

  const createNewList = (listName: string) => {
    if (user && !Object.keys(user).length) return

    // Generating new board id
    const shortid = require('shortid')
    const uniqueId = shortid.generate()
    let updateValue: Board

    // Finding board index
    const boardIndex = boards?.findIndex(board => board.id === params.id)

    // If not found, throw an error and return previous state
    if (boardIndex === -1) {
      console.error("Board not found with id:", params.id)
      return
    }

    // New list parameters
    const newList: List = {
      id: uniqueId,
      name: `${listName ? listName : "New list"}`,
      tasks: []
    }

    // New, updated boards array
    const updatedBoards = boards
    updatedBoards[boardIndex] = {
      ...updatedBoards[boardIndex], lists: [...updatedBoards[boardIndex].lists, newList]
    }

    const updateData = async () => {
      const { data } = await supabase
        .from('users_boards')
        .update({ 'boards': updatedBoards })
        .eq('user_id', user?.id)
        .select()

      if (data) {
        setBoards(data[0].boards)
      }
    }

    updateData()
  }

  return (
    <div className="poppins w-screen flex flex-row flex-wrap gap-2 items-start justify-center p-5 text-center text-white">
      {board && board.lists.map((list) => (
        <div className="flex flex-col items-center justify-center rounded-full w-[350px] py-2 cursor-pointer standard_transition standard_board" key={list.id}>
          <h1 className="text-1xl">{list.name}</h1>
          {list.tasks.map((task) => (
            <div key={task.id}>
              <h1 className="text-1xl">{task.name}</h1>
              <span className="text-1xl">{task.description}</span>
              <span className="text-1xl">{task.status}</span>
            </div>
          ))}
        </div>
      ))}
      <div className="flex flex-col items-center justify-center rounded-full w-[350px] py-2 cursor-pointer standard_transition standard_board" onClick={() => handleCreateNewList()}>
        <h1 className="text-1xl">+ Create new list</h1>
      </div>
    </div>
  )
}

export default BoardPage
