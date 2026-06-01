import { Routes, Route } from "react-router-dom"
import "react-datepicker/dist/react-datepicker.css"
import { useEffect } from "react"

import MainLayout from "./layouts/MainLayout"
import AdminLayout from "./layouts/AdminLayout"

import ProtectedRoute from "./routes/ProtectedRoute"

// Pages
import Home from "./pages/Home"
import Cars from "./pages/Cars"
import CarDetails from "./pages/CarDetails"
import Login from "./pages/Login"
import Signup from "./pages/Signup"
import Profile from "./pages/Profile"
import Reservation from "./pages/Reservation"
import MyReservations from "./pages/MyReservations"

import UserControl from "./pages/UserControl"
import AdminReservations from "./pages/AdminReservations"
import AdminAnalytics from "./pages/AdminAnalytics"
import AdminDashboard from "./pages/AdminDashboard"
import AddCar from "./pages/AddCar"
import ImportCars from "./pages/ImportCars";

function App() {
    useEffect(() => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
  }, [])
  return (
    <Routes>

      {/* ================= USER AREA ================= */}
      <Route element={<MainLayout />}>

        {/* Home */}
        <Route path="/" element={<Home />} />

        {/* Cars */}
        <Route path="/cars" element={<Cars />} />
        <Route path="/cars/:id" element={<CarDetails />} />

        {/* Auth */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Protected USER routes */}
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        <Route
          path="/reserve/:id"
          element={
            <ProtectedRoute>
              <Reservation />
            </ProtectedRoute>
          }
        />

        <Route
          path="/my-reservations"
          element={
            <ProtectedRoute>
              <MyReservations />
            </ProtectedRoute>
          }
        />

      </Route>

      {/* ================= ADMIN AREA ================= */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute role="admin">
            <AdminLayout />
          </ProtectedRoute>
        }
      >

        <Route index element={<AdminDashboard />} />

        <Route path="add-car" element={<AddCar />} />
        <Route path="import-cars" element={<ImportCars />} />
        <Route path="users" element={<UserControl />} />
        <Route path="reservations" element={<AdminReservations />} />
        <Route path="analytics" element={<AdminAnalytics />} />

      </Route>

      {/* ================= 404 ================= */}
      <Route path="*" element={<div>404 Not Found 🚫</div>} />

    </Routes>
  )
}

export default App