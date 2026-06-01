import express from "express"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import User from "../models/User.js"

const router = express.Router()

router.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body

    const exist = await User.findOne({ email })
    if (exist) return res.status(400).json("User already exists")

    const hashed = await bcrypt.hash(password, 10)

    const user = await User.create({
      name,
      email,
      password: hashed
    })

    res.json(user)

  } catch (err) {
    res.status(500).json(err)
  }
})
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body

    // 1. نلقاو user
    const user = await User.findOne({ email })
    if (!user) {
      return res.status(404).json("User not found")
    }

    // 2. نقارنو password
    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      return res.status(400).json("Wrong password")
    }

    // 3. نعملو token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    )

    // 4. نرجعو response
  res.json({
  message: "Login success",
  token,
  user: {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role
  }
})

  } catch (err) {
    res.status(500).json(err)
  }
})

export default router