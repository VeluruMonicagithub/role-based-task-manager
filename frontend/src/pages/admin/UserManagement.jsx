import { useEffect, useState, useContext } from "react"
import { FiSearch, FiTrash2, FiToggleLeft, FiToggleRight, FiUsers, FiUserCheck, FiUserX, FiAlertCircle } from "react-icons/fi"

import api from "../../services/api"
import { AuthContext } from "../../context/AuthContext"

const UserManagement = () => {
  const [users, setUsers] = useState([])
  const { user: loggedInUser } = useContext(AuthContext)
  const [searchQuery, setSearchQuery] = useState("")
  const [loading, setLoading] = useState(true)

  const fetchUsers = async () => {
    try {
      const { data } = await api.get("/admin/users")
      setUsers(data)
    } catch (error) {
      console.error("Error fetching users", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  const handleStatusToggle = async (id, currentStatus) => {
    const updatedStatus = currentStatus === "Active" ? "Inactive" : "Active"
    
    try {
      await api.put(`/admin/users/${id}/status`, {
        status: updatedStatus,
      })
      fetchUsers()
    } catch (error) {
      console.error("Error toggling user status", error)
    }
  }

  const handleDelete = async (id) => {
    if (id === loggedInUser?.id) {
      alert("You cannot delete your own admin account.")
      return
    }

    if (!window.confirm("Are you absolutely sure you want to delete this user? This will delete all their records permanently.")) {
      return
    }

    try {
      await api.delete(`/admin/users/${id}`)
      fetchUsers()
    } catch (error) {
      console.error("Error deleting user", error)
    }
  }

  // Search filter processing
  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.email.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const activeCount = users.filter(u => u.status === "Active").length
  const inactiveCount = users.length - activeCount

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <span className="w-8 h-8 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Directory Summary Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Total Registered */}
        <div className="glass-card rounded-2xl p-4 flex items-center justify-between">
          <div>
            <p className="text-zinc-500 text-[10px] font-semibold uppercase tracking-wider">Total Accounts</p>
            <p className="text-2xl font-bold text-zinc-100 mt-1">{users.length}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-400">
            <FiUsers className="w-5 h-5" />
          </div>
        </div>

        {/* Active Accounts */}
        <div className="glass-card rounded-2xl p-4 flex items-center justify-between">
          <div>
            <p className="text-zinc-500 text-[10px] font-semibold uppercase tracking-wider">Active Users</p>
            <p className="text-2xl font-bold text-emerald-400 mt-1">{activeCount}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400">
            <FiUserCheck className="w-5 h-5" />
          </div>
        </div>

        {/* Suspended/Inactive */}
        <div className="glass-card rounded-2xl p-4 flex items-center justify-between">
          <div>
            <p className="text-zinc-500 text-[10px] font-semibold uppercase tracking-wider">Inactive/Suspended</p>
            <p className="text-2xl font-bold text-amber-500 mt-1">{inactiveCount}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-400">
            <FiUserX className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Control Bar */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <h3 className="font-display font-bold text-lg text-zinc-200 self-start sm:self-auto">
          User Database
        </h3>

        {/* Search */}
        <div className="relative w-full sm:max-w-xs">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-500">
            <FiSearch className="w-4 h-4" />
          </div>
          <input
            id="search-users"
            type="text"
            placeholder="Search by name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input-style w-full pl-9 pr-4 py-2 rounded-xl text-sm"
          />
        </div>
      </div>

      {/* Directory Table */}
      <div className="glass-panel rounded-3xl overflow-hidden shadow-xl border border-zinc-800">
        <div className="overflow-x-auto">
          {filteredUsers.length === 0 ? (
            <div className="p-12 text-center text-zinc-500 space-y-2">
              <FiAlertCircle className="w-8 h-8 mx-auto text-zinc-600" />
              <p className="font-semibold text-zinc-400">No users found</p>
              <p className="text-xs text-zinc-600">No accounts matched your search keyword.</p>
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-zinc-800 bg-zinc-900/30">
                  <th className="py-4 px-6 text-xs font-semibold uppercase tracking-wider text-zinc-400">Profile</th>
                  <th className="py-4 px-6 text-xs font-semibold uppercase tracking-wider text-zinc-400">Email Address</th>
                  <th className="py-4 px-6 text-xs font-semibold uppercase tracking-wider text-zinc-400 text-center">Role</th>
                  <th className="py-4 px-6 text-xs font-semibold uppercase tracking-wider text-zinc-400 text-center">Status</th>
                  <th className="py-4 px-6 text-xs font-semibold uppercase tracking-wider text-zinc-400 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-900/40">
                {filteredUsers.map((user) => {
                  const isSelf = user._id === loggedInUser?.id
                  const initials = user.name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2)
                  const isAdmin = user.role === "Admin"
                  const isActive = user.status === "Active"

                  return (
                    <tr key={user._id} className="hover:bg-zinc-900/20 transition-colors">
                      {/* Name Card */}
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs ${
                            isAdmin 
                              ? "bg-purple-500/10 text-purple-400 border border-purple-500/20" 
                              : "bg-zinc-800 text-zinc-400 border border-zinc-700/60"
                          }`}>
                            {initials}
                          </div>
                          <div>
                            <p className="font-semibold text-zinc-200 text-sm flex items-center gap-1.5">
                              <span>{user.name}</span>
                              {isSelf && (
                                <span className="text-[9px] bg-purple-500/20 text-purple-300 border border-purple-500/30 py-0.25 px-1.5 rounded-full font-bold uppercase tracking-wider">
                                  You
                                </span>
                              )}
                            </p>
                            <p className="text-[10px] text-zinc-500">Member since {new Date(user.createdAt).toLocaleDateString()}</p>
                          </div>
                        </div>
                      </td>

                      {/* Email */}
                      <td className="py-4 px-6 text-sm text-zinc-400">
                        {user.email}
                      </td>

                      {/* Role Badge */}
                      <td className="py-4 px-6 text-center">
                        <span className={`inline-flex py-0.5 px-2 rounded-full text-[10px] font-semibold uppercase tracking-wider border ${
                          isAdmin
                            ? "bg-purple-500/10 border-purple-500/20 text-purple-400 shadow-glow"
                            : "bg-zinc-800/80 border-zinc-700/60 text-zinc-400"
                        }`}>
                          {user.role}
                        </span>
                      </td>

                      {/* Status Badge */}
                      <td className="py-4 px-6 text-center">
                        <span className={`inline-flex items-center gap-1.5 py-0.5 px-2.5 rounded-full text-[10px] font-semibold border ${
                          isActive
                            ? "bg-emerald-500/10 border-emerald-500/25 text-emerald-400"
                            : "bg-red-500/10 border-red-500/25 text-red-400"
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${isActive ? "bg-emerald-500 animate-pulse" : "bg-red-500"}`} />
                          <span>{user.status}</span>
                        </span>
                      </td>

                      {/* Controls */}
                      <td className="py-4 px-6">
                        <div className="flex items-center justify-end gap-2.5">
                          {/* Toggle status */}
                          <button
                            onClick={() => handleStatusToggle(user._id, user.status)}
                            disabled={isSelf}
                            className={`flex items-center gap-1 py-1.5 px-3 rounded-lg text-xs font-semibold border transition-all cursor-pointer disabled:opacity-30 disabled:pointer-events-none ${
                              isActive
                                ? "bg-amber-500/10 border-amber-500/20 text-amber-400 hover:bg-amber-500/20"
                                : "bg-emerald-500/10 border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20"
                            }`}
                            title={isActive ? "Deactivate user" : "Activate user"}
                          >
                            {isActive ? (
                              <>
                                <FiToggleLeft className="w-4 h-4" />
                                <span>Suspend</span>
                              </>
                            ) : (
                              <>
                                <FiToggleRight className="w-4 h-4" />
                                <span>Activate</span>
                              </>
                            )}
                          </button>
                          
                          {/* Delete */}
                          <button
                            onClick={() => handleDelete(user._id)}
                            disabled={isSelf}
                            className="p-1.5 rounded-lg border border-zinc-800 hover:border-red-500/30 hover:bg-red-500/10 hover:text-red-400 transition-all text-zinc-500 disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
                            title="Delete user profile"
                          >
                            <FiTrash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  )
}

export default UserManagement
