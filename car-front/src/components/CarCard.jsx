import { useState } from "react"
import { Link } from "react-router-dom"

function CarCard({ car }) {
  const [liked, setLiked] = useState(false)

  return (
    <div className="relative bg-white/10 border border-white/10 text-white rounded-2xl overflow-hidden shadow-lg hover:scale-105 transition duration-300">

      {/* ❤️ */}
      <button
        onClick={() => setLiked(!liked)}
        className="absolute top-3 right-3 text-2xl z-10"
      >
        {liked ? "❤️" : "🤍"}
      </button>

      {/* 🚗 IMAGE (SAFE FIX STEP 4) */}
      <img
        src={
          car.images?.length > 0
            ? car.images[0]
            : "https://via.placeholder.com/400"
        }
        alt={car.name}
        className="w-full h-56 object-cover"
      />

      <div className="p-5">

        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">{car.brand}</h2>

          <span className="text-xs px-3 py-1 bg-blue-600 rounded-full">
            {car.category}
          </span>
        </div>

        <p className="text-gray-300 mt-1">
          {car.model || car.name}
        </p>

        <div className="flex justify-between items-center mt-2 text-sm">
          <p className="text-gray-400">Year: {car.year}</p>

          <span
            className={`px-2 py-1 rounded-full text-xs ${
              car.available ? "bg-green-600" : "bg-red-600"
            }`}
          >
            {car.available ? "Available" : "Booked"}
          </span>
        </div>

        <p className="text-xl font-bold text-green-400 mt-3">
          ${car.pricePerDay} / day
        </p>

        <Link to={`/cars/${car._id}`}>
          <button className="mt-4 w-full bg-blue-600 hover:bg-blue-700 py-2 rounded-xl transition font-semibold">
            View Details
          </button>
        </Link>

      </div>
    </div>
  )
}

export default CarCard