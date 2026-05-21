import { useContext, useState } from "react"
import { useNavigate } from "react-router-dom"

import api from "../../services/api"
import { AuthContext } from "../../context/AuthContext"

const Login = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const { login } = useContext(AuthContext)

  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
        const { data } = await api.post("/auth/login", {
        email,
        password,
      })

      login(data)

      if (data.user.role === "Admin") {
        navigate("/admin/dashboard")
      } else {
        navigate("/dashboard")
      }
    } catch (error) {
      alert(error.response.data.message)
    }
  }
return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded shadow-md w-96"
      >
        <h2 className="text-2xl font-bold mb-4">Login</h2>

        <input
          type="email"
          placeholder="Email"
          className="border p-2 w-full mb-4"
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          className="border p-2 w-full mb-4"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button className="bg-blue-500 text-white px-4 py-2 w-full">
          Login
        </button>
      </form>
    </div>
  )
}

export default Login