import { useState } from "react"
import axios from "axios"
import { useNavigate } from "react-router-dom"

export default function Login() {
  const navigate = useNavigate()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)

  const handleLogin = async () => {
    if (!email || !password) {
      alert("Fill all fields")
      return
    }

    try {
      setLoading(true)

      const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/login`, {
        email,
        password
      })

      // 🔑 save token
      localStorage.setItem("token", res.data.token)

      // 👤 save user (important for role/admin)
      localStorage.setItem("user", JSON.stringify(res.data.user))

      // 🚀 redirect based on role
      if (res.data.user.role === "admin") {
        navigate("/admin")
      } else {
        navigate("/profile")
      }

    } catch (err) {
      console.log(err.response?.data)
      alert(err.response?.data || "Login failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    //<div className="min-h-screen flex items-center justify-center bg-linear-to-br from-gray-900 via-gray-800 to-black">
    <div className="bg-[url('/src/assets/gclass.jpg')] min-h-screen bg-cover bg-center flex items-center justify-center">

      <div className="w-full max-w-md bg-white/10 backdrop-blur-xl p-8 rounded-2xl shadow-2xl border border-white/20">

        <h1 className="text-3xl font-bold text-white text-center mb-2">
          Welcome Back 👋
        </h1>

        <p className="text-gray-300 text-center mb-6">
          Login to continue
        </p>

        {/* EMAIL */}
        <input
          className="w-full mb-4 px-4 py-3 rounded-xl bg-white/10 text-white placeholder-gray-400 outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        {/* PASSWORD */}
        <input
          className="w-full mb-6 px-4 py-3 rounded-xl bg-white/10 text-white placeholder-gray-400 outline-none focus:ring-2 focus:ring-blue-500"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {/* BUTTON */}
        <button
          onClick={handleLogin}
          disabled={loading}
          className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 transition text-white font-semibold shadow-lg disabled:opacity-50"
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        {/* FOOTER */}
        <p className="text-center text-gray-400 mt-5 text-sm">
          Don’t have an account?{" "}
          <span
            onClick={() => navigate("/signup")}
            className="text-blue-400 cursor-pointer"
          >
            Sign up
          </span>
        </p>

      </div>
    </div>
  )
}