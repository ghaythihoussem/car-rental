import { useState } from "react"
import axios from "axios"
import { useNavigate } from "react-router-dom"

export default function Signup() {
  const navigate = useNavigate()

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: ""
  })

  const [errors, setErrors] = useState({})

  // 🧠 FRONT VALIDATION
  const validate = () => {
    let newErrors = {}

    // NAME
    if (!form.name) {
      newErrors.name = "Name is required"
    }

    // EMAIL FORMAT
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!form.email) {
      newErrors.email = "Email is required"
    } else if (!emailRegex.test(form.email)) {
      newErrors.email = "Invalid email format"
    }

    // PASSWORD
    if (!form.password) {
      newErrors.password = "Password is required"
    } else if (form.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSignup = async () => {
    if (!validate()) return

    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/signup`, form)

      alert("Account created 🚀")
      navigate("/login")

    } catch (err) {
      const msg = err.response?.data?.message

      // 💥 backend errors handling
      if (msg === "User already exists") {
        setErrors({ email: "Email already exists" })
      } else {
        alert(msg || "Signup failed")
      }
    }
  }

  return (
    <div className="bg-[url('/src/assets/camaro.jpg')] min-h-screen bg-cover bg-center flex items-center justify-center">

      <div className="w-full max-w-md p-8 rounded-2xl backdrop-blur-xl shadow-2xl border border-white/20">

        <h1 className="text-3xl font-bold text-white text-center mb-6">
          Create Account
        </h1>

        {/* NAME */}
        <input
          className="w-full mb-1 p-3 rounded bg-black/40 text-white"
          placeholder="Full name"
          value={form.name}
          onChange={(e) =>
            setForm({ ...form, name: e.target.value })
          }
        />
        {errors.name && (
          <p className="text-red-400 text-sm mb-2">
            {errors.name}
          </p>
        )}

        {/* EMAIL */}
        <input
          className="w-full mb-1 p-3 rounded bg-black/40 text-white"
          placeholder="Email"
          value={form.email}
          onChange={(e) =>
            setForm({ ...form, email: e.target.value })
          }
        />
        {errors.email && (
          <p className="text-red-400 text-sm mb-2">
            {errors.email}
          </p>
        )}

        {/* PASSWORD */}
        <input
          type="password"
          className="w-full mb-1 p-3 rounded bg-black/40 text-white"
          placeholder="Password"
          value={form.password}
          onChange={(e) =>
            setForm({ ...form, password: e.target.value })
          }
        />
        {errors.password && (
          <p className="text-red-400 text-sm mb-4">
            {errors.password}
          </p>
        )}

        {/* BUTTON */}
        <button
          onClick={handleSignup}
          className="w-full bg-green-600 hover:bg-green-700 py-3 rounded-xl font-bold text-white"
        >
          Create account
        </button>

      </div>
    </div>
  )
}