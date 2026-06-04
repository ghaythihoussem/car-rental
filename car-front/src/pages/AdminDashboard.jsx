import { useEffect, useState } from "react"
import axios from "axios"
import { Link } from "react-router-dom"

export default function AdminDashboard() {
  const [cars, setCars] = useState([])
  const [editingCar, setEditingCar] = useState(null)
  const [imageFiles, setImageFiles] = useState([])
  const [loading, setLoading] = useState(true)

  const token = localStorage.getItem("token")

  // 🚗 GET CARS
  const fetchCars = async () => {
    try {
      setLoading(true)

      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/cars`)

      const fixed = res.data.map(car => ({
        ...car,
        images: car.images?.length
          ? car.images
          : car.image
          ? [car.image]
          : []
      }))

      setCars(fixed)
    } catch (err) {
      console.log(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCars()
  }, [])

  // 🗑 DELETE
  const deleteCar = async (id) => {
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/cars/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })

      setCars(prev => prev.filter(c => c._id !== id))
    } catch (err) {
      console.log(err)
    }
  }

  // ✏️ UPDATE INFO
  const updateCar = async () => {
    try {
      const res = await axios.put(
        `${import.meta.env.VITE_API_URL}/api/cars/${editingCar._id}`,
        editingCar,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      )

      setCars(prev =>
        prev.map(c => c._id === editingCar._id ? res.data : c)
      )

      setEditingCar(null)
    } catch (err) {
      console.log(err)
    }
  }

  // 🖼️ UPDATE IMAGES
  const updateImages = async () => {
    try {
      const formData = new FormData()

      imageFiles.forEach(img => {
        formData.append("images", img)
      })

      const res = await axios.put(
        `${import.meta.env.VITE_API_URL}/api/cars/${editingCar._id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data"
          }
        }
      )

      setCars(prev =>
        prev.map(c => c._id === editingCar._id ? res.data : c)
      )

      setEditingCar(null)
      setImageFiles([])

    } catch (err) {
      console.log(err)
    }
  }

  return (
    <div className="min-h-screen flex bg-gray-950 text-white">

      {/* SIDEBAR */}
      <div className="w-40 bg-black/40 p-6 border-r border-white/10">
        <h1 className="text-2xl font-bold mb-8">👑Admin</h1>

        <div className="flex flex-col gap-4">
          <Link to="/admin">Dashboard</Link>
          <Link to="/admin/add-car">➕ Add Car</Link>
          <Link to="/admin/users">👥 Users</Link>
          <Link to="/admin/reservations">📅Reservations</Link>
          <Link to="/admin/analytics">📊 Analytics</Link>
          <Link to="/admin/import-cars">📁 Import Cars</Link>
        </div>
      </div>

      {/* MAIN */}
      <div className="flex-1 p-8">

        {/* STATS */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-white/10 p-5 rounded-xl">
            Total Cars: {cars.length}
          </div>
          <div className="bg-white/10 p-5 rounded-xl">
            Available: {cars.filter(c => c.available).length}
          </div>
          <div className="bg-white/10 p-5 rounded-xl">
            Unavailable: {cars.filter(c => !c.available).length}
          </div>
        </div>

        {/* LOADING */}
        {loading ? (
          <p className="text-gray-400">Loading cars...</p>
        ) : (
          <div className="grid md:grid-cols-3 gap-6">

            {cars.map(car => (
              <div key={car._id} className="bg-white/10 rounded-xl overflow-hidden">

                {/* IMAGE */}
                <img
                  src={car.images?.[0] || "https://via.placeholder.com/400"}
                  className="h-40 w-full object-cover"
                />

                <div className="p-4">
                  <h2 className="font-bold">{car.name}</h2>
                  <p className="text-gray-400">{car.brand}</p>

                  <p className="text-green-400 mt-2">
                    ${car.pricePerDay}/day
                  </p>

                  <div className="flex gap-2 mt-4">

                    <button
                      onClick={() => setEditingCar(car)}
                      className="w-1/2 bg-blue-600 py-2 rounded"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => deleteCar(car._id)}
                      className="w-1/2 bg-red-600 py-2 rounded"
                    >
                      Delete
                    </button>

                  </div>
                </div>
              </div>
            ))}

          </div>
        )}

        {/* MODAL */}
        {editingCar && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">

            <div className="bg-gray-900 p-6 rounded-xl w-96">

              <h2 className="text-xl font-bold mb-4">
                ✏️ Edit Car
              </h2>

              {/* NAME */}
              <input
                className="w-full mb-2 p-2 bg-black/40"
                value={editingCar.name}
                onChange={(e) =>
                  setEditingCar({ ...editingCar, name: e.target.value })
                }
              />

              {/* PRICE */}
              <input
                className="w-full mb-3 p-2 bg-black/40"
                value={editingCar.pricePerDay}
                onChange={(e) =>
                  setEditingCar({ ...editingCar, pricePerDay: e.target.value })
                }
              />

              {/* OLD IMAGES */}
              <div className="flex gap-2 mb-3">
                {editingCar.images?.map((img, i) => (
                  <img
                    key={i}
                    src={img}
                    className="w-12 h-12 object-cover rounded"
                  />
                ))}
              </div>

              {/* NEW IMAGES */}
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={(e) => setImageFiles([...e.target.files])}
                className="mb-3"
              />

              <div className="flex gap-2 mb-4">
                {imageFiles.map((file, i) => (
                  <img
                    key={i}
                    src={URL.createObjectURL(file)}
                    className="w-12 h-12 object-cover rounded"
                  />
                ))}
              </div>

              {/* BUTTONS */}
              <div className="flex gap-2">

                <button
                  onClick={updateCar}
                  className="w-1/2 bg-blue-600 py-2 rounded"
                >
                  Save Info
                </button>

                <button
                  onClick={updateImages}
                  className="w-1/2 bg-green-600 py-2 rounded"
                >
                  Save Images
                </button>

              </div>

              <button
                onClick={() => {
                  setEditingCar(null)
                  setImageFiles([])
                }}
                className="w-full mt-2 bg-gray-600 py-2 rounded"
              >
                Cancel
              </button>

            </div>
          </div>
        )}

      </div>
    </div>
  )
}