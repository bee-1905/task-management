"use client"
import { motion } from "framer-motion"

const LoadingSpinner = ({ size = "medium", text = "Loading..." }) => {
  const sizeClasses = {
    small: "w-4 h-4",
    medium: "w-8 h-8",
    large: "w-12 h-12",
  }

  return (
    <div className="flex flex-col items-center justify-center p-8">
      <motion.div
        className={`${sizeClasses[size]} border-3 border-gray-200 border-t-blue-500 rounded-full`}
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
        style={{
          borderWidth: "3px",
          borderColor: "var(--border-color)",
          borderTopColor: "var(--accent-primary)",
        }}
      />
      {text && (
        <motion.p
          className="mt-4 text-sm text-gray-600"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          style={{ color: "var(--text-secondary)" }}
        >
          {text}
        </motion.p>
      )}
    </div>
  )
}

export default LoadingSpinner
