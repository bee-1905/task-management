const mongoose = require("mongoose")

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Task title is required"],
      trim: true,
      maxlength: [100, "Title cannot exceed 100 characters"],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, "Description cannot exceed 500 characters"],
    },
    dueDate: {
      type: Date,
      validate: {
        validator: (value) => !value || value >= new Date(),
        message: "Due date cannot be in the past",
      },
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
    },
    completed: {
      type: Boolean,
      default: false,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  },
)

// Indexes for better query performance
taskSchema.index({ user: 1, completed: 1 })
taskSchema.index({ user: 1, priority: 1 })
taskSchema.index({ user: 1, dueDate: 1 })

module.exports = mongoose.model("Task", taskSchema)
