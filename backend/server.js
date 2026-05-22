const express = require("express")
const dotenv = require("dotenv")
const cors = require("cors")
const morgan = require("morgan")

const connectDB = require("./config/db")

const authRoutes = require("./routes/authRoutes")
const taskRoutes = require("./routes/taskRoutes")
const adminRoutes = require("./routes/adminRoutes")

dotenv.config()
connectDB()

const app = express()

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