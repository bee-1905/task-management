"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { useTask } from "../context/TaskContext"
import TaskForm from "./TaskForm"
import { Calendar, Edit3, Trash2, CheckCircle, Circle, AlertTriangle, Clock } from "lucide-react"

const TaskItem = ({ task }) => {
  const { toggleTaskStatus, deleteTask } = useTask()
  const [showEditForm, setShowEditForm] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const handleToggleStatus = async () => {
    await toggleTaskStatus(task._id)
  }

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      setIsDeleting(true)
      const result = await deleteTask(task._id)
      if (!result.success) {
        setIsDeleting(false)
      }
    }
  }

  const handleEdit = () => {
    setShowEditForm(true)
  }

  const handleCloseEdit = () => {
    setShowEditForm(false)
  }

  const formatDate = (dateString) => {
    if (!dateString) return null
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  const isOverdue = (dueDate) => {
    if (!dueDate) return false
    return new Date(dueDate) < new Date() && !task.completed
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high":
        return "var(--error)"
      case "medium":
        return "var(--warning)"
      case "low":
        return "var(--success)"
      default:
        return "var(--text-muted)"
    }
  }

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case "high":
        return AlertTriangle
      case "medium":
        return Clock
      case "low":
        return Circle
      default:
        return Circle
    }
  }

  const PriorityIcon = getPriorityIcon(task.priority)

  return (
    <>
      <motion.div
        className={`task-item ${task.completed ? "completed" : ""} ${isOverdue(task.dueDate) ? "overdue" : ""}`}
        initial={{ opacity: 0, y: 20 }}
        animate={{
          opacity: isDeleting ? 0.5 : 1,
          y: 0,
          scale: isDeleting ? 0.95 : 1,
        }}
        whileHover={{ y: -2 }}
        transition={{ duration: 0.2 }}
        layout
      >
        <div className="task-content">
          <div className="task-header">
            <motion.button
              className="status-toggle"
              onClick={handleToggleStatus}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              disabled={isDeleting}
            >
              {task.completed ? (
                <CheckCircle size={20} className="status-icon completed" />
              ) : (
                <Circle size={20} className="status-icon pending" />
              )}
            </motion.button>

            <div className="task-info">
              <h3 className={`task-title ${task.completed ? "completed-text" : ""}`}>{task.title}</h3>
              {task.description && (
                <p className={`task-description ${task.completed ? "completed-text" : ""}`}>{task.description}</p>
              )}
            </div>

            <div className="task-priority">
              <PriorityIcon size={16} style={{ color: getPriorityColor(task.priority) }} />
              <span className="priority-text" style={{ color: getPriorityColor(task.priority) }}>
                {task.priority}
              </span>
            </div>
          </div>

          <div className="task-footer">
            <div className="task-meta">
              {task.dueDate && (
                <div className={`due-date ${isOverdue(task.dueDate) ? "overdue" : ""}`}>
                  <Calendar size={14} />
                  <span>Due {formatDate(task.dueDate)}</span>
                </div>
              )}
              <div className="created-date">
                <span>Created {formatDate(task.createdAt)}</span>
              </div>
            </div>

            <div className="task-actions">
              <motion.button
                className="action-btn edit-btn"
                onClick={handleEdit}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                disabled={isDeleting}
                aria-label="Edit task"
              >
                <Edit3 size={16} />
              </motion.button>
              <motion.button
                className="action-btn delete-btn"
                onClick={handleDelete}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                disabled={isDeleting}
                aria-label="Delete task"
              >
                <Trash2 size={16} />
              </motion.button>
            </div>
          </div>
        </div>
      </motion.div>

      {showEditForm && <TaskForm task={task} onClose={handleCloseEdit} isEditing={true} />}

      <style jsx>{`
        .task-item {
          background-color: var(--bg-primary);
          border: 1px solid var(--border-color);
          border-radius: 0.75rem;
          padding: 1.5rem;
          box-shadow: 0 1px 3px var(--shadow);
          transition: all 0.2s ease;
          position: relative;
        }

        .task-item:hover {
          box-shadow: 0 4px 12px var(--shadow);
          border-color: var(--accent-primary);
        }

        .task-item.completed {
          opacity: 0.8;
          background-color: var(--bg-tertiary);
        }

        .task-item.overdue {
          border-color: var(--error);
          background-color: rgba(239, 68, 68, 0.05);
        }

        .task-content {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .task-header {
          display: flex;
          align-items: flex-start;
          gap: 1rem;
        }

        .status-toggle {
          background: none;
          border: none;
          cursor: pointer;
          padding: 0.25rem;
          border-radius: 0.25rem;
          transition: all 0.2s ease;
          flex-shrink: 0;
          margin-top: 0.125rem;
        }

        .status-toggle:hover {
          background-color: var(--bg-tertiary);
        }

        .status-toggle:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .status-icon.completed {
          color: var(--success);
        }

        .status-icon.pending {
          color: var(--text-muted);
        }

        .task-info {
          flex: 1;
          min-width: 0;
        }

        .task-title {
          font-size: 1.125rem;
          font-weight: 600;
          color: var(--text-primary);
          margin: 0 0 0.5rem 0;
          line-height: 1.4;
          word-wrap: break-word;
        }

        .task-title.completed-text {
          text-decoration: line-through;
          color: var(--text-muted);
        }

        .task-description {
          color: var(--text-secondary);
          font-size: 0.875rem;
          line-height: 1.5;
          margin: 0;
          word-wrap: break-word;
        }

        .task-description.completed-text {
          color: var(--text-muted);
        }

        .task-priority {
          display: flex;
          align-items: center;
          gap: 0.25rem;
          flex-shrink: 0;
        }

        .priority-text {
          font-size: 0.75rem;
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .task-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 1rem;
        }

        .task-meta {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
          flex: 1;
        }

        .due-date,
        .created-date {
          display: flex;
          align-items: center;
          gap: 0.25rem;
          font-size: 0.75rem;
          color: var(--text-muted);
        }

        .due-date.overdue {
          color: var(--error);
          font-weight: 500;
        }

        .task-actions {
          display: flex;
          gap: 0.5rem;
        }

        .action-btn {
          background: none;
          border: none;
          cursor: pointer;
          padding: 0.5rem;
          border-radius: 0.375rem;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .action-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .edit-btn {
          color: var(--text-muted);
        }

        .edit-btn:hover:not(:disabled) {
          background-color: rgba(59, 130, 246, 0.1);
          color: var(--accent-primary);
        }

        .delete-btn {
          color: var(--text-muted);
        }

        .delete-btn:hover:not(:disabled) {
          background-color: rgba(239, 68, 68, 0.1);
          color: var(--error);
        }

        @media (max-width: 768px) {
          .task-item {
            padding: 1rem;
          }

          .task-header {
            gap: 0.75rem;
          }

          .task-title {
            font-size: 1rem;
          }

          .task-footer {
            flex-direction: column;
            align-items: flex-start;
            gap: 0.75rem;
          }

          .task-actions {
            align-self: flex-end;
          }
        }
      `}</style>
    </>
  )
}

export default TaskItem
