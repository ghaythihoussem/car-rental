import express from "express"
import mongoose from "mongoose"
import dotenv from "dotenv"
import cors from "cors"

import User from "./models/User.js"
import authRoutes from "./routes/auth.js"
import carRoutes from "./routes/cars.js"
import { verifyToken } from "./middleware/authMiddleware.js"
import adminRoutes from "./routes/admin.js"
import reservationRoutes from "./routes/reservationRoutes.js"

dotenv.config()

const app = express()

// middlewares
app.use(cors())
app.use(express.json())

// IMPORTANT
app.use("/uploads", express.static("uploads"))

app.get("/", (req, res) => {
  res.send("Backend API Running 🚗");
})

// routes
app.use("/api/auth", authRoutes)
app.use("/api/cars", carRoutes)
app.use("/api/admin", verifyToken, adminRoutes)
app.use("/api/reservations", reservationRoutes)

// profile
app.get("/api/profile", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password")
    res.json({ user })
  } catch (err) {
    res.status(500).json(err)
  }
})

// DB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected 🚀"))
  .catch(err => console.log(err))

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} 🚀`);
});