import { Link } from "react-router-dom"

export default function AdminSidebar() {
  const user = JSON.parse(localStorage.getItem("user"))

  return (
    <div className="w-64 h-screen bg-black/90 text-white border-r border-white/10 p-6 flex flex-col">

      {/* TITLE */}
      <h1 className="text-2xl font-bold mb-8 text-green-400">
        👑 Admin Panel
      </h1>

      {/* USER INFO */}
      <div className="mb-6 p-3 bg-white/5 rounded-xl">
        <p className="text-sm text-gray-400">Logged in as</p>
        <p className="font-bold">{user?.name}</p>
        <p className="text-green-400 text-sm">{user?.role}</p>
      </div>

      {/* LINKS */}
      <div className="flex flex-col gap-4">

        <Link
          to="/admin"
          className="hover:bg-white/10 p-2 rounded-lg transition"
        >
          📊 Dashboard
        </Link>

        <Link
          to="/admin/add-car"
          className="hover:bg-white/10 p-2 rounded-lg transition"
        >
          ➕ Add Car
        </Link>
        <Link to="/admin/users">
            👥 Users
        </Link>

        <Link
          to="/cars"
          className="hover:bg-white/10 p-2 rounded-lg transition"
        >
          🚗 View Cars
        </Link>

        <Link
          to="/profile"
          className="hover:bg-white/10 p-2 rounded-lg transition"
        >
          👤 Profile
        </Link>

      </div>

      {/* FOOTER */}
      <div className="mt-auto text-xs text-gray-500">
        Car Rental Admin v1.0
      </div>

    </div>
  )
}