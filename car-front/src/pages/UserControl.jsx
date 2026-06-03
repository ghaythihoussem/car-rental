import { useEffect, useState } from "react"
import axios from "axios"

export default function UserControl() {
  const [users, setUsers] = useState([])
  const [editingUser, setEditingUser] = useState(null)

  const token = localStorage.getItem("token")

  // 👥 GET USERS
  const fetchUsers = async () => {
    const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/admin/users`, {
      headers: { Authorization: `Bearer ${token}` }
    })

    setUsers(res.data)
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  // ❌ DELETE USER
  const deleteUser = async (id) => {
    await axios.delete(`${import.meta.env.VITE_API_URL}/api/admin/users/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    })

    setUsers(users.filter(u => u._id !== id))
  }

  // ✏️ UPDATE USER ROLE
  const updateUser = async () => {
    const res = await axios.put(
      `${import.meta.env.VITE_API_URL}/api/admin/users/${editingUser._id}`,
      editingUser,
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    )

    setUsers(users.map(u =>
      u._id === editingUser._id ? res.data : u
    ))

    setEditingUser(null)
  }

  return (
    <div className="text-white">

      <h1 className="text-3xl font-bold mb-6">
        👥 Users Control
      </h1>

      {/* USERS LIST */}
      <div className="grid md:grid-cols-3 gap-6">

        {users.map(user => (
          <div key={user._id} className="bg-white/10 p-4 rounded-xl">

            <h2 className="font-bold">{user.name}</h2>
            <p className="text-gray-400">{user.email}</p>
            <p className="text-blue-400">{user.role}</p>

            <div className="flex gap-2 mt-3">

              {/* EDIT */}
              <button
                onClick={() => setEditingUser(user)}
                className="w-1/2 bg-blue-600 py-2 rounded"
              >
                Edit
              </button>

              {/* DELETE */}
              <button
                onClick={() => deleteUser(user._id)}
                className="w-1/2 bg-red-600 py-2 rounded"
              >
                Delete
              </button>

            </div>
          </div>
        ))}

      </div>

      {/* MODAL */}
      {editingUser && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center">

          <div className="bg-gray-900 p-6 rounded-xl w-96">

            <h2 className="text-xl font-bold mb-4">
              Edit User
            </h2>

            <input
              className="w-full p-2 mb-3 bg-black/40 text-gray-300"
              value={editingUser.name}
              disabled
            />

            <input
              className="w-full p-2 mb-3 bg-black/40 text-gray-300"
              value={editingUser.email}
              disabled
            />

            {/* ROLE */}
            <select
              className="w-full p-2 mb-4 bg-black/40"
              value={editingUser.role}
              onChange={(e) =>
                setEditingUser({
                  ...editingUser,
                  role: e.target.value
                })
              }
            >
              <option value="user">user</option>
              <option value="admin">admin</option>
            </select>

            <div className="flex gap-2">

              <button
                onClick={updateUser}
                className="w-1/2 bg-green-600 py-2 rounded"
              >
                Save
              </button>

              <button
                onClick={() => setEditingUser(null)}
                className="w-1/2 bg-gray-600 py-2 rounded"
              >
                Cancel
              </button>

            </div>

          </div>
        </div>
      )}

    </div>
  )
}