const User = require("../models/User")
const Task = require("../models/Task")
const Activity = require("../models/Activity")

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password")

    res.json(users)
  } catch (error) {
    res.status(500).json({
      message: error.message,
    })
  }
}

const deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id)

    res.json({
      message: "User deleted successfully",
    })
  } catch (error) {
    res.status(500).json({
      message: error.message,
    })
  }
}

const updateUserStatus = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      })
    }

    user.status = req.body.status

    await user.save()

    res.json(user)
  } catch (error) {
    res.status(500).json({
      message: error.message,
    })
  }
}

const getAllTasks = async (req, res) => {
  try {
    const tasks = await Task.find().populate(
      "createdBy",
      "name email"
    )

    res.json(tasks)
  } catch (error) {
    res.status(500).json({
      message: error.message,
    })
  }
}

const getActivityLogs = async (req, res) => {
  try {
    const logs = await Activity.find()
      .populate("user", "name email")
      .sort({ createdAt: -1 })

    res.json(logs)
  } catch (error) {
    res.status(500).json({
      message: error.message,
    })
  }
}

module.exports = {
  getAllUsers,
  deleteUser,
  updateUserStatus,
  getAllTasks,
  getActivityLogs,
}