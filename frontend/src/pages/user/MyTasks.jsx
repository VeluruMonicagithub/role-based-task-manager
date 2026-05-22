import { useEffect, useState } from "react"
import { FiPlus, FiTrash2, FiSearch, FiCheck, FiRefreshCw, FiCalendar, FiFilter } from "react-icons/fi"

import api from "../../services/api"

const MyTasks = () => {
  const [tasks, setTasks] = useState([])
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all") // 'all', 'pending', 'completed'
  const [loading, setLoading] = useState(true)
  const [creating, setCreating] = useState(false)

  const fetchTasks = async () => {
    try {
      const { data } = await api.get("/tasks")
      setTasks(data)
    } catch (error) {
      console.error("Error fetching tasks", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTasks()
  }, [])

  const createTask = async (e) => {
    e.preventDefault()
    if (!title.trim()) return

    setCreating(true)
    try {
      await api.post("/tasks", {
        title,
        description,
      })
      setTitle("")
      setDescription("")
      fetchTasks()
    } catch (error) {
      console.error("Error creating task", error)
    } finally {
      setCreating(false)
    }
  }

  const deleteTask = async (id) => {
    if (!window.confirm("Are you sure you want to delete this task?")) return
    try {
      await api.delete(`/tasks/${id}`)
      fetchTasks()
    } catch (error) {
      console.error("Error deleting task", error)
    }
  }

  const toggleCompleted = async (task) => {
    try {
      await api.put(`/tasks/${task._id}`, {
        completed: !task.completed,
      })
      fetchTasks()
    } catch (error) {
      console.error("Error updating task status", error)
    }
  }

  // Search & Filter processing
  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (task.description && task.description.toLowerCase().includes(searchQuery.toLowerCase()))
    
    if (statusFilter === "completed") {
      return matchesSearch && task.completed
    } else if (statusFilter === "pending") {
      return matchesSearch && !task.completed
    }
    
    return matchesSearch
  })

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <span className="w-8 h-8 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Task Creation Form Card */}
      <div className="glass-panel rounded-3xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />
        <h3 className="font-display font-bold text-lg text-text-main mb-4 flex items-center gap-2">
          <FiPlus className="text-purple-400 w-5 h-5" />
          <span>Add New Task</span>
        </h3>
        <form onSubmit={createTask} className="grid gap-4 md:grid-cols-7 items-end">
          <div className="md:col-span-3 space-y-1.5">
            <label className="text-[10px] font-semibold uppercase tracking-wider text-text-muted">Task Title</label>
            <input
              id="new-task-title"
              type="text"
              placeholder="e.g. Design app UI landing page"
              className="input-style w-full py-2.5 px-3.5 rounded-xl text-sm"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div className="md:col-span-3 space-y-1.5">
            <label className="text-[10px] font-semibold uppercase tracking-wider text-text-muted">Short Description</label>
            <input
              id="new-task-desc"
              type="text"
              placeholder="e.g. Work on high-fidelity designs in Figma"
              className="input-style w-full py-2.5 px-3.5 rounded-xl text-sm"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div className="md:col-span-1">
            <button
              id="new-task-submit"
              type="submit"
              disabled={creating || !title.trim()}
              className="glow-btn w-full text-white font-medium py-3 rounded-xl hover:scale-[1.01] active:scale-100 transition-all text-xs flex items-center justify-center gap-1.5 disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
            >
              {creating ? (
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                "Add Task"
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Task Filters & Control Bar */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        {/* Search */}
        <div className="relative w-full sm:max-w-xs">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-text-muted">
            <FiSearch className="w-4 h-4" />
          </div>
          <input
            id="search-tasks"
            type="text"
            placeholder="Search tasks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input-style w-full pl-9 pr-4 py-2 rounded-xl text-sm"
          />
        </div>

        {/* Filter Tabs */}
        <div className="flex bg-input-main border border-border-main p-1 rounded-xl w-full sm:w-auto">
          {[
            { id: "all", label: "All" },
            { id: "pending", label: "Pending" },
            { id: "completed", label: "Completed" },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              className={`flex-1 sm:flex-initial py-1.5 px-4 rounded-lg text-xs font-semibold tracking-wide transition-all cursor-pointer ${
                statusFilter === tab.id
                  ? "bg-bg-card-hover text-purple-400 border border-border-main shadow"
                  : "text-text-muted hover:text-text-main"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tasks Display */}
      {filteredTasks.length === 0 ? (
        <div className="glass-card rounded-3xl p-12 text-center text-text-muted max-w-lg mx-auto space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-input-main border border-border-main flex items-center justify-center mx-auto text-text-muted">
            <FiFilter className="w-6 h-6" />
          </div>
          <h4 className="font-display font-bold text-text-main">No tasks found</h4>
          <p className="text-xs text-text-muted">
            No items matched your current filters. Try adding a task or adjusting your search filters.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredTasks.map((task) => (
            <div
              key={task._id}
              className={`glass-card rounded-2xl p-5 border-l-4 relative overflow-hidden transition-all duration-300 flex flex-col justify-between ${
                task.completed 
                  ? "border-l-emerald-500 bg-emerald-500/[0.01]" 
                  : "border-l-indigo-500 bg-indigo-500/[0.01]"
              }`}
            >
              {/* Background Glow when completed */}
              {task.completed && (
                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none" />
              )}

              {/* Title & Description */}
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-4">
                  <h4 className={`font-semibold text-base transition-colors ${
                    task.completed ? "text-text-muted line-through" : "text-text-main"
                  }`}>
                    {task.title}
                  </h4>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold tracking-wide border ${
                    task.completed 
                      ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                      : "bg-indigo-500/10 border-indigo-500/20 text-indigo-400"
                  }`}>
                    {task.completed ? "Completed" : "Pending"}
                  </span>
                </div>
                <p className={`text-xs ${
                  task.completed ? "text-text-muted" : "text-text-muted"
                }`}>
                  {task.description || "No description provided."}
                </p>
              </div>

              {/* Footer Meta & Actions */}
              <div className="flex items-center justify-between border-t border-border-main mt-5 pt-4">
                <div className="flex items-center gap-1.5 text-text-muted">
                  <FiCalendar className="w-3.5 h-3.5" />
                  <span className="text-[10px] font-medium">
                    {new Date(task.createdAt).toLocaleDateString(undefined, { 
                      month: 'short', 
                      day: 'numeric' 
                    })}
                  </span>
                </div>
                
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleCompleted(task)}
                    className={`flex items-center gap-1 py-1.5 px-3 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                      task.completed
                        ? "bg-input-main border-border-main text-text-muted hover:bg-bg-card-hover hover:text-text-main"
                        : "bg-emerald-500/10 border-emerald-500/25 text-emerald-400 hover:bg-emerald-500/20 shadow-glow"
                    }`}
                  >
                    {task.completed ? (
                      <>
                        <FiRefreshCw className="w-3.5 h-3.5" />
                        <span>Reopen</span>
                      </>
                    ) : (
                      <>
                        <FiCheck className="w-3.5 h-3.5" />
                        <span>Done</span>
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => deleteTask(task._id)}
                    className="p-1.5 rounded-lg border border-border-main hover:border-red-500/30 hover:bg-red-500/10 hover:text-red-400 transition-all text-text-muted cursor-pointer"
                    title="Delete task"
                  >
                    <FiTrash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default MyTasks