import { Link, useNavigate, useLocation } from "react-router-dom"
import { Menu, X, CarFront, UserCircle2 } from "lucide-react"
import { useState } from "react"

function Navbar() {
  const navigate = useNavigate()
  const location = useLocation()

  const [mobileOpen, setMobileOpen] = useState(false)

  const user = JSON.parse(localStorage.getItem("user"))

  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    navigate("/login")
  }

  const navLink = (path) =>
    `relative transition duration-300 hover:text-blue-400 ${
      location.pathname === path
        ? "text-blue-400"
        : "text-white/90"
    }`

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-xl bg-black/70 border-b border-white/10 shadow-2xl">

      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

        {/* LOGO */}
        <Link
          to="/"
          className="flex items-center gap-3 group"
        >
          <div className="bg-blue-600 p-2 rounded-2xl shadow-lg shadow-blue-500/30 group-hover:scale-110 transition">
            <CarFront size={24} />
          </div>

          <div>
            <h1 className="text-2xl font-extrabold tracking-wide">
              <span className="text-white">Car</span>
              <span className="text-blue-500">Zone</span>
            </h1>

            <p className="text-[11px] text-white/40 -mt-1">
              Premium Car Rental
            </p>
          </div>
        </Link>

        {/* DESKTOP MENU */}
        <div className="hidden md:flex items-center gap-8">

          <Link className={navLink("/")} to="/">
            Home
          </Link>

          <Link className={navLink("/cars")} to="/cars">
            Cars
          </Link>

          <Link
            className={navLink("/my-reservations")}
            to="/my-reservations"
          >
            Reservations
          </Link>

          {user?.role === "admin" && (
            <Link
              className="bg-green-500/15 text-green-400 px-4 py-2 rounded-xl border border-green-500/20 hover:bg-green-500/25 transition"
              to="/admin"
            >
              Admin Panel
            </Link>
          )}

          {!user ? (
            <div className="flex items-center gap-3">

              <Link
                to="/login"
                className="px-5 py-2 rounded-xl border border-white/10 hover:bg-white/5 transition"
              >
                Login
              </Link>

              <Link
                to="/signup"
                className="bg-blue-600 hover:bg-blue-700 px-5 py-2 rounded-xl font-semibold shadow-lg shadow-blue-600/20 transition"
              >
                Signup
              </Link>

            </div>
          ) : (
            <div className="flex items-center gap-4">

              <Link
                to="/profile"
                className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-xl hover:bg-white/10 transition"
              >
                <UserCircle2 size={20} />
                <span>{user.name}</span>
              </Link>

              <button
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-xl font-medium transition shadow-lg shadow-red-600/20"
              >
                Logout
              </button>

            </div>
          )}
        </div>

        {/* MOBILE BUTTON */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden text-white"
        >
          {mobileOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* MOBILE MENU */}
      {mobileOpen && (
        <div className="md:hidden px-6 pb-6 animate-in fade-in slide-in-from-top-3 duration-300">

          <div className="bg-white/5 border border-white/10 rounded-3xl p-5 flex flex-col gap-5">

            <Link
              className={navLink("/")}
              to="/"
              onClick={() => setMobileOpen(false)}
            >
              Home
            </Link>

            <Link
              className={navLink("/cars")}
              to="/cars"
              onClick={() => setMobileOpen(false)}
            >
              Cars
            </Link>

            <Link
              className={navLink("/my-reservations")}
              to="/my-reservations"
              onClick={() => setMobileOpen(false)}
            >
              My Reservations
            </Link>

            {user?.role === "admin" && (
              <Link
                className="text-green-400"
                to="/admin"
                onClick={() => setMobileOpen(false)}
              >
                Admin Panel
              </Link>
            )}

            {!user ? (
              <>
                <Link
                  to="/login"
                  onClick={() => setMobileOpen(false)}
                  className="bg-white/5 py-3 rounded-xl text-center"
                >
                  Login
                </Link>

                <Link
                  to="/signup"
                  onClick={() => setMobileOpen(false)}
                  className="bg-blue-600 py-3 rounded-xl text-center font-semibold"
                >
                  Signup
                </Link>
              </>
            ) : (
              <>
                <Link
                  to="/profile"
                  onClick={() => setMobileOpen(false)}
                  className="bg-white/5 py-3 rounded-xl text-center"
                >
                  Profile
                </Link>

                <button
                  onClick={handleLogout}
                  className="bg-red-600 py-3 rounded-xl"
                >
                  Logout
                </button>
              </>
            )}

          </div>
        </div>
      )}
    </nav>
  )
}

export default Navbar