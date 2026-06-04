import { useEffect, useState } from "react"
import axios from "axios"
import { useNavigate } from "react-router-dom"

export default function Profile() {
  const [user, setUser] = useState(null)

  const navigate = useNavigate()

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token")

        if (!token) {
          navigate("/login")
          return
        }

        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/profile`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        )

        setUser(res.data.user)

      } catch (err) {
        console.log(err)

        localStorage.removeItem("token")
        navigate("/login")
      }
    }

    fetchProfile()
  }, [navigate])

  const handleLogout = () => {
    localStorage.removeItem("token")
    navigate("/login")
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-black via-gray-900 to-gray-800 text-white">

      {/* NAVBAR */}
      <div className="flex justify-between items-center px-8 py-5 border-b border-white/10 backdrop-blur-lg bg-white/5">

        <h1 className="text-2xl font-bold">
          🚗 Car Rental
        </h1>

        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 px-5 py-2 rounded-xl transition"
        >
          Logout
        </button>
      </div>

      {/* PROFILE CARD */}
      <div className="flex items-center justify-center py-16 px-4">

        <div className="w-full max-w-2xl bg-white/10 border border-white/10 rounded-3xl p-8 backdrop-blur-xl shadow-2xl">

          {/* Avatar */}
          <div className="flex flex-col items-center">

            <div className="w-28 h-28 rounded-full bg-linear-to-r from-blue-500 to-purple-500 flex items-center justify-center text-4xl font-bold shadow-lg">
              {user?.name?.charAt(0).toUpperCase()}
            </div>

            <h2 className="text-3xl font-bold mt-4">
              {user?.name}
            </h2>

            <p className="text-gray-300 mt-1">
              {user?.email}
            </p>

            <span className="mt-3 px-4 py-1 rounded-full bg-green-500/20 text-green-400 border border-green-500/30">
              {user?.role}
            </span>

          </div>

          {/* INFO */}
          <div className="grid md:grid-cols-2 gap-6 mt-10">

            <div className="bg-white/5 p-5 rounded-2xl border border-white/10">
              <h3 className="text-gray-400 text-sm mb-2">
                User ID
              </h3>

              <p className="font-semibold break-all">
                {user?.id}
              </p>
            </div>

            <div className="bg-white/5 p-5 rounded-2xl border border-white/10">
              <h3 className="text-gray-400 text-sm mb-2">
                Account Role
              </h3>

              <p className="font-semibold">
                {user?.role}
              </p>
            </div>

          </div>

        </div>
      </div>
    </div>
  )
}