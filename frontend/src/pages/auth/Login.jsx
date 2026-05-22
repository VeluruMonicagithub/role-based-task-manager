import { useContext, useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { FiMail, FiLock, FiAlertCircle, FiSun, FiMoon, FiEye, FiEyeOff } from "react-icons/fi"

import api from "../../services/api"
import { AuthContext } from "../../context/AuthContext"
import { ThemeContext } from "../../context/ThemeContext"

const Login = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [activeRole, setActiveRole] = useState("User") // "User" or "Admin"
  const [showPassword, setShowPassword] = useState(false)

  const { login } = useContext(AuthContext)
  const { theme, toggleTheme } = useContext(ThemeContext)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    
    if (!email.trim() || !password.trim()) {
      setError("Please fill in all fields")
      return
    }

    setLoading(true)
    try {
      const { data } = await api.post("/auth/login", {
        email,
        password,
      })

      // Ensure that the logged in account matches the selected portal role
      if (data.user.role !== activeRole) {
        if (activeRole === "Admin") {
          setError("Access Denied: This account does not have Admin privileges.")
        } else {
          setError("Access Denied: Please use the Admin Portal tab to sign in.")
        }
        setLoading(false)
        return
      }

      login(data)

      if (data.user.role === "Admin") {
        navigate("/admin/dashboard")
      } else {
        navigate("/dashboard")
      }
    } catch (err) {
      setError(err.response?.data?.message || "Invalid email or password")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative min-h-[100dvh] w-full flex items-center justify-center bg-bg-main px-4 py-6 overflow-y-auto sm:overflow-hidden transition-colors duration-300">
      {/* Decorative Blur Spheres (Shift colors dynamically based on activeRole) */}
      <div className={`absolute top-1/4 left-1/4 w-80 h-80 rounded-full blur-3xl -z-10 transition-all duration-700 ${
        activeRole === "Admin" ? "bg-purple-600/15" : "bg-blue-600/15"
      }`} />
      <div className={`absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full blur-3xl -z-10 transition-all duration-700 ${
        activeRole === "Admin" ? "bg-pink-600/15" : "bg-indigo-600/15"
      }`} />

      {/* Floating Theme Toggle Switch */}
      <button
        id="theme-toggle"
        type="button"
        onClick={toggleTheme}
        className="absolute top-6 right-6 p-3 rounded-2xl border border-border-main bg-glass-main text-text-muted hover:text-text-main backdrop-blur-md transition-all cursor-pointer shadow-md hover:scale-105 active:scale-95"
        title={theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
      >
        {theme === "dark" ? <FiSun className="w-5 h-5" /> : <FiMoon className="w-5 h-5" />}
      </button>

      <div className="w-full max-w-md my-auto">
        {/* Logo Icon / Title */}
        <div className="text-center mb-3 md:mb-4">
          <div className={`inline-flex items-center justify-center w-10 h-10 md:w-12 md:h-12 rounded-2xl bg-gradient-to-tr font-black text-lg md:text-xl text-white shadow-glow mb-2 transition-all duration-500 ${
            activeRole === "Admin"
              ? "from-purple-500 to-pink-600 shadow-purple-500/20"
              : "from-blue-500 to-indigo-600 shadow-indigo-500/20"
          }`}>
            V
          </div>
          <h1 className="font-display font-bold text-xl md:text-2xl tracking-tight text-text-main">
            {activeRole === "Admin" ? "Vanguard Admin Portal" : "Vanguard Workspace"}
          </h1>
          <p className="text-text-muted text-xs mt-0.5 transition-colors">
            {activeRole === "Admin"
              ? "Secure administrator cockpit & system logs"
              : "Access your collaborative task manager workspace"}
          </p>
        </div>

        {/* Card */}
        <div className="glass-card rounded-2xl p-5 md:p-6 shadow-xl relative">
          
          {/* Segmented Role Selector */}
          <div className="grid grid-cols-2 p-1 bg-input-main rounded-xl border border-border-main mb-3.5 transition-colors">
            <button
              id="role-select-user"
              type="button"
              onClick={() => {
                setActiveRole("User")
                setError("")
              }}
              className={`py-1.5 px-3 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all duration-300 cursor-pointer ${
                activeRole === "User"
                  ? "bg-gradient-to-r from-blue-500/20 to-indigo-500/20 text-blue-500 dark:text-blue-400 border border-blue-500/30 shadow-sm"
                  : "text-text-muted hover:text-text-main border border-transparent"
              }`}
            >
              User Login
            </button>
            <button
              id="role-select-admin"
              type="button"
              onClick={() => {
                setActiveRole("Admin")
                setError("")
              }}
              className={`py-1.5 px-3 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all duration-300 cursor-pointer ${
                activeRole === "Admin"
                  ? "bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-600 dark:text-purple-400 border border-purple-500/30 shadow-sm"
                  : "text-text-muted hover:text-text-main border border-transparent"
              }`}
            >
              Admin Login
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3">
            {error && (
              <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/20 text-red-500 dark:text-red-400 px-3 py-2 rounded-xl text-xs animate-pulse">
                <FiAlertCircle className="w-4 h-4 shrink-0" />
                <span className="font-medium truncate">{error}</span>
              </div>
            )}

            {/* Email Field */}
            <div className="space-y-0.5">
              <label className="text-[10px] font-semibold uppercase tracking-wider text-text-muted">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-text-muted">
                  <FiMail className="w-4 h-4" />
                </div>
                <input
                  id="login-email"
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-style w-full pl-11 pr-4 py-2 rounded-xl text-sm"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-0.5">
              <div className="flex items-center justify-between">
                <label className="text-[10px] font-semibold uppercase tracking-wider text-text-muted">
                  Password
                </label>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-text-muted">
                  <FiLock className="w-4 h-4" />
                </div>
                <input
                  id="login-password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-style w-full pl-11 pr-11 py-2 rounded-xl text-sm"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-text-muted hover:text-text-main cursor-pointer transition-colors"
                  title={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <FiEyeOff className="w-4.5 h-4.5" /> : <FiEye className="w-4.5 h-4.5" />}
                </button>
              </div>
            </div>

            {/* Login Button */}
            <button
              id="login-submit"
              type="submit"
              disabled={loading}
              className={`w-full text-white font-medium py-2 rounded-xl hover:scale-[1.01] active:scale-100 transition-all text-sm flex items-center justify-center gap-2 disabled:opacity-75 disabled:pointer-events-none cursor-pointer shadow-lg hover:shadow-xl ${
                activeRole === "Admin"
                  ? "bg-gradient-to-r from-purple-600 to-pink-600 shadow-purple-600/25"
                  : "bg-gradient-to-r from-blue-600 to-indigo-600 shadow-indigo-600/25"
              }`}
            >
              {loading ? (
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                `Sign In as ${activeRole}`
              )}
            </button>
          </form>

          {/* Form Footer */}
          <div className="text-center mt-4 pt-3 border-t border-border-main text-xs">
            <span className="text-text-muted">Don't have an account? </span>
            <Link 
              to="/register" 
              className={`font-semibold transition-colors ${
                activeRole === "Admin" ? "text-purple-500 dark:text-purple-400 hover:text-purple-450 dark:hover:text-purple-300" : "text-blue-500 dark:text-blue-400 hover:text-blue-450 dark:hover:text-blue-300"
              }`}
            >
              Create one now
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login