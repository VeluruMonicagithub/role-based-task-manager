import { useState, useContext } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { 
  FiGrid, 
  FiCheckSquare, 
  FiUsers, 
  FiActivity, 
  FiLogOut, 
  FiMenu, 
  FiX, 
  FiMonitor,
  FiUser
} from "react-icons/fi"

import { AuthContext } from "../context/AuthContext"

const Layout = ({ children }) => {
  const { user, logout } = useContext(AuthContext)
  const [isOpen, setIsOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate("/")
  }

  const isAdmin = user?.role === "Admin"

  // Navigation Items
  const navItems = isAdmin 
    ? [
        { name: "Dashboard", path: "/admin/dashboard", icon: <FiGrid className="w-5 h-5" /> },
        { name: "User Management", path: "/admin/users", icon: <FiUsers className="w-5 h-5" /> },
        { name: "Task Monitoring", path: "/admin/tasks", icon: <FiMonitor className="w-5 h-5" /> },
        { name: "Activity Logs", path: "/admin/logs", icon: <FiActivity className="w-5 h-5" /> },
      ]
    : [
        { name: "Dashboard", path: "/dashboard", icon: <FiGrid className="w-5 h-5" /> },
        { name: "My Tasks", path: "/tasks", icon: <FiCheckSquare className="w-5 h-5" /> },
      ]

  // Get current page header name
  const getHeaderName = () => {
    const currentItem = navItems.find(item => item.path === location.pathname)
    return currentItem ? currentItem.name : "Vanguard"
  }

  const userInitials = user?.name
    ? user.name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2)
    : "U"

  return (
    <div className="min-h-screen flex bg-zinc-950 text-zinc-100 font-sans">
      {/* BACKGROUND DECORATIVE GRADIENTS */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl -z-10 pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl -z-10 pointer-events-none" />

      {/* DESKTOP SIDEBAR */}
      <aside className="hidden lg:flex flex-col w-64 glass-panel border-r border-zinc-800 shrink-0 sticky top-0 h-screen z-20">
        {/* Brand Header */}
        <div className="h-16 flex items-center px-6 border-b border-zinc-800 gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-purple-500 to-indigo-600 flex items-center justify-center font-bold text-white shadow-glow">
            V
          </div>
          <div>
            <span className="font-display font-bold text-lg bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent">
              VANGUARD
            </span>
            <span className="text-[10px] block text-zinc-500 -mt-1 font-semibold tracking-wider">
              {isAdmin ? "ADMIN CONTROL" : "TASK HUB"}
            </span>
          </div>
        </div>

        {/* Nav Links */}
        <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                  isActive
                    ? "bg-purple-600 text-white font-medium shadow-glow"
                    : "text-zinc-400 hover:bg-zinc-800/50 hover:text-zinc-200"
                }`}
              >
                <span className={`transition-transform duration-200 group-hover:scale-110 ${
                  isActive ? "text-white" : "text-zinc-400 group-hover:text-purple-400"
                }`}>
                  {item.icon}
                </span>
                <span>{item.name}</span>
              </Link>
            )
          })}
        </nav>

        {/* User Card & Logout Footer */}
        <div className="p-4 border-t border-zinc-800/80 bg-zinc-900/20">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600/30 to-indigo-600/30 border border-purple-500/30 flex items-center justify-center text-purple-400 font-bold text-sm">
              {userInitials}
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-semibold truncate text-zinc-200">{user?.name}</p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${
                  isAdmin 
                    ? "bg-purple-500/10 text-purple-400 border border-purple-500/20" 
                    : "bg-zinc-800 text-zinc-400 border border-zinc-700"
                }`}>
                  {user?.role}
                </span>
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
              </div>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg border border-zinc-800 hover:border-red-500/30 hover:bg-red-500/10 hover:text-red-400 transition-all text-xs text-zinc-400 font-medium cursor-pointer"
          >
            <FiLogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* MOBILE DRAWER */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 lg:hidden" onClick={() => setIsOpen(false)} />
      )}
      <aside className={`fixed top-0 bottom-0 left-0 w-64 glass-panel border-r border-zinc-800 flex flex-col z-40 transform transition-transform duration-300 lg:hidden ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      }`}>
        <div className="h-16 flex items-center justify-between px-6 border-b border-zinc-800">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-purple-500 to-indigo-600 flex items-center justify-center font-bold text-white">
              V
            </div>
            <span className="font-display font-bold text-lg tracking-wide text-zinc-100">
              VANGUARD
            </span>
          </div>
          <button onClick={() => setIsOpen(false)} className="text-zinc-400 hover:text-zinc-200">
            <FiX className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  isActive
                    ? "bg-purple-600 text-white font-medium"
                    : "text-zinc-400 hover:bg-zinc-800/50 hover:text-zinc-200"
                }`}
              >
                <span className={isActive ? "text-white" : "text-zinc-400"}>
                  {item.icon}
                </span>
                <span>{item.name}</span>
              </Link>
            )
          })}
        </nav>

        <div className="p-4 border-t border-zinc-800 bg-zinc-900/20">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 font-bold text-sm">
              {userInitials}
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-semibold truncate text-zinc-200">{user?.name}</p>
              <p className="text-[10px] text-zinc-500 truncate">{user?.email}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg border border-zinc-800 hover:border-red-500/30 hover:bg-red-500/10 hover:text-red-400 transition-all text-xs text-zinc-400 font-medium cursor-pointer"
          >
            <FiLogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* CONTENT AREA */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        {/* TOP NAVBAR */}
        <header className="h-16 flex items-center justify-between px-6 border-b border-zinc-800/80 sticky top-0 bg-zinc-950/80 backdrop-blur-md z-10">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsOpen(true)}
              className="lg:hidden p-2 rounded-lg text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900"
            >
              <FiMenu className="w-5 h-5" />
            </button>
            <h2 className="font-display font-bold text-lg text-zinc-200 lg:text-xl capitalize">
              {getHeaderName()}
            </h2>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 bg-zinc-900 border border-zinc-800 px-3 py-1.5 rounded-full text-xs">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-zinc-400 font-medium">Session Connected</span>
            </div>
            <div className="w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 transition-colors">
              <FiUser className="w-4 h-4" />
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6 md:p-8 overflow-y-auto max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  )
}

export default Layout
