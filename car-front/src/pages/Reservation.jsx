import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import axios from "axios"
import DatePicker from "react-datepicker"

import "react-datepicker/dist/react-datepicker.css"

export default function Reservation() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [car, setCar] = useState(null)
  const [loading, setLoading] = useState(true)

  const [startDate, setStartDate] = useState(null)
  const [endDate, setEndDate] = useState(null)
  const [blockedDates, setBlockedDates] = useState([])

  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [submitting, setSubmitting] = useState(false)

  const token = localStorage.getItem("token")

  // 🔐 auth
  useEffect(() => {
    if (!token) navigate("/login")
  }, [token, navigate])

  // 🚗 car
  useEffect(() => {
    const fetchCar = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/cars/${id}`
        )
        setCar(res.data)
      } catch (err) {
        console.log(err)
      } finally {
        setLoading(false)
      }
    }

    if (id) fetchCar()
  }, [id])

  // 📅 availability
  useEffect(() => {
    const fetchAvailability = async () => {
  try {
    const res = await axios.get(
      `http://localhost:5000/api/reservations/availability/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )

    setBlockedDates(res.data)

  } catch (err) {
    console.log(err)
  }
}

    if (id) fetchAvailability()
  }, [id])

  // 🧠 normalize
  const normalize = (d) => {
    const date = new Date(d)
    date.setHours(0, 0, 0, 0)
    return date
  }

  // 🚫 overlap
  const isBlocked = (date) => {
    return blockedDates.some((r) => {
      const start = normalize(r.startDate)
      const end = normalize(r.endDate)

      return date >= start && date <= end
    })
  }

  // 💰 price
  const totalPrice = (() => {
    if (!startDate || !endDate || !car) return 0

    const diff =
      normalize(endDate) - normalize(startDate)

    const days = Math.ceil(diff / (1000 * 60 * 60 * 24))

    return days > 0 ? days * car.pricePerDay : 0
  })()

  // 🚀 reserve
  const handleReserve = async () => {
    setError("")
    setSuccess("")

    if (!startDate || !endDate) {
      setError("Select dates first")
      return
    }

    const start = normalize(startDate)
    const end = normalize(endDate)

    if (end <= start) {
      setError("End date must be after start date")
      return
    }

    if (isBlocked(start) || isBlocked(end)) {
      setError("These dates are already booked 🚫")
      return
    }

    try {
      setSubmitting(true)

      await axios.post(
        "http://localhost:5000/api/reservations",
        {
          carId: car._id,
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString(),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      setSuccess("Reservation confirmed 🚗")

      setTimeout(() => {
        navigate("/my-reservations")
      }, 1200)

    } catch (err) {
      setError(err.response?.data?.message || "Reservation failed")
    } finally {
      setSubmitting(false)
    }
  }

  if (loading)
    return <p className="text-white">Loading...</p>

  if (!car)
    return <p className="text-red-500">Car not found</p>

  return (
    <div className="max-w-4xl mx-auto p-6 text-white">

      <h1 className="text-3xl font-bold mb-6">
        Reserve {car.brand} {car.name}
      </h1>

      {/* ALERTS */}
      {error && (
        <div className="bg-red-500/20 p-3 rounded mb-3">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-500/20 p-3 rounded mb-3">
          {success}
        </div>
      )}

      {/* DATE PICKER */}
      <div className="flex gap-4">

        <DatePicker
          selected={startDate}
          onChange={setStartDate}
          selectsStart
          startDate={startDate}
          endDate={endDate}
          minDate={new Date()}
          excludeDateIntervals={blockedDates.map((b) => ({
            start: normalize(b.startDate),
            end: normalize(b.endDate),
          }))}

          dayClassName={(date) =>
            isBlocked(normalize(date))
              ? "blocked-day"
              : ""
          }

          className="p-3 bg-black/40 rounded"
          placeholderText="Start date"
        />

        <DatePicker
          selected={endDate}
          onChange={setEndDate}
          selectsEnd
          startDate={startDate}
          endDate={endDate}
          minDate={startDate || new Date()}
          excludeDateIntervals={blockedDates.map((b) => ({
            start: normalize(b.startDate),
            end: normalize(b.endDate),
          }))}

          dayClassName={(date) =>
            isBlocked(normalize(date))
              ? "blocked-day"
              : ""
          }

          className="p-3 bg-black/40 rounded"
          placeholderText="End date"
        />

      </div>

      {/* PRICE */}
      <div className="mt-6 text-green-400 font-bold text-xl">
        Total: ${totalPrice}
      </div>

      {/* BUTTON */}
      <button
        onClick={handleReserve}
        disabled={submitting}
        className="mt-6 w-full py-3 bg-blue-600 rounded-xl"
      >
        {submitting ? "Processing..." : "Confirm Reservation"}
      </button>

    </div>
  )
}