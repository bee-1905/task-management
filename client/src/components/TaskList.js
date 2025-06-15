"use client"
import { motion, AnimatePresence } from "framer-motion"
import { useTask } from "../context/TaskContext"
import TaskItem from "./TaskItem"
import { FileText } from "lucide-react"

const TaskList = () => {
  const { filteredTasks, loading } = useTask()

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
    exit: {
      opacity: 0,
      x: -100,
      transition: {
        duration: 0.3,
      },
    },
  }

  if (loading) {
    return (
      <div className="task-list-loading">
        <div className="loading-skeleton">
          {[...Array(3)].map((_, index) => (
            <div key={index} className="skeleton-item" />
          ))}
        </div>
      </div>
    )
  }

  if (filteredTasks.length === 0) {
    return (
      <motion.div
        className="empty-state"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <FileText size={48} className="empty-icon" />
        <h3 className="empty-title">No tasks found</h3>
        <p className="empty-description">Create your first task or adjust your filters to see tasks here.</p>
      </motion.div>
    )
  }

  return (
    <motion.div className="task-list" variants={containerVariants} initial="hidden" animate="visible">
      <div className="task-list-header">
        <h2 className="task-list-title">Your Tasks ({filteredTasks.length})</h2>
      </div>

      <AnimatePresence mode="popLayout">
        <div className="task-grid">
          {filteredTasks.map((task) => (
            <motion.div key={task._id} variants={itemVariants} layout exit="exit">
              <TaskItem task={task} />
            </motion.div>
          ))}
        </div>
      </AnimatePresence>

      <style jsx>{`
        .task-list {
          background-color: var(--bg-secondary);
          border: 1px solid var(--border-color);
          border-radius: 0.75rem;
          padding: 1.5rem;
          box-shadow: 0 1px 3px var(--shadow);
        }

        .task-list-header {
          margin-bottom: 1.5rem;
          padding-bottom: 1rem;
          border-bottom: 1px solid var(--border-color);
        }

        .task-list-title {
          font-size: 1.25rem;
          font-weight: 600;
          color: var(--text-primary);
          margin: 0;
        }

        .task-grid {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .empty-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 3rem 1.5rem;
          text-align: center;
          background-color: var(--bg-secondary);
          border: 1px solid var(--border-color);
          border-radius: 0.75rem;
          box-shadow: 0 1px 3px var(--shadow);
        }

        .empty-icon {
          color: var(--text-muted);
          margin-bottom: 1rem;
        }

        .empty-title {
          font-size: 1.25rem;
          font-weight: 600;
          color: var(--text-primary);
          margin-bottom: 0.5rem;
        }

        .empty-description {
          color: var(--text-secondary);
          font-size: 0.875rem;
          max-width: 400px;
          line-height: 1.5;
          margin: 0;
        }

        .task-list-loading {
          background-color: var(--bg-secondary);
          border: 1px solid var(--border-color);
          border-radius: 0.75rem;
          padding: 1.5rem;
          box-shadow: 0 1px 3px var(--shadow);
        }

        .loading-skeleton {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .skeleton-item {
          height: 120px;
          background: linear-gradient(
            90deg,
            var(--bg-tertiary) 25%,
            var(--border-color) 50%,
            var(--bg-tertiary) 75%
          );
          background-size: 200% 100%;
          border-radius: 0.5rem;
          animation: shimmer 2s infinite;
        }

        @keyframes shimmer {
          0% {
            background-position: -200% 0;
          }
          100% {
            background-position: 200% 0;
          }
        }

        @media (max-width: 768px) {
          .task-list {
            padding: 1rem;
          }

          .empty-state {
            padding: 2rem 1rem;
          }
        }
      `}</style>
    </motion.div>
  )
}

export default TaskList
