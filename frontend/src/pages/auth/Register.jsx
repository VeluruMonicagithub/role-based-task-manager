import { useState } from "react"
import { useNavigate } from "react-router-dom"

import api from "../../services/api"

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  })

  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()

    await api.post("/auth/register", formData)
    navigate("/")
  }

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded shadow-md w-96"
      >
        <h2 className="text-2xl font-bold mb-4">Register</h2>

        <input
          type="text"
          placeholder="Name"
          className="border p-2 w-full mb-4"
          onChange={(e) =>
            setFormData({ ...formData, name: e.target.value })
          }
        />
          <input
          type="email"
          placeholder="Email"
          className="border p-2 w-full mb-4"
          onChange={(e) =>
            setFormData({ ...formData, email: e.target.value })
          }
        />

        <input
          type="password"
          placeholder="Password"
          className="border p-2 w-full mb-4"
          onChange={(e) =>
            setFormData({ ...formData, password: e.target.value })
          }
        />
        <button className="bg-green-500 text-white px-4 py-2 w-full">
          Register
        </button>
      </form>
    </div>
  )
}

export default Register
