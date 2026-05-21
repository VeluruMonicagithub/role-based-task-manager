import { useEffect, useState } from "react"

import api from "../../services/api"

const UserManagement = () => {
  const [users, setUsers] = useState([])

  const fetchUsers = async () => {
    const { data } = await api.get("/admin/users")

    setUsers(data)
  }

  useEffect(() => {
    fetchUsers()
  }, [])
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Users</h1>

      <table className="w-full border">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Status</th>
          </tr>
        </thead>
<tbody>
          {users.map((user) => (
            <tr key={user._id}>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.role}</td>
              <td>{user.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
export default UserManagement
