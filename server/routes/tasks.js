const express = require("express")
const { body, validationResult, query } = require("express-validator")
const Task = require("../models/Task")
const auth = require("../middleware/auth")

const router = express.Router()

// @route   GET /api/tasks
// @desc    Get all tasks for authenticated user
// @access  Private
router.get(
  "/",
  auth,
  [
    query("status").optional().isIn(["completed", "pending"]),
    query("priority").optional().isIn(["low", "medium", "high"]),
    query("sortBy").optional().isIn(["createdAt", "dueDate", "priority", "title"]),
    query("sortOrder").optional().isIn(["asc", "desc"]),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(400).json({
          message: "Invalid query parameters",
          errors: errors.array(),
        })
      }

      const { status, priority, sortBy = "createdAt", sortOrder = "desc" } = req.query

      // Build filter object
      const filter = { user: req.user._id }

      if (status === "completed") {
        filter.completed = true
      } else if (status === "pending") {
        filter.completed = false
      }

      if (priority) {
        filter.priority = priority
      }

      // Build sort object
      const sort = {}
      sort[sortBy] = sortOrder === "asc" ? 1 : -1

      const tasks = await Task.find(filter).sort(sort)

      res.json({
        success: true,
        count: tasks.length,
        tasks,
      })
    } catch (error) {
      console.error("Get tasks error:", error)
      res.status(500).json({ message: "Server error fetching tasks" })
    }
  },
)

// @route   POST /api/tasks
// @desc    Create new task
// @access  Private
router.post(
  "/",
  auth,
  [
    body("title")
      .trim()
      .isLength({ min: 1, max: 100 })
      .withMessage("Title is required and must be less than 100 characters"),
    body("description")
      .optional()
      .trim()
      .isLength({ max: 500 })
      .withMessage("Description must be less than 500 characters"),
    body("dueDate").optional().isISO8601().withMessage("Due date must be a valid date"),
    body("priority").optional().isIn(["low", "medium", "high"]).withMessage("Priority must be low, medium, or high"),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(400).json({
          message: "Validation failed",
          errors: errors.array(),
        })
      }

      const { title, description, dueDate, priority } = req.body

      const task = new Task({
        title,
        description,
        dueDate: dueDate ? new Date(dueDate) : undefined,
        priority: priority || "medium",
        user: req.user._id,
      })

      await task.save()

      res.status(201).json({
        success: true,
        message: "Task created successfully",
        task,
      })
    } catch (error) {
      console.error("Create task error:", error)
      res.status(500).json({ message: "Server error creating task" })
    }
  },
)

// @route   PUT /api/tasks/:id
// @desc    Update task
// @access  Private
router.put(
  "/:id",
  auth,
  [
    body("title")
      .optional()
      .trim()
      .isLength({ min: 1, max: 100 })
      .withMessage("Title must be between 1 and 100 characters"),
    body("description")
      .optional()
      .trim()
      .isLength({ max: 500 })
      .withMessage("Description must be less than 500 characters"),
    body("dueDate").optional().isISO8601().withMessage("Due date must be a valid date"),
    body("priority").optional().isIn(["low", "medium", "high"]).withMessage("Priority must be low, medium, or high"),
    body("completed").optional().isBoolean().withMessage("Completed must be a boolean value"),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(400).json({
          message: "Validation failed",
          errors: errors.array(),
        })
      }

      const task = await Task.findOne({ _id: req.params.id, user: req.user._id })

      if (!task) {
        return res.status(404).json({ message: "Task not found" })
      }

      const { title, description, dueDate, priority, completed } = req.body

      // Update fields if provided
      if (title !== undefined) task.title = title
      if (description !== undefined) task.description = description
      if (dueDate !== undefined) task.dueDate = dueDate ? new Date(dueDate) : null
      if (priority !== undefined) task.priority = priority
      if (completed !== undefined) task.completed = completed

      await task.save()

      res.json({
        success: true,
        message: "Task updated successfully",
        task,
      })
    } catch (error) {
      console.error("Update task error:", error)
      res.status(500).json({ message: "Server error updating task" })
    }
  },
)

// @route   DELETE /api/tasks/:id
// @desc    Delete task
// @access  Private
router.delete("/:id", auth, async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({ _id: req.params.id, user: req.user._id })

    if (!task) {
      return res.status(404).json({ message: "Task not found" })
    }

    res.json({
      success: true,
      message: "Task deleted successfully",
    })
  } catch (error) {
    console.error("Delete task error:", error)
    res.status(500).json({ message: "Server error deleting task" })
  }
})

// @route   PATCH /api/tasks/:id/toggle
// @desc    Toggle task completion status
// @access  Private
router.patch("/:id/toggle", auth, async (req, res) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, user: req.user._id })

    if (!task) {
      return res.status(404).json({ message: "Task not found" })
    }

    task.completed = !task.completed
    await task.save()

    res.json({
      success: true,
      message: `Task marked as ${task.completed ? "completed" : "pending"}`,
      task,
    })
  } catch (error) {
    console.error("Toggle task error:", error)
    res.status(500).json({ message: "Server error toggling task status" })
  }
})

module.exports = router
