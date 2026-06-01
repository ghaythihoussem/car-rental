import { Outlet } from "react-router-dom"

import Navbar from "../components/Navbar"
import Footer from "../components/Footer"

function MainLayout() {
  return (
    <div className="bg-gray-950 text-white min-h-screen flex flex-col">

      {/* USER NAVBAR */}
      <Navbar />

      {/* PAGE CONTENT */}
      <main className="flex-1 p-8">
        <Outlet />
      </main>

      {/* FOOTER */}
      <Footer />

    </div>
  )
}

export default MainLayout