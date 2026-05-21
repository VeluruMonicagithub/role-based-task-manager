const bcrypt = require("bcryptjs")

const User = require("../models/User")
const Activity = require("../models/Activity")

const generateToken = require("../utils/generateToken")

const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body

    const existingUser = await User.findOne({ email })

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists",
      })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: role || "User",
    })

    res.status(201).json({
      message: "User registered",
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

const login = async (req, res) => {
  try {
    const { email, password } = req.body

    const user = await User.findOne({ email })

    if (!user) {
      return res.status(400).json({
        message: "Invalid credentials",
      })
    }

    if (user.status === "Inactive") {
      return res.status(403).json({
        message: "User is inactive",
      })
    }

    const isMatch = await bcrypt.compare(password, user.password)

    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid credentials",
      })
    }

    await Activity.create({
      user: user._id,
      action: "User Logged In",
    })

    const token = generateToken(user)

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

module.exports = {
  register,
  login,
}
