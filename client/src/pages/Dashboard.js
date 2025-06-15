"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { useAuth } from "../context/AuthContext"
import { useTask } from "../context/TaskContext"
import TaskStats from "../components/TaskStats"
import TaskFilters from "../components/TaskFilters"
import TaskForm from "../components/TaskForm"
import TaskList from "../components/TaskList"
import LoadingSpinner from "../components/LoadingSpinner"
import { Plus } from "lucide-react"

const Dashboard = () => {
  const { user } = useAuth()
  const { fetchTasks, loading, filters } = useTask()
  const [showTaskForm, setShowTaskForm] = useState(false)

  useEffect(() => {
    fetchTasks(filters)
  }, [fetchTasks, filters])

  const handleCreateTask = () => {
    setShowTaskForm(true)
  }

  const handleCloseForm = () => {
    setShowTaskForm(false)
  }

  if (loading && !showTaskForm) {
    return <LoadingSpinner text="Loading your tasks..." />
  }

  return (
    <div className="dashboard">
      <div className="container">
        <motion.div
          className="dashboard-header"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div>
            <h1 className="dashboard-title">Welcome back, {user?.name}! 👋</h1>
            <p className="dashboard-subtitle">Here's what you need to get done today</p>
          </div>
          <motion.button
            className="btn btn-primary"
            onClick={handleCreateTask}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Plus size={20} />
            New Task
          </motion.button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <TaskStats />
        </motion.div>

        <motion.div
          className="dashboard-content"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="dashboard-sidebar">
            <TaskFilters />
          </div>
          <div className="dashboard-main">
            <TaskList />
          </div>
        </motion.div>

        {showTaskForm && <TaskForm onClose={handleCloseForm} />}
      </div>

      <style jsx>{`
        .dashboard {
          min-height: 100vh;
          background-color: var(--bg-primary);
          padding: 2rem 0;
        }

        .dashboard-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 2rem;
          gap: 1rem;
        }

        .dashboard-title {
          font-size: 2rem;
          font-weight: 700;
          color: var(--text-primary);
          margin-bottom: 0.5rem;
        }

        .dashboard-subtitle {
          color: var(--text-secondary);
          font-size: 1rem;
        }

        .dashboard-content {
          display: grid;
          grid-template-columns: 300px 1fr;
          gap: 2rem;
          margin-top: 2rem;
        }

        .dashboard-sidebar {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .dashboard-main {
          min-height: 400px;
        }

        @media (max-width: 1024px) {
          .dashboard-content {
            grid-template-columns: 1fr;
            gap: 1.5rem;
          }

          .dashboard-sidebar {
            order: 2;
          }

          .dashboard-main {
            order: 1;
          }
        }

        @media (max-width: 768px) {
          .dashboard {
            padding: 1rem 0;
          }

          .dashboard-header {
            flex-direction: column;
            align-items: stretch;
            text-align: center;
          }

          .dashboard-title {
            font-size: 1.5rem;
          }

          .dashboard-content {
            gap: 1rem;
          }
        }
      `}</style>
    </div>
  )
}

export default Dashboard
