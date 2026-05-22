import { useEffect, useState } from "react"
import { FiSearch, FiKey, FiPlusCircle, FiRefreshCw, FiTrash2, FiClock, FiUser, FiAlertCircle } from "react-icons/fi"

import api from "../../services/api"

const ActivityLogs = () => {
  const [logs, setLogs] = useState([])
  const [searchQuery, setSearchQuery] = useState("")
  const [actionFilter, setActionFilter] = useState("all") // 'all', 'login', 'create', 'update', 'delete'
  const [loading, setLoading] = useState(true)

  const fetchLogs = async () => {
    try {
      const { data } = await api.get("/admin/logs")
      setLogs(data)
    } catch (error) {
      console.error("Error fetching activity logs", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchLogs()
  }, [])

  // Filter processing
  const filteredLogs = logs.filter(log => {
    const userName = log.user?.name || ""
    const userEmail = log.user?.email || ""
    const matchesSearch = log.action.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          userEmail.toLowerCase().includes(searchQuery.toLowerCase())

    if (actionFilter === "login") {
      return matchesSearch && log.action.includes("Logged In")
    } else if (actionFilter === "create") {
      return matchesSearch && log.action.includes("Created")
    } else if (actionFilter === "update") {
      return matchesSearch && log.action.includes("Updated")
    } else if (actionFilter === "delete") {
      return matchesSearch && log.action.includes("Deleted")
    }

    return matchesSearch
  })

  // Action Icon Resolver
  const getLogIcon = (action) => {
    const style = "w-4 h-4 text-white"
    if (action.includes("Logged In")) {
      return {
        icon: <FiKey className={style} />,
        bgColor: "bg-blue-500 shadow-blue-500/20",
        borderColor: "border-blue-500/30"
      }
    }
    if (action.includes("Created")) {
      return {
        icon: <FiPlusCircle className={style} />,
        bgColor: "bg-emerald-500 shadow-emerald-500/20",
        borderColor: "border-emerald-500/30"
      }
    }
    if (action.includes("Updated")) {
      return {
        icon: <FiRefreshCw className={style} />,
        bgColor: "bg-amber-500 shadow-amber-500/20",
        borderColor: "border-amber-500/30"
      }
    }
    if (action.includes("Deleted")) {
      return {
        icon: <FiTrash2 className={style} />,
        bgColor: "bg-red-500 shadow-red-500/20",
        borderColor: "border-red-500/30"
      }
    }
    return {
      icon: <FiClock className={style} />,
      bgColor: "bg-zinc-500 shadow-zinc-500/20",
      borderColor: "border-zinc-500/30"
    }
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
      {/* Control Bar */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        {/* Search */}
        <div className="relative w-full sm:max-w-xs">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-text-muted">
            <FiSearch className="w-4 h-4" />
          </div>
          <input
            id="search-logs"
            type="text"
            placeholder="Search by user or action..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input-style w-full pl-9 pr-4 py-2 rounded-xl text-sm"
          />
        </div>

        {/* Filter Categories */}
        <div className="flex bg-input-main border border-border-main p-1 rounded-xl w-full sm:w-auto overflow-x-auto">
          {[
            { id: "all", label: "All Logs" },
            { id: "login", label: "Logins" },
            { id: "create", label: "Creations" },
            { id: "update", label: "Updates" },
            { id: "delete", label: "Deletions" },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActionFilter(tab.id)}
              className={`flex-1 sm:flex-initial whitespace-nowrap py-1.5 px-4 rounded-lg text-xs font-semibold tracking-wide transition-all cursor-pointer ${
                actionFilter === tab.id
                  ? "bg-bg-card-hover text-purple-400 border border-border-main shadow"
                  : "text-text-muted hover:text-text-main"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Timeline Section */}
      {filteredLogs.length === 0 ? (
        <div className="glass-card rounded-3xl p-12 text-center text-text-muted max-w-lg mx-auto space-y-3">
          <FiAlertCircle className="w-8 h-8 mx-auto text-text-muted" />
          <h4 className="font-display font-bold text-text-main">No logs matching filters</h4>
          <p className="text-xs text-text-muted">
            No audit records matched your current query or action filter tab.
          </p>
        </div>
      ) : (
        <div className="relative pl-6 sm:pl-8 ml-4 sm:ml-6 border-l border-border-main space-y-8 py-2">
          {filteredLogs.map((log) => {
            const meta = getLogIcon(log.action)
            const initials = log.user?.name
              ? log.user.name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2)
              : "U"
            const localTimeStr = new Date(log.createdAt).toLocaleString(undefined, {
              dateStyle: 'medium',
              timeStyle: 'short'
            })

            return (
              <div key={log._id} className="relative group">
                {/* Timeline Node Icon */}
                <div className={`absolute -left-[38px] sm:-left-[46px] top-1.5 w-7 h-7 sm:w-8 sm:h-8 rounded-xl flex items-center justify-center border-2 border-bg-main shadow-md ${meta.bgColor} transition-transform duration-300 group-hover:scale-110 z-10`}>
                  {meta.icon}
                </div>

                {/* Timeline Card */}
                <div className="glass-card rounded-2xl p-5 shadow-lg relative flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  {/* Action Description */}
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-3">
                      <h4 className="font-semibold text-text-main text-sm tracking-wide">
                        {log.action}
                      </h4>
                      <span className="text-[10px] text-text-muted font-medium">
                        {localTimeStr}
                      </span>
                    </div>
                    
                    {log.taskId && (
                      <div className="bg-input-main border border-border-main px-2.5 py-1 rounded-lg inline-flex items-center">
                        <span className="text-[9px] font-mono text-text-muted">
                          Task ID: <span className="text-purple-400">{log.taskId}</span>
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Trigger User Profile */}
                  <div className="flex items-center gap-2.5 border-t border-border-main pt-3 md:border-t-0 md:pt-0 shrink-0">
                    <div className="w-8 h-8 rounded-lg bg-input-main border border-border-main flex items-center justify-center text-text-muted font-bold text-xs">
                      {initials}
                    </div>
                    <div>
                      <p className="text-[11px] font-semibold text-text-main">
                        {log.user?.name || "System automated"}
                      </p>
                      <p className="text-[9px] text-text-muted">
                        {log.user?.email || "internal@system.local"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default ActivityLogs
