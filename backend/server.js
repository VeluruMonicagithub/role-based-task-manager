const express = require("express")
const dotenv = require("dotenv")
const cors = require("cors")
const morgan = require("morgan")

const connectDB = require("./config/db")

const authRoutes = require("./routes/authRoutes")
const taskRoutes = require("./routes/taskRoutes")
const adminRoutes = require("./routes/adminRoutes")

dotenv.config()

const app = express()

// Database connection middleware for Serverless
app.use(async (req, res, next) => {
  try {
    await connectDB()
    next()
  } catch (error) {
    res.status(500).json({
      message: "Database connection failed",
      error: error.message,
    })
  }
})

app.use(cors())
app.use(express.json())
app.use(morgan("dev"))

app.use("/api/auth", authRoutes)
app.use("/api/tasks", taskRoutes)
app.use("/api/admin", adminRoutes)

app.get("/", (req, res) => {
  res.send("API Running")
})

const PORT = process.env.PORT || 5000
if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, () => {
    console.log(`Server running on ${PORT}`)
  })
}

module.exports = app