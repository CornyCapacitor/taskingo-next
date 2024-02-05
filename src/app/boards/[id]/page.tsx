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

  // const getInputClass = () => {
  //   Swal.fire({
  //     title: 'Dummy input',
  //     input: 'text',
  //     showCancelButton: false,
  //     confirmButtonText: 'Close',
  //   }).then(() => {
  //     const inputField = document.querySelector('.swal2-input')
  //     if (inputField) {
  //       const inputClass = inputField.getAttribute('class')
  //       const computedStyles = window.getComputedStyle(inputField)
  //       console.log('Full class of the input field', computedStyles)
  //     } else {
  //       console.error('Input field not found')
  //     }
  //   })
  // }

  // getInputClass();

  useEffect(() => {
    if (user && !Object.keys(user).length) return

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

    // Generating new list id
    const shortid = require('shortid')
    const uniqueId = shortid.generate()

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

  const handleCreateNewTask = ({ listId, boardId }: { listId: string, boardId: string }) => {
    Swal.fire({
      color: "#fff",
      background: "#111827",
      title: 'Create new task',
      html: `
        <input type="text" id="taskName" placeholder="New task name" class="swal2-input custom_swal_input"/>
        <input type="text" id="taskDescription" placeholder="Short description (optional)" class="swal2-input custom_swal_input"/>
        <select id="taskSelect" class="custom_swal_select">
          <option value="" class="custom_swal_option" disabled selected>Choose task label</option>
          <option value="" class="custom_swal_option">Undefined &xcirc;</option>
          <option value="unfinished" class="custom_swal_option">Unfinished &#x1F534;</option>
          <option value="inProgress" class="custom_swal_option">In progress &#x1F7E1;</option>
          <option value="finished" class="custom_swal_option">Finished &#x1F7E2;</option>
        </select>
      `,
      showConfirmButton: true,
      confirmButtonText: "Create",
      confirmButtonColor: "#2563eb",
      showCancelButton: true,
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        const taskInput = document.getElementById('taskName') as HTMLInputElement
        const descriptionInput = document.getElementById('taskDescription') as HTMLInputElement
        const taskSelect = document.getElementById('taskSelect') as HTMLInputElement

        if (taskInput && descriptionInput && taskSelect) {
          const taskName = taskInput.value
          const taskDescription = descriptionInput.value
          const taskStatus = taskSelect.value

          console.log(taskName, taskDescription, taskStatus)
          createNewTask(boardId, listId, taskName, taskDescription, taskStatus)
        } else {
          console.error("Can't get the values from alert inputs, returning")
          return
        }
        return
      } else {
        return
      }
    })
  }

  const createNewTask = (boardId: string, listId: string, taskName: string, taskDescription: string, taskStatus: string) => {
    if (user && !Object.keys(user).length) return

    console.log("List id: ", listId)
    console.log("Board id: ", boardId)

    // Generating new task id
    const shortid = require('shortid')
    const uniqueId = shortid.generate()

    // Finding board index
    const boardIndex = boards?.findIndex(board => board.id === params.id)

    console.log("Board index: ", boardIndex)

    // Finding list index
    const listIndex = boards[boardIndex].lists.findIndex(list => list.id === listId)

    console.log("List index: ", listIndex)

    console.log("Whole:", boards[boardIndex].lists[listIndex])

    // New task parameters
    const newTask: Task = {
      id: uniqueId,
      name: `${taskName ? taskName : "New task"}`,
      description: taskDescription,
      status: taskStatus,
    }

    const updatedBoards = boards
    updatedBoards[boardIndex].lists[listIndex] = {
      ...updatedBoards[boardIndex].lists[listIndex], tasks: [...updatedBoards[boardIndex].lists[listIndex].tasks, newTask]
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

  const handleEditTask = (taskName: string, taskDescription: string | undefined, taskStatus: string) => {
    Swal.fire({
      color: "#fff",
      background: "#111827",
      title: 'There will be task editing soon',
      showConfirmButton: true,
      confirmButtonText: "Create",
      confirmButtonColor: "#2563eb",
      showCancelButton: true,
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        let newTaskName: string

        if (result.value === taskName || !result.value) {
          newTaskName = taskName
          editTask(newTaskName, taskDescription, taskStatus)
          return
        } else {
          newTaskName = result.value
          editTask(newTaskName, taskDescription, taskStatus)
        }
      } else {
        return
      }
    })
  }

  const editTask = (taskName: string, taskDescription: string | undefined, taskStatus: string) => {
    return
  }

  return (
    <div className="poppins w-screen flex flex-row flex-wrap gap-2 items-start justify-center p-5 text-center text-white">
      {board && board.lists.map((list) => (
        <div className="flex flex-col items-center justify-center rounded-3xl w-[350px] py-2 px-3 bg-gray-900 text-white gap-1" key={list.id}>
          <h1 className="text-1xl py-1">{list.name}</h1>
          {list.tasks.map((task) => (
            <div className="flex flex-col rounded-2xl cursor-pointer hover:bg-gray-700 standard_transition bg-gray-800 w-[100%] py-0 text-start" key={task.id} onClick={() => handleEditTask(task.name, task.description, task.status)}>
              <div className="flex justify-between items-center">
                <h1 className="ps-4 py-1 text-1xl w-[calc(100%-40px)] break-words">{task.name}</h1>
                <span className="w-[24px] h-[24px] mr-1 flex items-center justify-center" dangerouslySetInnerHTML={{ __html: task.status === "unfinished" ? "&#x1F534;" : task.status === "inProgress" ? "&#x1F7E1;" : task.status === "finished" ? "&#x1F7E2;" : "&xcirc;" }}></span>
              </div>
              <span className="text-1xl bg-gray-500 ps-4 rounded-t-none rounded-bl-2xl rounded-br-2xl">{task.description}</span>
            </div>
          ))}
          <div className="rounded-full cursor-pointer hover:bg-gray-700 standard_transition bg-gray-800 w-[100%] py-1" onClick={() => handleCreateNewTask({ listId: list.id, boardId: board.id })}>+ Create new task</div>
        </div>
      ))}
      <div className="flex flex-col items-center justify-center rounded-full w-[350px] py-2 cursor-pointer standard_transition standard_board" onClick={() => handleCreateNewList()}>
        <h1 className="text-1xl">+ Create new list</h1>
      </div>
    </div>
  )
}

export default BoardPage
