"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useTask } from "../context/TaskContext"
import { X, Calendar, Type, FileText, Flag } from "lucide-react"
import LoadingSpinner from "./LoadingSpinner"

const TaskForm = ({ task = null, onClose, isEditing = false }) => {
  const { createTask, updateTask, loading } = useTask()
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    dueDate: "",
    priority: "medium",
  })
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (isEditing && task) {
      setFormData({
        title: task.title || "",
        description: task.description || "",
        dueDate: task.dueDate ? new Date(task.dueDate).toISOString().split("T")[0] : "",
        priority: task.priority || "medium",
      })
    }
  }, [isEditing, task])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
    // Clear field-specific errors when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }))
    }
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.title.trim()) {
      newErrors.title = "Task title is required"
    } else if (formData.title.trim().length > 100) {
      newErrors.title = "Title must be less than 100 characters"
    }

    if (formData.description && formData.description.length > 500) {
      newErrors.description = "Description must be less than 500 characters"
    }

    if (formData.dueDate) {
      const selectedDate = new Date(formData.dueDate)
      const today = new Date()
      today.setHours(0, 0, 0, 0)

      if (selectedDate < today) {
        newErrors.dueDate = "Due date cannot be in the past"
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    const taskData = {
      ...formData,
      dueDate: formData.dueDate || null,
    }

    let result
    if (isEditing) {
      result = await updateTask(task._id, taskData)
    } else {
      result = await createTask(taskData)
    }

    if (result.success) {
      onClose()
    }
  }

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  return (
    <AnimatePresence>
      <motion.div
        className="modal-backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={handleBackdropClick}
      >
        <motion.div
          className="modal-content"
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.2 }}
        >
          <div className="modal-header">
            <h2 className="modal-title">{isEditing ? "Edit Task" : "Create New Task"}</h2>
            <motion.button
              className="close-btn"
              onClick={onClose}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              aria-label="Close form"
            >
              <X size={20} />
            </motion.button>
          </div>

          <form onSubmit={handleSubmit} className="task-form">
            <div className="form-group">
              <label htmlFor="title" className="form-label">
                <Type size={16} />
                Task Title *
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className={`form-input ${errors.title ? "error" : ""}`}
                placeholder="Enter task title"
                maxLength={100}
                autoFocus
              />
              {errors.title && (
                <motion.span
                  className="form-error"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.2 }}
                >
                  {errors.title}
                </motion.span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="description" className="form-label">
                <FileText size={16} />
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                className={`form-textarea ${errors.description ? "error" : ""}`}
                placeholder="Enter task description (optional)"
                rows={4}
                maxLength={500}
              />
              <div className="character-count">{formData.description.length}/500</div>
              {errors.description && (
                <motion.span
                  className="form-error"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.2 }}
                >
                  {errors.description}
                </motion.span>
              )}
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="dueDate" className="form-label">
                  <Calendar size={16} />
                  Due Date
                </label>
                <input
                  type="date"
                  id="dueDate"
                  name="dueDate"
                  value={formData.dueDate}
                  onChange={handleChange}
                  className={`form-input ${errors.dueDate ? "error" : ""}`}
                  min={new Date().toISOString().split("T")[0]}
                />
                {errors.dueDate && (
                  <motion.span
                    className="form-error"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.2 }}
                  >
                    {errors.dueDate}
                  </motion.span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="priority" className="form-label">
                  <Flag size={16} />
                  Priority
                </label>
                <select
                  id="priority"
                  name="priority"
                  value={formData.priority}
                  onChange={handleChange}
                  className="form-input"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
            </div>

            <button type="submit" className="submit-btn">
              {loading ? <LoadingSpinner /> : isEditing ? "Update Task" : "Create Task"}
            </button>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

export default TaskForm
