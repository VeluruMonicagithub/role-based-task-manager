import { useEffect, useState, useContext } from "react"
import { Link } from "react-router-dom"
import { FiCheckCircle, FiActivity, FiClock, FiPlus, FiArrowRight, FiCheckSquare } from "react-icons/fi"

import api from "../../services/api"
import { AuthContext } from "../../context/AuthContext"

const Dashboard = () => {
  const { user } = useContext(AuthContext)
  const [stats, setStats] = useState({
    total: 0,
    completed: 0,
    pending: 0,
    rate: 0
  })
  const [recentTasks, setRecentTasks] = useState([])
  const [quickTitle, setQuickTitle] = useState("")
  const [loading, setLoading] = useState(true)

  const fetchDashboardData = async () => {
    try {
      const { data: tasks } = await api.get("/tasks")
      
      const completed = tasks.filter(t => t.completed).length
      const pending = tasks.length - completed
      const rate = tasks.length > 0 ? Math.round((completed / tasks.length) * 100) : 0

      setStats({
        total: tasks.length,
        completed,
        pending,
        rate
      })

      // Get up to 3 recent pending tasks
      setRecentTasks(tasks.filter(t => !t.completed).slice(0, 3))
    } catch (error) {
      console.error("Error fetching dashboard statistics", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const handleQuickTask = async (e) => {
    e.preventDefault()
    if (!quickTitle.trim()) return

    try {
      await api.post("/tasks", {
        title: quickTitle,
        description: "Created via quick task launcher."
      })
      setQuickTitle("")
      fetchDashboardData()
    } catch (error) {
      console.error("Error creating quick task", error)
    }
  }

  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return "Good morning"
    if (hour < 18) return "Good afternoon"
    return "Good evening"
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <span className="w-8 h-8 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Welcome Card */}
      <div className="glass-card rounded-3xl p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="space-y-2">
          <h1 className="font-display font-bold text-2xl md:text-3xl tracking-tight text-text-main">
            {getGreeting()}, <span className="bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent">{user?.name}</span>!
          </h1>
          <p className="text-text-muted text-sm max-w-lg">
            Welcome to your dashboard. You have <span className="text-purple-400 font-semibold">{stats.pending} pending tasks</span> left to complete today. Let's make it productive!
          </p>
        </div>
        <Link
          to="/tasks"
          className="glow-btn flex items-center gap-2 text-white font-medium py-3 px-6 rounded-xl hover:scale-[1.01] active:scale-100 transition-all text-sm cursor-pointer shadow-lg"
        >
          <FiCheckSquare className="w-4 h-4" />
          <span>Manage My Tasks</span>
        </Link>
      </div>

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {/* Total Tasks */}
        <div className="glass-card rounded-2xl p-5 relative overflow-hidden">
          <div className="absolute top-3 right-3 w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-400">
            <FiActivity className="w-5 h-5" />
          </div>
          <p className="text-text-muted text-xs font-semibold uppercase tracking-wider">Total Tasks</p>
          <p className="text-3xl font-display font-bold text-text-main mt-2">{stats.total}</p>
          <p className="text-text-muted text-xs mt-1">Items in your backlogs</p>
        </div>

        {/* Pending Tasks */}
        <div className="glass-card rounded-2xl p-5 relative overflow-hidden">
          <div className="absolute top-3 right-3 w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-400">
            <FiClock className="w-5 h-5" />
          </div>
          <p className="text-text-muted text-xs font-semibold uppercase tracking-wider">Pending Tasks</p>
          <p className="text-3xl font-display font-bold text-text-main mt-2">{stats.pending}</p>
          <p className="text-text-muted text-xs mt-1">Awaiting completion</p>
        </div>

        {/* Completed Tasks */}
        <div className="glass-card rounded-2xl p-5 relative overflow-hidden">
          <div className="absolute top-3 right-3 w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400">
            <FiCheckCircle className="w-5 h-5" />
          </div>
          <p className="text-text-muted text-xs font-semibold uppercase tracking-wider">Completed Tasks</p>
          <p className="text-3xl font-display font-bold text-text-main mt-2">{stats.completed}</p>
          <p className="text-text-muted text-xs mt-1">Completed successfully</p>
        </div>

        {/* Completion Rate */}
        <div className="glass-card rounded-2xl p-5 relative overflow-hidden">
          <p className="text-text-muted text-xs font-semibold uppercase tracking-wider">Completion Rate</p>
          <p className="text-3xl font-display font-bold text-text-main mt-2">{stats.rate}%</p>
          <div className="w-full bg-input-main rounded-full h-2 mt-3.5">
            <div 
              className="bg-gradient-to-r from-purple-500 to-indigo-500 h-2 rounded-full transition-all duration-500" 
              style={{ width: `${stats.rate}%` }}
            />
          </div>
        </div>
      </div>

      {/* Main Workspace Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
        {/* Recent Pending Tasks */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-display font-bold text-lg text-text-main">
              Urgent Tasks
            </h3>
            <Link to="/tasks" className="text-purple-400 hover:text-purple-300 font-semibold text-xs flex items-center gap-1.5 transition-colors">
              <span>View all</span>
              <FiArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-3">
            {recentTasks.length === 0 ? (
              <div className="glass-card rounded-2xl p-6 text-center text-text-muted text-sm">
                🎉 Hooray! You have no pending tasks right now.
              </div>
            ) : (
              recentTasks.map(task => (
                <div 
                  key={task._id} 
                  className="glass-card rounded-2xl p-4 flex items-center justify-between border-l-4 border-l-amber-500"
                >
                  <div className="space-y-1">
                    <p className="font-semibold text-text-main text-sm">{task.title}</p>
                    <p className="text-xs text-text-muted truncate max-w-sm sm:max-w-md">{task.description}</p>
                  </div>
                  <span className="text-[10px] bg-amber-500/10 border border-amber-500/20 text-amber-400 px-2 py-0.5 rounded-full font-medium">
                    Incomplete
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Quick Add Form Panel */}
        <div className="space-y-4">
          <h3 className="font-display font-bold text-lg text-text-main">
            Quick Launcher
          </h3>
          <div className="glass-card rounded-2xl p-5 space-y-4">
            <p className="text-xs text-text-muted">
              Add a quick task to your backlogs instantly without description fields.
            </p>
            <form onSubmit={handleQuickTask} className="space-y-3">
              <input
                id="quick-task-title"
                type="text"
                placeholder="What needs to be done?"
                value={quickTitle}
                onChange={(e) => setQuickTitle(e.target.value)}
                className="input-style w-full py-2.5 px-3.5 rounded-xl text-sm"
              />
              <button
                type="submit"
                disabled={!quickTitle.trim()}
                className="glow-btn w-full text-white font-medium py-2.5 rounded-xl hover:scale-[1.01] active:scale-100 transition-all text-xs flex items-center justify-center gap-1.5 disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
              >
                <FiPlus className="w-4 h-4" />
                <span>Create Task</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard