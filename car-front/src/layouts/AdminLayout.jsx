import {
  Outlet,
  Link,
  useNavigate,
  useLocation,
} from "react-router-dom"

import {
  LayoutDashboard,
  CarFront,
  Users,
  CalendarDays,
  BarChart3,
  LogOut,
  ShieldCheck,
  Menu,
  X,
} from "lucide-react"

import { useState } from "react"

export default function AdminLayout() {
  const navigate = useNavigate()
  const location = useLocation()

  const [mobileOpen, setMobileOpen] = useState(false)

  const user = JSON.parse(localStorage.getItem("user"))

  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")

    navigate("/login")
  }

  const linkStyle = (path) =>
    `flex items-center gap-2 px-4 py-2 rounded-xl transition duration-300 ${
      location.pathname === path
        ? "bg-green-500/20 text-green-400 border border-green-500/20"
        : "hover:bg-white/5 text-white/80 hover:text-green-400"
    }`

  return (
    <div className="min-h-screen bg-[#050505] text-white">

      {/* TOP NAVBAR */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-black/70 border-b border-white/10">

        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">

          {/* LEFT */}
          <div className="flex items-center gap-4">

            <div className="bg-green-500/20 p-3 rounded-2xl shadow-lg shadow-green-500/10">
              <ShieldCheck className="text-green-400" />
            </div>

            <div>
              <h1 className="text-2xl font-extrabold">
                <span className="text-white">Admin</span>
                <span className="text-green-400">Panel</span>
              </h1>

              <p className="text-xs text-white/40">
                Car Rental Management
              </p>
            </div>
          </div>

          {/* DESKTOP MENU */}
          <div className="hidden lg:flex items-center gap-3">

            <Link
              to="/admin"
              className={linkStyle("/admin")}
            >
              <LayoutDashboard size={18} />
              Dashboard
            </Link>

            <Link
              to="/admin/add-car"
              className={linkStyle("/admin/add-car")}
            >
              <CarFront size={18} />
              Add Car
            </Link>

            <Link
              to="/admin/users"
              className={linkStyle("/admin/users")}
            >
              <Users size={18} />
              Users
            </Link>

            <Link
              to="/admin/reservations"
              className={linkStyle("/admin/reservations")}
            >
              <CalendarDays size={18} />
              Reservations
            </Link>

            <Link
              to="/admin/analytics"
              className={linkStyle("/admin/analytics")}
            >
              <BarChart3 size={18} />
              Analytics
            </Link>
            <Link
              to="/admin/import-cars"
              className={linkStyle("/admin/import-cars")}
            >
              <CarFront size={18} />
              Import Cars
            </Link>

          </div>

          {/* RIGHT */}
          <div className="hidden lg:flex items-center gap-4">

            <div className="bg-white/5 px-4 py-2 rounded-xl border border-white/10">
              <span className="text-sm text-white/70">
                {user?.name}
              </span>
            </div>

            <button
              onClick={handleLogout}
              className="flex items-center gap-2 bg-red-600 hover:bg-red-700 px-4 py-2 rounded-xl transition shadow-lg shadow-red-500/20"
            >
              <LogOut size={18} />
              Logout
            </button>

          </div>

          {/* MOBILE BUTTON */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden"
          >
            {mobileOpen ? <X /> : <Menu />}
          </button>

        </div>

        {/* MOBILE MENU */}
        {mobileOpen && (
          <div className="lg:hidden px-6 pb-6 animate-in fade-in slide-in-from-top-3 duration-300">

            <div className="bg-white/5 border border-white/10 rounded-3xl p-5 flex flex-col gap-3">

              <Link
                to="/admin"
                className={linkStyle("/admin")}
                onClick={() => setMobileOpen(false)}
              >
                <LayoutDashboard size={18} />
                Dashboard
              </Link>

              <Link
                to="/admin/add-car"
                className={linkStyle("/admin/add-car")}
                onClick={() => setMobileOpen(false)}
              >
                <CarFront size={18} />
                Add Car
              </Link>

              <Link
                to="/admin/users"
                className={linkStyle("/admin/users")}
                onClick={() => setMobileOpen(false)}
              >
                <Users size={18} />
                Users
              </Link>

              <Link
                to="/admin/reservations"
                className={linkStyle("/admin/reservations")}
                onClick={() => setMobileOpen(false)}
              >
                <CalendarDays size={18} />
                Reservations
              </Link>

              <Link
                to="/admin/analytics"
                className={linkStyle("/admin/analytics")}
                onClick={() => setMobileOpen(false)}
              >
                <BarChart3 size={18} />
                Analytics
              </Link>

              <button
                onClick={handleLogout}
                className="flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 py-3 rounded-xl mt-2"
              >
                <LogOut size={18} />
                Logout
              </button>

            </div>
          </div>
        )}
      </header>

      {/* PAGE CONTENT */}
      <main className="max-w-7xl mx-auto p-6">
        <Outlet />
      </main>

    </div>
  )
}