import express from "express"
import { verifyToken } from "../middleware/authMiddleware.js"
import { isAdmin } from "../middleware/adminMiddleware.js"

import {
  createReservation,
  getMyReservations,
  getAllReservationsAdmin,
  updateReservationStatus,
  deleteReservation,
  getAnalytics,
  getCarAvailability
} from "../controllers/reservationController.js"

const router = express.Router()

// USER
router.post("/", verifyToken, createReservation)
router.get("/my", verifyToken, getMyReservations)

// ADMIN
router.get("/admin", verifyToken, isAdmin, getAllReservationsAdmin)
router.put("/admin/:id", verifyToken, isAdmin, updateReservationStatus)
router.get("/admin/analytics", verifyToken, isAdmin, getAnalytics)
router.get("/availability/:carId", verifyToken, getCarAvailability)

// DELETE (user or admin logic inside controller)
router.delete("/:id", verifyToken, deleteReservation)

export default router