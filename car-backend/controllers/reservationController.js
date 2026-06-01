import Reservation from "../models/Reservation.js"
import Car from "../models/Car.js"

export const createReservation = async (req, res) => {
  try {
    const { carId, startDate, endDate } = req.body

    // check car exists
    const car = await Car.findById(carId)
    if (!car) {
      return res.status(404).json({ message: "Car not found" })
    }

    // parse dates
    const start = new Date(startDate)
    const end = new Date(endDate)

    if (end <= start) {
      return res.status(400).json({ message: "Invalid dates" })
    }

    // 🚨 DOUBLE BOOKING CHECK (FIXED)
    const hasConflict = await Reservation.findOne({
      car: carId,
      status: "confirmed",
      startDate: { $lt: end },
      endDate: { $gt: start }
    })

    if (hasConflict) {
      return res.status(400).json({
        message: "Car is already booked in this period"
      })
    }

    // calculate days
    const days = Math.ceil(
      (end - start) / (1000 * 60 * 60 * 24)
    )

    const totalPrice = days * car.pricePerDay

    // create reservation
    const reservation = await Reservation.create({
      user: req.user.id,
      car: carId,
      startDate,
      endDate,
      totalPrice
    })

    return res.status(201).json(reservation)

  } catch (err) {
    return res.status(500).json({ message: err.message })
  }
}

export const getMyReservations = async (req, res) => {
  try {
    const data = await Reservation.find({ user: req.user.id })
      .populate("car")
      .sort({ createdAt: -1 })

    return res.json(data)

  } catch (err) {
    return res.status(500).json({ message: err.message })
  }
}

export const getAllReservationsAdmin = async (req, res) => {
  try {
    const data = await Reservation.find()
      .populate("user", "name email")
      .populate("car")
      .sort({ createdAt: -1 })

    return res.json(data)

  } catch (err) {
    return res.status(500).json({ message: err.message })
  }
}

export const updateReservationStatus = async (req, res) => {
  try {
    const { status } = req.body

    const allowedStatuses = ["pending", "confirmed", "cancelled"]

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status" })
    }

    const updated = await Reservation.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    )
      .populate("user", "name email")
      .populate("car")

    if (!updated) {
      return res.status(404).json({ message: "Reservation not found" })
    }

    return res.json(updated)

  } catch (err) {
    return res.status(500).json({ message: err.message })
  }
}

export const deleteReservation = async (req, res) => {
  try {
    const resv = await Reservation.findById(req.params.id)

    if (!resv) {
      return res.status(404).json({ message: "Reservation not found" })
    }

    const isOwner = resv.user.toString() === req.user.id
    const isAdminUser = req.user.role === "admin"

    if (!isOwner && !isAdminUser) {
      return res.status(403).json({ message: "Not allowed" })
    }

    await resv.deleteOne()

    return res.json({ message: "Reservation deleted" })

  } catch (err) {
    return res.status(500).json({ message: err.message })
  }
}

export const getAnalytics = async (req, res) => {
  try {
    const reservations = await Reservation.find().populate("car")

    const totalReservations = reservations.length

    const totalRevenue = reservations.reduce(
      (sum, r) => sum + r.totalPrice,
      0
    )

    const confirmed = reservations.filter(
      (r) => r.status === "confirmed"
    ).length

    const pending = reservations.filter(
      (r) => r.status === "pending"
    ).length

    const cancelled = reservations.filter(
      (r) => r.status === "cancelled"
    ).length

    const carCount = {}

    reservations.forEach((r) => {
      const name = r.car?.name || "Unknown"
      carCount[name] = (carCount[name] || 0) + 1
    })

    const topCars = Object.entries(carCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([name, count]) => ({ name, count }))

    return res.json({
      totalReservations,
      totalRevenue,
      confirmed,
      pending,
      cancelled,
      topCars
    })

  } catch (err) {
    return res.status(500).json({ message: err.message })
  }
}

export const getCarAvailability = async (req, res) => {
  try {
    const { carId } = req.params

    const reservations = await Reservation.find({
      car: carId,
      status: "confirmed"
    }).select("startDate endDate")

    return res.json(reservations)

  } catch (err) {
    return res.status(500).json({ message: err.message })
  }
}