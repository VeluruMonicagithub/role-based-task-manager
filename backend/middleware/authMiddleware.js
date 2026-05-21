const jwt = require("jsonwebtoken")
const User = require("../models/User")

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1]

    if (!token) {
      return res.status(401).json({
        message: "No token provided",
      })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    const user = await User.findById(decoded.id)

    if (!user) {
      return res.status(401).json({
        message: "User not found",
      })
    }

    if (user.status !== "Active") {
      return res.status(403).json({
        message: "User is inactive",
      })
    }

    req.user = {
      id: user._id.toString(),
      role: user.role,
    }

    next()
  } catch (error) {
    res.status(401).json({
      message: "Invalid token",
    })
  }
}

module.exports = authMiddleware