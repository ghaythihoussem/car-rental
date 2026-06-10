import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";

function CarDetails() {
  const { id } = useParams();

  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  /* =========================
     🚗 FETCH CAR
  ========================= */
  useEffect(() => {
    const fetchCar = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/cars/${id}`
        );
        setCar(res.data);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCar();
  }, [id]);

  /* reset slider when car changes */
  useEffect(() => {
    setCurrentIndex(0);
  }, [car]);

  /* =========================
     ⏳ LOADING
  ========================= */
  if (loading) {
    return (
      <div className="text-white text-center mt-10">
        Loading car...
      </div>
    );
  }

  /* =========================
     ❌ NOT FOUND
  ========================= */
  if (!car) {
    return (
      <div className="text-red-500 text-center mt-10">
        Car not found
      </div>
    );
  }

  /* =========================
     🖼️ SAFE IMAGES
  ========================= */
  const images =
    Array.isArray(car.images) && car.images.length
      ? car.images
      : ["https://via.placeholder.com/600"];

  /* =========================
     ▶ NEXT / PREV
  ========================= */
  const nextImage = () => {
    setCurrentIndex((prev) =>
      prev === images.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setCurrentIndex((prev) =>
      prev === 0 ? images.length - 1 : prev - 1
    );
  };

  return (
    <div className="max-w-5xl mx-auto px-4 text-white">

      {/* SLIDER */}
      <div className="relative mt-6">

        <img
          src={images[currentIndex]}
          className="w-full h-112.5 object-cover rounded-2xl transition-all duration-300"
          alt="car"
        />

        {/* ARROWS */}
        <button
          onClick={prevImage}
          className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/60 px-3 py-2 rounded-full hover:bg-black"
        >
          ◀
        </button>

        <button
          onClick={nextImage}
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/60 px-3 py-2 rounded-full hover:bg-black"
        >
          ▶
        </button>

        {/* DOTS */}
        <div className="flex justify-center gap-2 mt-4">
          {images.map((_, i) => (
            <div
              key={i}
              onClick={() => setCurrentIndex(i)}
              className={`w-2.5 h-2.5 rounded-full cursor-pointer transition ${
                i === currentIndex ? "bg-white" : "bg-gray-500"
              }`}
            />
          ))}
        </div>
      </div>

      {/* INFO */}
      <div className="mt-8">
        <h1 className="text-4xl font-bold">
          {car.brand} {car.name}
        </h1>

        <p className="text-gray-400 mt-2">
          Year: {car.year}
        </p>

        <p className="text-green-400 text-2xl font-bold mt-4">
          ${car.pricePerDay} / day
        </p>

        <p className="text-gray-300 mt-4 leading-relaxed">
          {car.description}
        </p>

        <Link to={car?._id ? `/reserve/${car._id}` : "#"}>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl mt-6 transition">
            Reserve Now 🚗
          </button>
        </Link>
      </div>
    </div>
  );
}

export default CarDetails;