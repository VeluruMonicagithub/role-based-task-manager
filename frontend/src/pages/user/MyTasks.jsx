import { useEffect, useState } from "react"

import api from "../../services/api"

const MyTasks = () => {
  const [tasks, setTasks] = useState([])
  const [title, setTitle] = useState("")

  const fetchTasks = async () => {
    const { data } = await api.get("/tasks")

    setTasks(data)
  }

  useEffect(() => {
    fetchTasks()
  }, [])
   const createTask = async () => {
    await api.post("/tasks", {
      title,
    })

    setTitle("")

    fetchTasks()
  }

  const deleteTask = async (id) => {
    await api.delete(`/tasks/${id}`)

    fetchTasks()
  }
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">My Tasks</h1>

      <div className="flex gap-4 mb-6">
        <input
          type="text"
          placeholder="Task title"
          className="border p-2"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <button
          onClick={createTask}
          className="bg-blue-500 text-white px-4"
        >
          Add
        </button>
        </div>

      {tasks.map((task) => (
        <div
          key={task._id}
          className="border p-4 rounded mb-4 flex justify-between"
        >
          <h3>{task.title}</h3>

          <button
            onClick={() => deleteTask(task._id)}
            className="bg-red-500 text-white px-3 py-1"
          >
            Delete
          </button>
        </div>
      ))}
    </div>
  )
}
export default MyTasks