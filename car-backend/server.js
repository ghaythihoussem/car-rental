import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";

import User from "./models/User.js";
import authRoutes from "./routes/auth.js";
import carRoutes from "./routes/carRoutes.js";
import { verifyToken } from "./middleware/authMiddleware.js";
import adminRoutes from "./routes/admin.js";
import reservationRoutes from "./routes/reservationRoutes.js";

dotenv.config();

// Validate required environment variables
const requiredEnvVars = ["MONGO_URI", "JWT_SECRET", "PORT"];
const missingEnvVars = requiredEnvVars.filter((envVar) => !process.env[envVar]);

if (missingEnvVars.length > 0) {
  console.error(`❌ Missing required environment variables: ${missingEnvVars.join(", ")}`);
  process.exit(1);
}

const app = express();

// CORS configuration - allow local frontend and deployed frontend origins
const allowedOrigins = [
  process.env.FRONTEND_URL,
  process.env.FRONTEND_URL_2,
  "https://car-rental-hazel-seven.vercel.app",
  "http://localhost:3000",
  "http://localhost:5173",
  "http://127.0.0.1:5173",
].filter(Boolean);

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    callback(new Error(`CORS policy does not allow origin ${origin}`));
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

// middlewares
app.use(cors(corsOptions));
app.options(cors(corsOptions));
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Backend API Running 🚗");
});

// routes
app.use("/api/auth", authRoutes);
app.use("/api/cars", carRoutes);
app.use("/api/admin", verifyToken, adminRoutes);
app.use("/api/reservations", reservationRoutes);

// profile
app.get("/api/profile", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json({ user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected 🚀"))
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  });

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} 🚀`);
});