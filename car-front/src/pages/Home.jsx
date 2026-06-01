import { useEffect, useState } from "react"
import axios from "axios"
import { Link } from "react-router-dom"

export default function Home() {
  const [cars, setCars] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchCars = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/cars")
        setCars(res.data.slice(0, 6))
      } catch (err) {
        console.log(err)
      } finally {
        setLoading(false)
      }
    }

    fetchCars()
  }, [])

  return (
    <div className="min-h-screen bg-gray-950 text-white">

      {/* HERO FULL SCREEN */}
      <div className="relative h-screen flex items-center justify-center text-center px-6">

        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1503376780353-7e6692767b70"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/60" />
        </div>

        <div className="relative z-10">
          <h1 className="text-5xl md:text-6xl font-bold mb-4">
            Rent Your Dream Car
          </h1>

          <p className="text-gray-300 mb-6">
            Fast • Safe • Affordable car rental experience
          </p>

          <Link to="/cars">
            <button className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-xl font-bold">
              Browse Cars
            </button>
          </Link>
        </div>
      </div>

      {/* STATS */}
      <div className="py-14 bg-linear-to-r from-gray-900 via-gray-800 to-gray-900">

        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 px-6">

          <div className="relative overflow-hidden rounded-2xl bg-white/5 border border-white/10 p-8 text-center hover:scale-105 transition">
            <div className="absolute inset-0 bg-blue-500/10 blur-3xl"></div>
            <h2 className="text-5xl font-bold">120+</h2>
            <p className="text-gray-300">Available Cars</p>
          </div>

          <div className="relative overflow-hidden rounded-2xl bg-white/5 border border-white/10 p-8 text-center hover:scale-105 transition">
            <div className="absolute inset-0 bg-green-500/10 blur-3xl"></div>
            <h2 className="text-5xl font-bold">500+</h2>
            <p className="text-gray-300">Happy Users</p>
          </div>

          <div className="relative overflow-hidden rounded-2xl bg-white/5 border border-white/10 p-8 text-center hover:scale-105 transition">
            <div className="absolute inset-0 bg-purple-500/10 blur-3xl"></div>
            <h2 className="text-5xl font-bold">24/7</h2>
            <p className="text-gray-300">Support</p>
          </div>

        </div>
      </div>

      {/* FEATURED CARS */}
      <div className="p-6">
        <h2 className="text-3xl font-bold mb-6 text-center">
          ⭐ Featured Cars
        </h2>

        {loading ? (
          <p className="text-center text-gray-400">Loading...</p>
        ) : (
          <div className="grid md:grid-cols-3 gap-6">

            {cars.map((car) => (
              <div
                key={car._id}
                className="bg-white/10 border border-white/10 rounded-2xl overflow-hidden hover:scale-105 transition"
              >

                <img
                  src={car.images?.[0] || "https://via.placeholder.com/400"}
                  className="h-48 w-full object-cover"
                />

                <div className="p-4">
                  <h2 className="text-xl font-bold">{car.brand}</h2>
                  <p className="text-gray-400">{car.name}</p>

                  <p className="text-green-400 font-bold mt-2">
                    ${car.pricePerDay} / day
                  </p>

                  <Link to={`/cars/${car._id}`}>
                    <button className="mt-4 w-full bg-blue-600 hover:bg-blue-700 py-2 rounded-xl">
                      View Details
                    </button>
                  </Link>
                </div>

              </div>
            ))}

          </div>
        )}
      </div>

      {/* WHY US */}
      <div className="p-10 text-center bg-black/40 mt-10">
        <h2 className="text-3xl font-bold mb-6">Why Choose Us?</h2>

        <div className="grid md:grid-cols-3 gap-6 text-gray-300">
          <div>🚀 Fast Booking</div>
          <div>💰 Best Prices</div>
          <div>🔒 Secure & Trusted</div>
        </div>
      </div>
    </div>
  )
}