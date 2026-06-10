import express from "express"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import User from "../models/User.js"
import { validateSignup, validateLogin } from "../middleware/validation.js"

const router = express.Router()

router.post("/signup", validateSignup, async (req, res) => {
  try {
    const { name, email, password } = req.body

    const exist = await User.findOne({ email })
    if (exist) return res.status(400).json({ message: "User already exists" })

    const hashed = await bcrypt.hash(password, 10)

    const user = await User.create({
      name,
      email,
      password: hashed
    })

    res.status(201).json({ message: "User created successfully", user })

  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

router.post("/login", validateLogin, async (req, res) => {
  try {
    const { email, password } = req.body

    const user = await User.findOne({ email })
    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      return res.status(400).json({ message: "Wrong password" })
    }

    if (!process.env.JWT_SECRET) {
      return res.status(500).json({ message: "JWT_SECRET not configured" })
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    )

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
    res.status(500).json({ error: err.message })
  }
})

export default router