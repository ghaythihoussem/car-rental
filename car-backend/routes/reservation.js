import express from "express"
import Reservation from "../models/Reservation.js"
import Car from "../models/Car.js"
import { verifyToken } from "../middleware/authMiddleware.js"

const router = express.Router()

// ➕ CREATE RESERVATION
router.post("/", verifyToken, async (req, res) => {
  try {
    const { carId, from, to } = req.body

    const car = await Car.findById(carId)
    if (!car) return res.status(404).json("Car not found")

    const days =
      (new Date(to) - new Date(from)) / (1000 * 60 * 60 * 24)

    const totalPrice = days * car.pricePerDay

    const reservation = await Reservation.create({
      user: req.user.id,
      car:carId,
      from,
      to,
      totalPrice
    })

    res.json(reservation)
  } catch (err) {
    res.status(500).json(err.message)
  }
})

router.delete("/:id", verifyToken, async (req, res) => {
  try {
    const reservation = await Reservation.findById(req.params.id)

    if (!reservation) {
      return res.status(404).json({ message: "Reservation not found" })
    }

    // 🔥 FIX: user field correct
    if (reservation.user.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not allowed" })
    }

    await reservation.deleteOne()

    res.json({ message: "Reservation cancelled successfully" })

  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})


export default router