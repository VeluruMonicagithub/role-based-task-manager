import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { FiUsers, FiLayers, FiCheckCircle, FiClock, FiActivity, FiArrowRight, FiUserCheck } from "react-icons/fi"

import api from "../../services/api"

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalTasks: 0,
    completedTasks: 0,
    pendingTasks: 0,
    rate: 0
  })
  const [recentLogs, setRecentLogs] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchDashboardData = async () => {
    try {
      const [{ data: users }, { data: tasks }, { data: logs }] = await Promise.all([
        api.get("/admin/users"),
        api.get("/admin/tasks"),
        api.get("/admin/logs")
      ])

      const completedTasks = tasks.filter((task) => task.completed).length
      const pendingTasks = tasks.length - completedTasks
      const rate = tasks.length > 0 ? Math.round((completedTasks / tasks.length) * 100) : 0

      setStats({
        totalUsers: users.length,
        totalTasks: tasks.length,
        completedTasks,
        pendingTasks,
        rate
      })

      // Get up to 4 recent activity logs
      setRecentLogs(logs.slice(0, 4))
    } catch (error) {
      console.error("Error fetching admin statistics", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDashboardData()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <span className="w-8 h-8 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Welcome Title */}
      <div className="space-y-1">
        <h1 className="font-display font-bold text-2xl md:text-3xl tracking-tight text-zinc-100">
          Admin Cockpit
        </h1>
        <p className="text-zinc-400 text-sm">
          Overview of platform operations, user accounts, and real-time activity metrics.
        </p>
      </div>

      {/* Analytics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {/* Total Users */}
        <div className="glass-card rounded-2xl p-5 relative overflow-hidden">
          <div className="absolute top-3 right-3 w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-400">
            <FiUsers className="w-5 h-5" />
          </div>
          <p className="text-zinc-500 text-xs font-semibold uppercase tracking-wider">Total Accounts</p>
          <p className="text-3xl font-display font-bold text-zinc-100 mt-2">{stats.totalUsers}</p>
          <p className="text-zinc-400 text-[10px] mt-1">Registered team members</p>
        </div>

        {/* Total Tasks */}
        <div className="glass-card rounded-2xl p-5 relative overflow-hidden">
          <div className="absolute top-3 right-3 w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400">
            <FiLayers className="w-5 h-5" />
          </div>
          <p className="text-zinc-500 text-xs font-semibold uppercase tracking-wider">Total Tasks</p>
          <p className="text-3xl font-display font-bold text-zinc-100 mt-2">{stats.totalTasks}</p>
          <p className="text-zinc-400 text-[10px] mt-1">Across all user portals</p>
        </div>

        {/* Completed Tasks */}
        <div className="glass-card rounded-2xl p-5 relative overflow-hidden">
          <div className="absolute top-3 right-3 w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400">
            <FiCheckCircle className="w-5 h-5" />
          </div>
          <p className="text-zinc-500 text-xs font-semibold uppercase tracking-wider">Completed</p>
          <p className="text-3xl font-display font-bold text-zinc-100 mt-2">{stats.completedTasks}</p>
          <p className="text-zinc-400 text-[10px] mt-1">Successfully resolved</p>
        </div>

        {/* Completion Rate */}
        <div className="glass-card rounded-2xl p-5 relative overflow-hidden">
          <div className="absolute top-3 right-3 w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400">
            <FiClock className="w-5 h-5" />
          </div>
          <p className="text-zinc-500 text-xs font-semibold uppercase tracking-wider">Completion Rate</p>
          <p className="text-3xl font-display font-bold text-zinc-100 mt-2">{stats.rate}%</p>
          <div className="w-full bg-zinc-800 rounded-full h-1.5 mt-3.5">
            <div 
              className="bg-gradient-to-r from-purple-500 to-indigo-500 h-1.5 rounded-full" 
              style={{ width: `${stats.rate}%` }}
            />
          </div>
        </div>
      </div>

      {/* Main Board Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
        {/* Navigation Shortcut Cards */}
        <div className="lg:col-span-2 space-y-6">
          <h3 className="font-display font-bold text-lg text-zinc-200">
            Management Consoles
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link
              to="/admin/users"
              className="glass-card rounded-2xl p-6 border-t-2 border-t-purple-500 hover:scale-[1.01] transition-all flex flex-col justify-between h-44"
            >
              <div>
                <FiUsers className="w-6 h-6 text-purple-400 mb-3" />
                <h4 className="font-semibold text-zinc-200 text-sm mb-1">User Directory</h4>
                <p className="text-xs text-zinc-500">Deactivate accounts, change status levels, or clear profiles.</p>
              </div>
              <span className="text-xs text-purple-400 font-semibold inline-flex items-center gap-1 mt-3">
                <span>Manage directory</span>
                <FiArrowRight />
              </span>
            </Link>

            <Link
              to="/admin/tasks"
              className="glass-card rounded-2xl p-6 border-t-2 border-t-blue-500 hover:scale-[1.01] transition-all flex flex-col justify-between h-44"
            >
              <div>
                <FiLayers className="w-6 h-6 text-blue-400 mb-3" />
                <h4 className="font-semibold text-zinc-200 text-sm mb-1">Task Board Monitor</h4>
                <p className="text-xs text-zinc-500">Track task creations, analyze details, and delete inappropriate entries.</p>
              </div>
              <span className="text-xs text-blue-400 font-semibold inline-flex items-center gap-1 mt-3">
                <span>Monitor tasks</span>
                <FiArrowRight />
              </span>
            </Link>

            <Link
              to="/admin/logs"
              className="glass-card rounded-2xl p-6 border-t-2 border-t-emerald-500 hover:scale-[1.01] transition-all flex flex-col justify-between h-44"
            >
              <div>
                <FiActivity className="w-6 h-6 text-emerald-400 mb-3" />
                <h4 className="font-semibold text-zinc-200 text-sm mb-1">Audit Logs</h4>
                <p className="text-xs text-zinc-500">Review security access points, track logouts, and task history.</p>
              </div>
              <span className="text-xs text-emerald-400 font-semibold inline-flex items-center gap-1 mt-3">
                <span>View system logs</span>
                <FiArrowRight />
              </span>
            </Link>
          </div>
        </div>

        {/* Live System Activity Timelines */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-display font-bold text-lg text-zinc-200">
              Live Activities
            </h3>
            <Link to="/admin/logs" className="text-purple-400 hover:text-purple-300 font-semibold text-xs flex items-center gap-1 transition-colors">
              <span>Audit logs</span>
              <FiArrowRight />
            </Link>
          </div>

          <div className="glass-card rounded-3xl p-5 space-y-4">
            {recentLogs.length === 0 ? (
              <p className="text-xs text-zinc-500 text-center py-6">No recent activity logs found.</p>
            ) : (
              <div className="relative pl-4 space-y-5 border-l border-zinc-800/80">
                {recentLogs.map((log) => {
                  let badgeColor = "bg-purple-500"
                  if (log.action.includes("Create")) badgeColor = "bg-green-500"
                  if (log.action.includes("Update")) badgeColor = "bg-amber-500"
                  if (log.action.includes("Delete")) badgeColor = "bg-red-500"

                  return (
                    <div key={log._id} className="relative text-xs space-y-1">
                      {/* Timeline Dot */}
                      <span className={`absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full ${badgeColor} border-2 border-zinc-950 shadow-glow`} />
                      
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-semibold text-zinc-200">{log.action}</span>
                        <span className="text-[10px] text-zinc-500">
                          {new Date(log.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <p className="text-zinc-400 text-[10px]">
                        User: <span className="font-medium text-zinc-300">{log.user?.name || "System"}</span>
                      </p>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard