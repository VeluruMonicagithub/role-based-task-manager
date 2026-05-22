const mongoose = require("mongoose")

let isConnected = false

const connectDB = async () => {
  if (isConnected) {
    console.log("MongoDB is already connected. Reusing connection.")
    return
  }

  try {
    const db = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
    })

    isConnected = db.connections[0].readyState === 1
    console.log("MongoDB Connected")
  } catch (error) {
    console.error("MongoDB Connection Error:", error)
    throw error
  }
}

module.exports = connectDB