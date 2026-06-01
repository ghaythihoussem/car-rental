import { useEffect, useState } from "react"
import axios from "axios"

export default function AdminAnalytics() {
  const [data, setData] = useState(null)

  const token = localStorage.getItem("token")

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await axios.get(
          "http://localhost:5000/api/reservations/admin/analytics",
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        )

        setData(res.data)
      } catch (err) {
        console.log(err.response?.data)
      }
    }

    fetchAnalytics()
  }, [token])

  if (!data)
    return <p className="text-white p-6">Loading analytics...</p>

  return (
    <div className="min-h-screen bg-gray-950 text-white p-6">

      <h1 className="text-3xl font-bold mb-6">
        📊 Admin Analytics
      </h1>

      {/* STATS CARDS */}
      <div className="grid md:grid-cols-4 gap-4">

        <div className="bg-white/10 p-5 rounded-xl">
          <p className="text-gray-400">Total Reservations</p>
          <h2 className="text-2xl font-bold">{data.totalReservations}</h2>
        </div>

        <div className="bg-white/10 p-5 rounded-xl">
          <p className="text-gray-400">Revenue</p>
          <h2 className="text-2xl font-bold text-green-400">
            ${data.totalRevenue}
          </h2>
        </div>

        <div className="bg-green-500/20 p-5 rounded-xl">
          <p className="text-gray-400">Confirmed</p>
          <h2 className="text-2xl font-bold">{data.confirmed}</h2>
        </div>

        <div className="bg-yellow-500/20 p-5 rounded-xl">
          <p className="text-gray-400">Pending</p>
          <h2 className="text-2xl font-bold">{data.pending}</h2>
        </div>

      </div>

      {/* CANCELLED */}
      <div className="mt-6 bg-red-500/20 p-5 rounded-xl w-64">
        <p className="text-gray-400">Cancelled</p>
        <h2 className="text-2xl font-bold">{data.cancelled}</h2>
      </div>

      {/* TOP CARS */}
      <div className="mt-10">
        <h2 className="text-2xl font-bold mb-4">
           Top Rented Cars
        </h2>

        <div className="space-y-3">
          {data.topCars.map((car, i) => (
            <div
              key={i}
              className="bg-white/10 p-4 rounded-xl flex justify-between"
            >
              <span>{car.name}</span>
              <span className="text-blue-400">{car.count} bookings</span>
            </div>
          ))}
        </div>
      </div>

    </div>
  )
}