'use client'

import { Board } from "@/components/Board"
import { useState } from "react"

const BoardsPage = () => {
  const [boards, setBoards] = useState([
    {
      id: 1,
      name: "Example board",
      theme: "standard_board",
    },
    {
      id: 2,
      name: "Example board",
      theme: "standard_board",
    },
    {
      id: 3,
      name: "Example board",
      theme: "standard_board",
    },
    {
      id: 4,
      name: "Example board",
      theme: "standard_board",
    },
    {
      id: 5,
      name: "Example board",
      theme: "standard_board",
    },
    {
      id: 6,
      name: "Example board",
      theme: "standard_board",
    },
    {
      id: 7,
      name: "Example board",
      theme: "standard_board",
    },
  ])

  return (
    <main className="poppins w-screen flex flex-wrap gap-2 items-start justify-center p-5 text-center">
      {boards.map((board) => (
        <Board key={board.id} id={board.id} name={board.name} theme={board.theme} />
      ))}
    </main>
  )
}

export default BoardsPage
