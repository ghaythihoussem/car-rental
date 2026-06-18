import { useState } from "react";
import axios from "axios";

export default function ImportCars() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  /* =========================
     📂 SELECT FILE
  ========================= */
  const handleFile = (e) => {
    setFile(e.target.files[0]);
    setMessage("");
  };

  /* =========================
     🚀 UPLOAD CSV
  ========================= */
  const handleUpload = async () => {
    if (!file) {
      setMessage("❌ Please select a CSV file first");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    const token = localStorage.getItem("token");

    try {
      setLoading(true);

      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/cars/import`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setMessage(`🚗 Imported: ${res.data.count} cars successfully`);
      setFile(null);
    } catch (err) {
      console.log(err);

      if (err.response?.status === 401) {
        setMessage("🚫 Unauthorized: login as admin required");
      } else {
        setMessage("❌ Error importing CSV file");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-950 text-white">

      <div className="bg-white/10 border border-white/10 shadow-xl rounded-2xl p-8 w-96 text-center">

        <h1 className="text-2xl font-bold mb-6">
          🚗 Import Cars CSV
        </h1>

        {/* FILE INPUT */}
        <input
          type="file"
          accept=".csv"
          onChange={handleFile}
          className="block w-full text-sm text-gray-300
                     file:mr-4 file:py-2 file:px-4
                     file:rounded-full file:border-0
                     file:text-sm file:font-semibold
                     file:bg-blue-600 file:text-white
                     hover:file:bg-blue-700"
        />

        {/* FILE NAME */}
        {file && (
          <p className="mt-3 text-sm text-gray-300">
            📄 {file.name}
          </p>
        )}

        {/* BUTTON */}
        <button
          onClick={handleUpload}
          disabled={loading}
          className={`mt-6 w-full py-2 rounded-xl font-semibold transition ${
            loading
              ? "bg-gray-500 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {loading ? "Uploading..." : "Upload CSV 🚀"}
        </button>

        {/* MESSAGE */}
        {message && (
          <p className="mt-4 text-sm font-medium text-gray-300">
            {message}
          </p>
        )}

      </div>
    </div>
  );
}