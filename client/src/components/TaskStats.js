"use client"
import { motion } from "framer-motion"
import { useTask } from "../context/TaskContext"
import { CheckCircle, Clock, AlertTriangle, BarChart3 } from "lucide-react"

const TaskStats = () => {
  const { taskStats } = useTask()

  const stats = [
    {
      label: "Total Tasks",
      value: taskStats.total,
      icon: BarChart3,
      color: "var(--accent-primary)",
      bgColor: "rgba(59, 130, 246, 0.1)",
    },
    {
      label: "Completed",
      value: taskStats.completed,
      icon: CheckCircle,
      color: "var(--success)",
      bgColor: "rgba(16, 185, 129, 0.1)",
    },
    {
      label: "Pending",
      value: taskStats.pending,
      icon: Clock,
      color: "var(--warning)",
      bgColor: "rgba(245, 158, 11, 0.1)",
    },
    {
      label: "High Priority",
      value: taskStats.high,
      icon: AlertTriangle,
      color: "var(--error)",
      bgColor: "rgba(239, 68, 68, 0.1)",
    },
  ]

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
  }

  return (
    <motion.div className="stats-container" variants={containerVariants} initial="hidden" animate="visible">
      {stats.map((stat, index) => {
        const Icon = stat.icon
        return (
          <motion.div
            key={stat.label}
            className="stat-card"
            variants={itemVariants}
            whileHover={{ scale: 1.02, y: -2 }}
            transition={{ duration: 0.2 }}
          >
            <div className="stat-icon" style={{ backgroundColor: stat.bgColor }}>
              <Icon size={24} style={{ color: stat.color }} />
            </div>
            <div className="stat-content">
              <h3 className="stat-value">{stat.value}</h3>
              <p className="stat-label">{stat.label}</p>
            </div>
          </motion.div>
        )
      })}

      <style jsx>{`
        .stats-container {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1.5rem;
          margin-bottom: 2rem;
        }

        .stat-card {
          background-color: var(--bg-secondary);
          border: 1px solid var(--border-color);
          border-radius: 0.75rem;
          padding: 1.5rem;
          display: flex;
          align-items: center;
          gap: 1rem;
          box-shadow: 0 1px 3px var(--shadow);
          transition: all 0.2s ease;
          cursor: default;
        }

        .stat-card:hover {
          box-shadow: 0 4px 12px var(--shadow);
        }

        .stat-icon {
          width: 48px;
          height: 48px;
          border-radius: 0.75rem;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .stat-content {
          flex: 1;
        }

        .stat-value {
          font-size: 1.875rem;
          font-weight: 700;
          color: var(--text-primary);
          margin-bottom: 0.25rem;
          line-height: 1;
        }

        .stat-label {
          color: var(--text-secondary);
          font-size: 0.875rem;
          font-weight: 500;
          margin: 0;
        }

        @media (max-width: 768px) {
          .stats-container {
            grid-template-columns: repeat(2, 1fr);
            gap: 1rem;
          }

          .stat-card {
            padding: 1rem;
          }

          .stat-icon {
            width: 40px;
            height: 40px;
          }

          .stat-value {
            font-size: 1.5rem;
          }

          .stat-label {
            font-size: 0.75rem;
          }
        }

        @media (max-width: 480px) {
          .stats-container {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </motion.div>
  )
}

export default TaskStats
