'use client'

import supabase from '@/app/config/supabaseClient'
import { authAtom } from '@/state/atoms'
import { useAtom } from 'jotai'
import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'

type Board = {
  id: string,
  name: string,
  theme: string,
}

const BoardPage = () => {
  const params = useParams()
  const [user] = useAtom(authAtom)
  const [board, setBoard] = useState<Board>()

  const [loading] = useState(true)

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

        const foundBoard = boards.find((board: { id: string }) => board.id === boardId)
        if (foundBoard) {
          setBoard(foundBoard)
        }
      }
    }

    fetchData()
  }, [user, params.id])

  return (
    <div className="poppins w-screen flex flex-col flex-wrap gap-2 items-start justify-center p-5 text-center text-white">
      <h1>Board Page</h1>
      {/* Temporary information for coding purpose */}
      <p>Board name: {board?.name}</p>
      <p>User id: {user?.id}</p>
      <p>Board id: {board?.id}</p>
    </div>
  )
}

export default BoardPage
