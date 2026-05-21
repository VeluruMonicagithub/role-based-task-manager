const express = require("express")

const {
  getAllUsers,
  deleteUser,
  updateUserStatus,
  getAllTasks,
  getActivityLogs,
} = require("../controllers/adminController")

const authMiddleware = require("../middleware/authMiddleware")
const adminMiddleware = require("../middleware/adminMiddleware")

const router = express.Router()
router.get(
  "/users",
  authMiddleware,
  adminMiddleware,
  getAllUsers
)

router.delete(
  "/users/:id",
  authMiddleware,
  adminMiddleware,
  deleteUser
)
router.put(
  "/users/:id/status",
  authMiddleware,
  adminMiddleware,
  updateUserStatus
)

router.get(
  "/tasks",
  authMiddleware,
  adminMiddleware,
  getAllTasks
)

router.get(
  "/logs",
  authMiddleware,
  adminMiddleware,
  getActivityLogs
)

module.exports = router