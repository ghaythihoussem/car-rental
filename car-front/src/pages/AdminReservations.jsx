import { useEffect, useState } from "react"
import axios from "axios"

export default function AdminReservations() {
  const [reservations, setReservations] = useState([])
  const [loading, setLoading] = useState(true)

  const token = localStorage.getItem("token")

  // =========================
  // 📦 GET ALL RESERVATIONS
  // =========================
  const fetchReservations = async () => {
    try {
      setLoading(true)

      const res = await axios.get(
        "http://localhost:5000/api/reservations/admin",
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      )

      setReservations(res.data)
    } catch (err) {
      console.log(err.response?.data || err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchReservations()
  }, [token])

  // =========================
  // 🔄 UPDATE STATUS
  // =========================
  const updateStatus = async (id, status) => {
    try {
      const res = await axios.put(
        `http://localhost:5000/api/reservations/admin/${id}`,
        { status },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      )

      // live update UI
      setReservations(prev =>
        prev.map(r => (r._id === id ? res.data : r))
      )
    } catch (err) {
      console.log(err.response?.data || err.message)
    }
  }

  // =========================
  // ❌ DELETE RESERVATION
  // =========================
  const deleteReservation = async (id) => {
    try {
      await axios.delete(
        `http://localhost:5000/api/reservations/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      )

      setReservations(prev => prev.filter(r => r._id !== id))
    } catch (err) {
      console.log(err.response?.data || err.message)
    }
  }

  // =========================
  // 🎨 STATUS COLOR
  // =========================
  const statusColor = (status) => {
    switch (status) {
      case "confirmed":
        return "bg-green-500"
      case "cancelled":
        return "bg-red-500"
      default:
        return "bg-yellow-500"
    }
  }

  if (loading)
    return <p className="text-white p-6">Loading reservations...</p>

  return (
    <div className="min-h-screen bg-gray-950 text-white p-6">

      {/* HEADER */}
      <h1 className="text-3xl font-bold mb-6">
        👑 Admin Reservations
      </h1>

      {/* GRID */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

        {reservations.map(res => (
          <div
            key={res._id}
            className="bg-white/10 border border-white/10 rounded-2xl p-5 hover:scale-[1.02] transition"
          >

            {/* USER */}
            <h2 className="font-bold text-lg">
              👤 {res.user?.name}
            </h2>

            <p className="text-gray-400 text-sm">
              {res.user?.email}
            </p>

            {/* CAR */}
            <div className="mt-3">
              <p className="font-semibold">
                🚗 {res.car?.brand} {res.car?.name}
              </p>
              <p className="text-gray-400 text-sm">
                ${res.car?.pricePerDay}/day
              </p>
            </div>

            {/* DATES */}
            <div className="mt-3 text-sm text-gray-300">
              <p>From: {new Date(res.startDate).toLocaleDateString()}</p>
              <p>To: {new Date(res.endDate).toLocaleDateString()}</p>
            </div>

            {/* PRICE */}
            <p className="mt-2 text-green-400 font-bold">
              ${res.totalPrice}
            </p>

            {/* STATUS */}
            <div className="mt-3">
              <span
                className={`px-3 py-1 rounded-full text-xs ${statusColor(
                  res.status
                )}`}
              >
                {res.status}
              </span>
            </div>

            {/* ACTIONS */}
            <div className="flex gap-2 mt-4">

              <button
                onClick={() => updateStatus(res._id, "confirmed")}
                className="flex-1 bg-green-600 hover:bg-green-700 py-2 rounded-lg text-sm"
              >
                Approve
              </button>

              <button
                onClick={() => updateStatus(res._id, "cancelled")}
                className="flex-1 bg-yellow-600 hover:bg-yellow-700 py-2 rounded-lg text-sm"
              >
                Cancel
              </button>

            </div>

            {/* DELETE */}
            <button
              onClick={() => deleteReservation(res._id)}
              className="w-full mt-3 bg-red-600 hover:bg-red-700 py-2 rounded-lg text-sm"
            >
              Delete
            </button>

          </div>
        ))}

      </div>
    </div>
  )
}