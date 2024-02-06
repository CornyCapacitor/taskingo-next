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

    const shortid = require('shortid')
    const uniqueId = shortid.generate()

    const boardIndex = boards?.findIndex(board => board.id === params.id)

    if (boardIndex === -1) {
      console.error("Board not found with id:", params.id)
      return
    }

    const newList: List = {
      id: uniqueId,
      name: `${listName ? listName : "New list"}`,
      tasks: []
    }

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

  const handleCreateNewTask = (boardId: string, listId: string) => {
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

    const shortid = require('shortid')
    const uniqueId = shortid.generate()

    const boardIndex = boards?.findIndex(board => board.id === boardId)

    const listIndex = boards[boardIndex].lists.findIndex(list => list.id === listId)

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

  const handleEditTask = (boardId: string, listId: string, taskId: string, taskName: string, taskDescription: string | undefined, taskStatus: string) => {
    Swal.fire({
      color: "#fff",
      background: "#111827",
      title: `Editing "${taskName}"`,
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
      didOpen: () => {
        const taskInput = document.getElementById('taskName') as HTMLInputElement
        taskInput.value = taskName
        if (taskDescription) {
          const descriptionInput = document.getElementById('taskDescription') as HTMLInputElement
          descriptionInput.value = taskDescription
        }
        if (taskStatus) {
          const taskSelect = document.getElementById('taskSelect') as HTMLSelectElement
          taskSelect.value = taskStatus
        }
      },
      showConfirmButton: true,
      confirmButtonText: "Save",
      confirmButtonColor: "#2563eb",
      showCancelButton: true,
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        const taskInput = document.getElementById('taskName') as HTMLInputElement
        const newTaskName = taskInput.value
        const descriptionInput = document.getElementById('taskDescription') as HTMLInputElement
        const newDescription = descriptionInput.value
        const taskSelect = document.getElementById('taskSelect') as HTMLSelectElement
        const newStatus = taskSelect.value

        if (result.value === taskName || !result.value) {
          editTask(boardId, listId, taskId, newTaskName, newDescription, newStatus)
          return
        } else {
          editTask(boardId, listId, taskId, newTaskName, newDescription, newStatus)
        }
      } else {
        return
      }
    })
  }

  const editTask = (boardId: string, listId: string, taskId: string, taskName: string, taskDescription: string | undefined, taskStatus: string) => {
    const boardIndex = boards?.findIndex(board => board.id === boardId)

    const listIndex = boards[boardIndex].lists.findIndex(list => list.id === listId)

    const taskIndex = boards[boardIndex].lists[listIndex].tasks.findIndex(task => task.id === taskId)

    const updatedTask = {
      id: taskId,
      name: taskName,
      description: taskDescription,
      status: taskStatus,
    }

    const updatedBoards = boards
    updatedBoards[boardIndex].lists[listIndex].tasks[taskIndex] = {
      ...updatedBoards[boardIndex].lists[listIndex].tasks[taskIndex] = updatedTask
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

  const handleEditList = (boardId: string, listId: string, listName: string) => {
    Swal.fire({
      color: "#fff",
      background: "#111827",
      title: `Editing "${listName}"`,
      input: 'text',
      inputValue: listName,
      inputPlaceholder: 'New list',
      showConfirmButton: true,
      confirmButtonText: "Save",
      confirmButtonColor: "#2563eb",
      showCancelButton: true,
      cancelButtonText: "Cancel",
      showDenyButton: true,
      denyButtonText: "Delete list",
    }).then((result) => {
      if (result.isConfirmed) {
        if (result.value !== listName) {
          const newListName = result.value
          editList(boardId, listId, newListName)
        } else {
          return
        }
      } else if (result.isDenied) {
        handleDeleteList(boardId, listId, listName)
      } else {
        return
      }
    })
  }

  const editList = (boardId: string, listId: string, newListName: string) => {
    const boardIndex = boards?.findIndex(board => board.id === boardId)

    const listIndex = boards[boardIndex].lists.findIndex(list => list.id === listId)

    console.log("Board", boards[boardIndex])
    console.log("List index", listIndex)

    const updatedBoards = boards
    updatedBoards[boardIndex].lists[listIndex].name = newListName

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

  const handleDeleteList = (boardId: string, listId: string, listName: string) => {
    Swal.fire({
      color: "#fff",
      background: "#111827",
      title: `Are you sure you want to delete "${listName}"? You can't revert this change.`,
      showConfirmButton: true,
      confirmButtonText: "Yes",
      confirmButtonColor: "#2563eb",
      showCancelButton: true,
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        deleteList(boardId, listId)
      }
    })
  }

  const deleteList = (boardId: string, listId: string) => {
    const boardIndex = boards?.findIndex(board => board.id === boardId)

    const listIndex = boards[boardIndex].lists.findIndex(list => list.id === listId)

    const updatedBoards = boards
    // updatedBoards[boardIndex].lists.filter(list => list.id !== listId)
    updatedBoards[boardIndex] = {
      ...updatedBoards[boardIndex],
      lists: updatedBoards[boardIndex].lists.filter(list => list.id !== listId)
    }

    console.log(updatedBoards)

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
    <div className="poppins w-screen flex flex-row flex-wrap gap-2 items-start justify-center text-center text-white">
      <h1 className="text-2xl flex text-center justify-center w-full bg-black py-1">{board?.name}</h1>
      {board && board.lists.map((list) => (
        <div className="flex flex-col items-center justify-center rounded-3xl w-[350px] py-2 px-3 bg-gray-900 text-white gap-1" key={list.id}>
          <h1 className="text-1xl py-1 hover:bg-gray-700 rounded-3xl standard_transition w-full cursor-pointer px-2" onClick={() => handleEditList(board.id, list.id, list.name)}>{list.name}</h1>
          {list.tasks.map((task) => (
            <div className="flex flex-col rounded-2xl cursor-pointer hover:bg-gray-700 standard_transition bg-gray-800 w-[100%] py-0 text-start" key={task.id} onClick={() => handleEditTask(board.id, list.id, task.id, task.name, task.description, task.status)}>
              <div className="flex justify-between items-center">
                <h1 className="ps-4 py-1 text-1xl w-[calc(100%-40px)] break-words">{task.name}</h1>
                <span className="w-[24px] h-[24px] mr-1 flex items-center justify-center" dangerouslySetInnerHTML={{ __html: task.status === "unfinished" ? "&#x1F534;" : task.status === "inProgress" ? "&#x1F7E1;" : task.status === "finished" ? "&#x1F7E2;" : "&xcirc;" }}></span>
              </div>
              {task.description && (
                <span className="text-1xl bg-gray-500 ps-4 py-1 rounded-t-none rounded-bl-2xl rounded-br-2xl">{task.description}</span>
              )}
            </div>
          ))}
          <div className="rounded-full cursor-pointer hover:bg-gray-700 standard_transition bg-gray-800 w-[100%] py-1 text-blue-500" onClick={() => handleCreateNewTask(board.id, list.id)}>+ Create new task</div>
        </div>
      ))}
      <div className="flex flex-col items-center justify-center rounded-full w-[350px] py-2 cursor-pointer standard_transition standard_board" onClick={() => handleCreateNewList()}>
        <h1 className="text-1xl text-blue-500">+ Create new list</h1>
      </div>
    </div>
  )
}

export default BoardPage
