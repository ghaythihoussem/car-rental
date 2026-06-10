import { useEffect, useState } from "react";
import axios from "axios";
import CarCard from "../components/CarCard";

export default function Cars() {
  const [cars, setCars] = useState([]);
  const [selected, setSelected] = useState("All");
  const [loading, setLoading] = useState(true);

  const categories = [
    "All",
    "SUV",
    "Sedan",
    "Sport",
    "Luxury",
    "Electric",
    "Truck",
  ];

  /* =========================
     🚗 FETCH CARS
  ========================= */
  useEffect(() => {
    const fetchCars = async () => {
      try {
        setLoading(true);

        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/cars`
        );

        /* 🔥 NORMALIZE DATA (Cloudinary safe) */
        const fixedData = res.data.map((car) => ({
          ...car,
          images: Array.isArray(car.images)
            ? car.images
            : car.image
            ? [car.image]
            : [],
        }));

        setCars(fixedData);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCars();
  }, []);

  /* =========================
     🔥 FILTER
  ========================= */
  const filteredCars =
    selected === "All"
      ? cars
      : cars.filter((car) => car.category === selected);

  return (
    <div className="min-h-screen bg-gray-950 text-white p-6">

      {/* HEADER */}
      <h1 className="text-4xl font-bold text-center mb-6">
        Our Cars Collection 🚗
      </h1>

      {/* CATEGORIES */}
      <div className="flex flex-wrap gap-3 justify-center mb-10">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelected(cat)}
            className={`px-4 py-2 rounded-xl transition ${
              selected === cat
                ? "bg-blue-600"
                : "bg-white/10 hover:bg-white/20"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* LOADING */}
      {loading ? (
        <p className="text-center text-gray-400">Loading cars...</p>
      ) : filteredCars.length === 0 ? (
        <p className="text-center text-gray-400">
          No cars found 😢
        </p>
      ) : (
        /* GRID */
        <div className="grid md:grid-cols-3 gap-6">
          {filteredCars.map((car) => (
            <CarCard key={car._id} car={car} />
          ))}
        </div>
      )}
    </div>
  );
}