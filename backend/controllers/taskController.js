const Task = require("../models/Task")
const Activity = require("../models/Activity")

const createTask = async (req, res) => {
  try {
    const { title, description } = req.body

    const task = await Task.create({
      title,
      description,
      createdBy: req.user.id,
    })

    await Activity.create({
      user: req.user.id,
      action: "Task Created",
      taskId: task._id,
    })
    res.status(201).json(task)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

const getMyTasks = async (req, res) => {
  try {
    const tasks = await Task.find({
      createdBy: req.user.id,
    })

    res.json(tasks)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}
const updateTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id)

    if (!task) {
      return res.status(404).json({
        message: "Task not found",
      })
    }

    if (task.createdBy.toString() !== req.user.id) {
      return res.status(403).json({
        message: "Unauthorized",
      })
    }
task.title = req.body.title || task.title
    task.description = req.body.description || task.description
    task.completed = req.body.completed

    await task.save()

    await Activity.create({
      user: req.user.id,
      action: "Task Updated",
      taskId: task._id,
    })

    res.json(task)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

const deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id)

    if (!task) {
      return res.status(404).json({
        message: "Task not found",
      })
    }

    if (
      task.createdBy.toString() !== req.user.id &&
      req.user.role !== "Admin"
    ) {
      return res.status(403).json({
        message: "Unauthorized",
      })
    }

    await task.deleteOne()


    await Activity.create({
      user: req.user.id,
      action: "Task Deleted",
      taskId: task._id,
    })

    res.json({
      message: "Task deleted",
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

module.exports = {
  createTask,
  getMyTasks,
  updateTask,
  deleteTask,
}