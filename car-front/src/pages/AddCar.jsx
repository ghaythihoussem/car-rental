import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function AddCar() {
  const navigate = useNavigate();

  const [car, setCar] = useState({
    name: "",
    brand: "",
    category: "",
    pricePerDay: "",
    year: "",
    description: ""
  });

  const [images, setImages] = useState([]);

  const handleChange = (e) => {
    setCar({ ...car, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem("token");

      const formData = new FormData();

      // text fields
      formData.append("name", car.name);
      formData.append("brand", car.brand);
      formData.append("category", car.category);
      formData.append("pricePerDay", car.pricePerDay);
      formData.append("year", car.year);
      formData.append("description", car.description);

      // images
      images.forEach((img) => {
        formData.append("images", img);
      });

      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/cars/add`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data"
          }
        }
      );

      navigate("/admin");
    } catch (err) {
      console.log("Upload error:", err);
      alert("Failed to add car");
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center p-6">

      <div className="w-full max-w-xl bg-white/10 p-6 rounded-2xl border border-white/10">

        <h1 className="text-3xl font-bold text-center mb-6">
          ➕ Add Car
        </h1>

        <div className="grid gap-3">

          <input
            name="name"
            placeholder="Name"
            onChange={handleChange}
            className="p-3 rounded bg-black/40"
          />

          <input
            name="brand"
            placeholder="Brand"
            onChange={handleChange}
            className="p-3 rounded bg-black/40"
          />

          <select
            name="category"
            onChange={handleChange}
            className="p-3 rounded bg-black/40"
          >
            <option value="">Select Category</option>
            <option value="SUV">SUV</option>
            <option value="Sedan">Sedan</option>
            <option value="Sport">Sport</option>
            <option value="Luxury">Luxury</option>
            <option value="Electric">Electric</option>
            <option value="Truck">Truck</option>
          </select>

          <input
            name="pricePerDay"
            placeholder="Price"
            onChange={handleChange}
            className="p-3 rounded bg-black/40"
          />

          <input
            name="year"
            placeholder="Year"
            onChange={handleChange}
            className="p-3 rounded bg-black/40"
          />

          <input
            type="file"
            multiple
            accept="image/*"
            onChange={(e) => setImages(Array.from(e.target.files))}
            className="p-3 rounded bg-black/40"
          />

          <textarea
            name="description"
            placeholder="Description"
            onChange={handleChange}
            className="p-3 rounded bg-black/40"
          />

          <button
            onClick={handleSubmit}
            className="bg-green-600 hover:bg-green-700 py-3 rounded-xl font-bold"
          >
            Add Car
          </button>

        </div>
      </div>
    </div>
  );
}