import express from "express"
import User from "../models/User.js"

const router = express.Router()

// 👥 GET ALL USERS
router.get("/users", async (req, res) => {
  try {
    const users = await User.find().select("-password")
    res.json(users)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// ✏️ UPDATE USER ROLE
router.put("/users/:id", async (req, res) => {
  try {

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        role: req.body.role
      },
      { new: true }
    ).select("-password")

    res.json(updatedUser)

  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// ❌ DELETE USER
router.delete("/users/:id", async (req, res) => {
  try {

    await User.findByIdAndDelete(req.params.id)

    res.json({
      message: "User deleted"
    })

  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

export default router