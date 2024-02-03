type Task = {
  id: string,
  name: string,
  description?: string,
  // Unfinished, In progress, Finished
  status: string,
}

type List = {
  id: string,
  name: string,
  tasks: Task[],
}

type Board = {
  id: string,
  name: string,
  theme: string,
  lists: List[],
}