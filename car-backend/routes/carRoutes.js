import express from "express"
import Car from "../models/Car.js"
import { upload } from "../middleware/upload.js"

const router = express.Router()

router.post("/add", upload.array("images", 10), async (req, res) => {
  try {
    console.log("👉 BODY:", req.body)
    console.log("👉 FILES:", req.files)

    const images = req.files?req.files.map(
      (file) => `http://localhost:5000/uploads/${file.filename}`
    ): []

    const car = await Car.create({
      ...req.body,
      images
    })

    res.json(car)

  } catch (err) {
  console.log("🔥 ERROR:", err)
  res.status(500).json({ message: err.message })
}
})

export default router