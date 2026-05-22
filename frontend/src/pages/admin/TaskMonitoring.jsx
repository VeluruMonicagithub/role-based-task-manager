import { useEffect, useState } from "react"
import { FiSearch, FiTrash2, FiLayers, FiCheckCircle, FiClock, FiUser, FiAlertCircle } from "react-icons/fi"

import api from "../../services/api"

const TaskMonitoring = () => {
  const [tasks, setTasks] = useState([])
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all") // 'all', 'pending', 'completed'
  const [loading, setLoading] = useState(true)

  const fetchTasks = async () => {
    try {
      const { data } = await api.get("/admin/tasks")
      setTasks(data)
    } catch (error) {
      console.error("Error fetching monitored tasks", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTasks()
  }, [])

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user's task? This action is irreversible.")) {
      return
    }

    try {
      await api.delete(`/tasks/${id}`)
      fetchTasks()
    } catch (error) {
      console.error("Error deleting user task", error)
    }
  }

  // Processing Search and Status Filter
  const filteredTasks = tasks.filter(task => {
    const creatorName = task.createdBy?.name || ""
    const creatorEmail = task.createdBy?.email || ""
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (task.description && task.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
                          creatorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          creatorEmail.toLowerCase().includes(searchQuery.toLowerCase())
    
    if (statusFilter === "completed") {
      return matchesSearch && task.completed
    } else if (statusFilter === "pending") {
      return matchesSearch && !task.completed
    }
    
    return matchesSearch
  })

  const completedCount = tasks.filter(t => t.completed).length
  const pendingCount = tasks.length - completedCount

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <span className="w-8 h-8 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Board Summary Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Total Tasks */}
        <div className="glass-card rounded-2xl p-4 flex items-center justify-between">
          <div>
            <p className="text-text-muted text-[10px] font-semibold uppercase tracking-wider">Monitored Tasks</p>
            <p className="text-2xl font-bold text-text-main mt-1">{tasks.length}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400">
            <FiLayers className="w-5 h-5" />
          </div>
        </div>

        {/* Completed */}
        <div className="glass-card rounded-2xl p-4 flex items-center justify-between">
          <div>
            <p className="text-text-muted text-[10px] font-semibold uppercase tracking-wider">Completed Tasks</p>
            <p className="text-2xl font-bold text-emerald-400 mt-1">{completedCount}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400">
            <FiCheckCircle className="w-5 h-5" />
          </div>
        </div>

        {/* Pending */}
        <div className="glass-card rounded-2xl p-4 flex items-center justify-between">
          <div>
            <p className="text-text-muted text-[10px] font-semibold uppercase tracking-wider">Pending Tasks</p>
            <p className="text-2xl font-bold text-amber-500 mt-1">{pendingCount}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-400">
            <FiClock className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Filter and Control Bar */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        {/* Search */}
        <div className="relative w-full sm:max-w-xs">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-text-muted">
            <FiSearch className="w-4 h-4" />
          </div>
          <input
            id="search-monitor-tasks"
            type="text"
            placeholder="Search by title, description, or creator..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input-style w-full pl-9 pr-4 py-2 rounded-xl text-sm"
          />
        </div>

        {/* Filter Tabs */}
        <div className="flex bg-input-main border border-border-main p-1 rounded-xl w-full sm:w-auto">
          {[
            { id: "all", label: "All Tasks" },
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

      {/* Task List Monitored */}
      {filteredTasks.length === 0 ? (
        <div className="glass-card rounded-3xl p-12 text-center text-text-muted max-w-lg mx-auto space-y-3">
          <FiAlertCircle className="w-8 h-8 mx-auto text-text-muted animate-pulse" />
          <h4 className="font-display font-bold text-text-main">No tasks monitored</h4>
          <p className="text-xs text-text-muted">
            No system-wide tasks matched your search or status query.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredTasks.map((task) => {
            const creatorInitials = task.createdBy?.name
              ? task.createdBy.name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2)
              : "U"
            const isCompleted = task.completed

            return (
              <div
                key={task._id}
                className={`glass-card rounded-2xl p-5 border-l-4 relative overflow-hidden flex flex-col justify-between ${
                  isCompleted 
                    ? "border-l-emerald-500 bg-emerald-500/[0.01]" 
                    : "border-l-indigo-500 bg-indigo-500/[0.01]"
                }`}
              >
                {/* Task Header & Body */}
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-4">
                    <h4 className="font-semibold text-text-main text-sm">{task.title}</h4>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold tracking-wide border ${
                      isCompleted 
                        ? "bg-emerald-500/10 border-emerald-500/25 text-emerald-400"
                        : "bg-indigo-500/10 border-indigo-500/25 text-indigo-400"
                    }`}>
                      {isCompleted ? "Completed" : "Pending"}
                    </span>
                  </div>
                  <p className="text-xs text-text-muted leading-relaxed">
                    {task.description || "No description provided."}
                  </p>
                </div>

                {/* Creator Profile Panel & Deletion controls */}
                <div className="flex items-center justify-between border-t border-border-main mt-5 pt-4">
                  {/* Creator Info */}
                  <div className="flex items-center gap-2.5 overflow-hidden">
                    <div className="w-8 h-8 rounded-lg bg-input-main border border-border-main flex items-center justify-center text-text-muted font-bold text-xs shrink-0">
                      {creatorInitials}
                    </div>
                    <div className="overflow-hidden">
                      <p className="text-[11px] font-semibold text-text-main truncate">
                        {task.createdBy?.name || "Unknown Creator"}
                      </p>
                      <p className="text-[9px] text-text-muted truncate">
                        {task.createdBy?.email || "No email available"}
                      </p>
                    </div>
                  </div>

                  {/* Remote Delete Button */}
                  <button
                    onClick={() => handleDelete(task._id)}
                    className="p-2 rounded-lg border border-border-main hover:border-red-500/30 hover:bg-red-500/10 hover:text-red-400 transition-all text-text-muted cursor-pointer shrink-0"
                    title="Administrative Delete"
                  >
                    <FiTrash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default TaskMonitoring
