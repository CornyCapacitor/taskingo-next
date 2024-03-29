'use client'

import supabase from '@/app/config/supabaseClient'
import { authAtom } from '@/state/atoms'
import { useAtom } from 'jotai'
import Image from 'next/image'
import { useParams, useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import Swal from 'sweetalert2'

const BoardPage = () => {
  const [user] = useAtom(authAtom)
  const [boards, setBoards] = useState<Board[]>([])
  const [board, setBoard] = useState<Board>()
  const [toggleDropdown, setToggleDropdown] = useState(false)

  const params = useParams()
  const dropdownRef = useRef<HTMLDivElement | null>(null)
  const router = useRouter()

  // Fetch boards/board data

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

  // Single board object set

  useEffect(() => {
    const foundBoard = boards.find((board: { id: string }) => board.id === params.id)
    if (foundBoard) {
      setBoard(foundBoard)
    }
  }, [boards, params.id])

  // Dropdown hide

  useEffect(() => {
    const handleClickOutside = (event: any) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setToggleDropdown(false);
      }
    };

    document.addEventListener('click', handleClickOutside);

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  // Reusable pieces of code

  const updateData = async (updatedBoards: Board[], successScenario: any, errorScenario: any) => {
    if (user && !Object.keys(user).length) return

    const { data, error } = await supabase
      .from('users_boards')
      .update({ 'boards': updatedBoards })
      .eq('user_id', user?.id)
      .select()

    if (data) {
      setBoards(data[0].boards)
      successScenario()
    }

    if (error) {
      errorScenario()
    }
  }

  const GeneralToast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 2500,
    timerProgressBar: true,
    color: "#fff",
    background: "#111827",
    didOpen: (toast) => {
      toast.onmouseenter = Swal.stopTimer;
      toast.onmouseleave = Swal.resumeTimer;
      toast.onclick = () => Swal.close();
    }
  })

  // Board functions

  const handleEditBoard = (boardId: string, boardName: string) => {
    if (user && !Object.keys(user).length) return

    Swal.fire({
      color: "#fff",
      background: "#111827",
      title: `Editing "${boardName}"`,
      input: 'text',
      inputValue: boardName,
      inputPlaceholder: 'New board',
      showConfirmButton: true,
      confirmButtonText: "Save",
      confirmButtonColor: "#2563eb",
      showCancelButton: true,
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        if (result.value !== boardName) {
          const newBoardName = result.value
          editBoard(boardId, newBoardName)
        } else {
          return
        }
      } else {
        return
      }
    })
  }

  const editBoard = (boardId: string, newBoardName: string) => {
    if (user && !Object.keys(user).length) return

    const boardIndex = boards?.findIndex(board => board.id === boardId)

    const updatedBoards = boards
    updatedBoards[boardIndex].name = newBoardName

    const successToast = () => GeneralToast.fire({
      icon: 'success',
      title: 'Board updated'
    })

    const errorToast = () => GeneralToast.fire({
      icon: 'error',
      title: 'Failed to update the board'
    })

    updateData(updatedBoards, successToast, errorToast)
  }

  const handleDeleteBoard = (boardId: string, boardName: string) => {
    if (user && !Object.keys(user).length) return

    Swal.fire({
      color: "#fff",
      background: "#111827",
      title: `Are you sure you want to delete "${boardName}"? You can't revert this change.`,
      showConfirmButton: true,
      confirmButtonText: "Yes",
      confirmButtonColor: "#2563eb",
      showCancelButton: true,
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        deleteBoard(boardId)
      } else {
        return
      }
    })
  }

  const deleteBoard = (boardId: string) => {
    if (user && !Object.keys(user).length) return

    const updatedBoards = boards.filter(board => board.id !== boardId)

    const successToast = () => GeneralToast.fire({
      icon: 'success',
      title: 'Board deleted'
    })

    const errorToast = () => GeneralToast.fire({
      icon: 'error',
      title: 'Failed to delete the board'
    })

    updateData(updatedBoards, successToast, errorToast).then(() => router.push('/boards'))
  }

  // List functions

  const handleCreateNewList = () => {
    if (user && !Object.keys(user).length) return

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

    const newList: List = {
      id: uniqueId,
      name: `${listName ? listName : "New list"}`,
      tasks: []
    }

    const updatedBoards = boards
    updatedBoards[boardIndex] = {
      ...updatedBoards[boardIndex], lists: [...updatedBoards[boardIndex].lists, newList]
    }

    const successToast = () => GeneralToast.fire({
      icon: 'success',
      title: `${listName ? listName : "New"} list created`
    })

    const errorToast = () => GeneralToast.fire({
      icon: 'error',
      title: 'Failed to create new list'
    })

    updateData(updatedBoards, successToast, errorToast)
  }

  const handleEditList = (boardId: string, listId: string, listName: string) => {
    if (user && !Object.keys(user).length) return

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
    if (user && !Object.keys(user).length) return

    const boardIndex = boards?.findIndex(board => board.id === boardId)
    const listIndex = boards[boardIndex].lists.findIndex(list => list.id === listId)

    const updatedBoards = boards
    updatedBoards[boardIndex].lists[listIndex].name = newListName

    const successToast = () => GeneralToast.fire({
      icon: 'success',
      title: 'List updated'
    })

    const errorToast = () => GeneralToast.fire({
      icon: 'error',
      title: 'Failed to update the list'
    })

    updateData(updatedBoards, successToast, errorToast)
  }

  const handleDeleteList = (boardId: string, listId: string, listName: string) => {
    if (user && !Object.keys(user).length) return

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
    if (user && !Object.keys(user).length) return

    const boardIndex = boards?.findIndex(board => board.id === boardId)

    const updatedBoards = boards
    updatedBoards[boardIndex] = {
      ...updatedBoards[boardIndex],
      lists: updatedBoards[boardIndex].lists.filter(list => list.id !== listId)
    }

    const successToast = () => GeneralToast.fire({
      icon: 'success',
      title: 'List deleted'
    })

    const errorToast = () => GeneralToast.fire({
      icon: 'error',
      title: 'Failed to delete the list'
    })

    updateData(updatedBoards, successToast, errorToast)
  }

  // Task functions

  const handleCreateNewTask = (boardId: string, listId: string) => {
    if (user && !Object.keys(user).length) return

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

    const successToast = () => GeneralToast.fire({
      icon: 'success',
      title: 'Task created'
    })

    const errorToast = () => GeneralToast.fire({
      icon: 'error',
      title: 'Failed to create new task'
    })

    updateData(updatedBoards, successToast, errorToast)
  }

  const handleEditTask = (boardId: string, listId: string, taskId: string, taskName: string, taskDescription: string | undefined, taskStatus: string) => {
    if (user && !Object.keys(user).length) return

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
      showDenyButton: true,
      denyButtonText: "Delete task",
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
      } else if (result.isDenied) {
        handleDeleteTask(boardId, listId, taskId, taskName)
      } else {
        return
      }
    })
  }

  const editTask = (boardId: string, listId: string, taskId: string, taskName: string, taskDescription: string | undefined, taskStatus: string) => {
    if (user && !Object.keys(user).length) return

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

    const successToast = () => GeneralToast.fire({
      icon: 'success',
      title: 'Task updated'
    })

    const errorToast = () => GeneralToast.fire({
      icon: 'error',
      title: 'Failed to update the task'
    })

    updateData(updatedBoards, successToast, errorToast)
  }

  const handleDeleteTask = (boardId: string, listId: string, taskId: string, taskName: string) => {
    if (user && !Object.keys(user).length) return

    Swal.fire({
      color: "#fff",
      background: "#111827",
      title: `Are you sure you want to delete "${taskName}"? You can't revert this change.`,
      showConfirmButton: true,
      confirmButtonText: "Yes",
      confirmButtonColor: "#2563eb",
      showCancelButton: true,
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        deleteTask(boardId, listId, taskId)
      }
    })
  }

  const deleteTask = (boardId: string, listId: string, taskId: string) => {
    if (user && !Object.keys(user).length) return

    const boardIndex = boards?.findIndex(board => board.id === boardId)
    const listIndex = boards[boardIndex].lists.findIndex(list => list.id === listId)

    const updatedBoards = boards
    updatedBoards[boardIndex].lists[listIndex] = {
      ...updatedBoards[boardIndex].lists[listIndex],
      tasks: updatedBoards[boardIndex].lists[listIndex].tasks.filter(task => task.id !== taskId)
    }

    const successToast = () => GeneralToast.fire({
      icon: 'success',
      title: `Task deleted`
    })

    const errorToast = () => GeneralToast.fire({
      icon: 'error',
      title: 'Failed to delete the task'
    })

    updateData(updatedBoards, successToast, errorToast)
  }

  if (!user || !boards || !board) {
    return (
      <div className="poppins w-screen h-full flex flex-wrap gap-2 items-center justify-center p-5 text-center">
        <h1 className="text-3xl text-white">Loading board...</h1>
      </div>
    )
  }

  return (
    <div className="pb-5 poppins w-screen flex flex-row flex-wrap items-start justify-center text-center text-white gap-2">
      {board && (
        <div className="flex text-center justify-between items-center w-full bg-black py-1 px-5">
          <h1 className="text-2xl">{board?.name}</h1>
          <div ref={dropdownRef} className="relative inline-block">
            <div className={`h-[50px] w-[50px]flex items-center justify-center hover:cursor-pointer border rounded-md z-1 ${toggleDropdown ? 'border-blue-500' : 'border-transparent'}`}>
              <Image className={`standard_transition ${toggleDropdown ? 'arrow_rotate' : 'arrow_still'}`} src="/arrow.svg" alt="Arrow icon" width={50} height={50} onClick={() => setToggleDropdown(prev => !prev)} />
            </div>
            {toggleDropdown &&
              <ul className="absolute flex flex-col gap-3 rounded-md bg-gray-700 z-10 min-w-[250px] p-3 mt-2 right-0 text-center board_dropdown_reveal overflow-hidden">
                <h1>Board options</h1>
                <button className="w-full p-3 rounded-md bg-blue-600 text-white hover:bg-blue-700 focus:outline-none text-center" onClick={() => handleEditBoard(board?.id, board?.name)}>
                  Edit board
                </button>
                <button className="w-full p-3 rounded-md bg-red-600 text-white hover:bg-red-700 focus:outline-none text-center" onClick={() => handleDeleteBoard(board?.id, board?.name)}>
                  Delete board
                </button>
              </ul>
            }
          </div>
        </div>
      )}
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
