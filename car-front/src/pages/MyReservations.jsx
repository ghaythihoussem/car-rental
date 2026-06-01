import { useEffect, useState } from "react"
import axios from "axios"

function MyReservations() {
  const [reservations, setReservations] = useState([])
  const [loading, setLoading] = useState(true)

  const token = localStorage.getItem("token")

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const res = await axios.get(
          "http://localhost:5000/api/reservations/my",
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        )
        setReservations(res.data)
      } catch (err) {
        console.log(err)
      } finally {
        setLoading(false)
      }
    }

    if (token) {
      fetchReservations()
    } else {
      setLoading(false)
    }
  }, [token])

  if (loading) {
    return (
      <p className="text-white p-6">
        Loading...
      </p>
    )
  }

  return (
    <div className="text-white p-6">
      <h1 className="text-3xl mb-6">My Reservations</h1>

      {reservations.length === 0 ? (
        <p>No reservations yet</p>
      ) : (
        reservations.map((r) => (
          <div
            key={r._id}
            className="bg-gray-800 p-4 rounded mb-3"
          >
            <p>🚗 {r.car?.name}</p>

            <p>
              📅{" "}
              {new Date(r.startDate).toLocaleDateString()} →{" "}
              {new Date(r.endDate).toLocaleDateString()}
            </p>

            <p>💰 {r.totalPrice}$</p>
            <p>🔥 {r.status}</p>
          </div>
        ))
      )}
    </div>
  )
}

export default MyReservations