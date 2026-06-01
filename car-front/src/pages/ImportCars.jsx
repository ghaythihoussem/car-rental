import { useState } from "react";
import axios from "axios";

export default function ImportCars() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // 🟢 file select
  const handleFile = (e) => {
    setFile(e.target.files[0]);
    setMessage("");
  };

  // 🟢 upload CSV
  const handleUpload = async () => {
    if (!file) {
      setMessage("❌ Please select a CSV file first");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    const token = localStorage.getItem("token"); // 🔑 مهم

    try {
      setLoading(true);

      const res = await axios.post(
        "http://localhost:5000/api/cars/import",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`, // 🔥 حل 401
          },
        }
      );

      setMessage(`🚗 Imported: ${res.data.count} cars`);
      setFile(null);
    } catch (err) {
      console.log(err);

      if (err.response?.status === 401) {
        setMessage("🚫 You need to login as an admin");
      } else {
        setMessage("❌ Error importing file");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      
      <div className="bg-white shadow-xl rounded-2xl p-8 w-105 text-center">

        <h1 className="text-2xl font-bold mb-6 text-gray-800">
          🚗 Import Cars CSV
        </h1>

        {/* FILE INPUT */}
        <input
          type="file"
          accept=".csv"
          onChange={handleFile}
          className="block w-full text-sm text-gray-600
                     file:mr-4 file:py-2 file:px-4
                     file:rounded-full file:border-0
                     file:text-sm file:font-semibold
                     file:bg-blue-50 file:text-blue-700
                     hover:file:bg-blue-100"
        />

        {/* FILE NAME */}
        {file && (
          <p className="mt-3 text-sm text-gray-600">
            📄 {file.name}
          </p>
        )}

        {/* BUTTON */}
        <button
          onClick={handleUpload}
          disabled={loading}
          className={`mt-6 w-full py-2 rounded-xl font-semibold transition
            ${loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700 text-white"
            }`}
        >
          {loading ? "Uploading..." : "Upload CSV 🚀"}
        </button>

        {/* MESSAGE */}
        {message && (
          <p className="mt-4 text-sm font-medium text-gray-700">
            {message}
          </p>
        )}

      </div>
    </div>
  );
}