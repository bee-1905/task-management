"use client"

import { createContext, useContext, useReducer, useCallback } from "react"
import apiClient from "../utils/axios"
import toast from "react-hot-toast"

const TaskContext = createContext()

const initialState = {
  tasks: [],
  loading: false,
  error: null,
  filters: {
    status: "all", // all, completed, pending
    priority: "all", // all, low, medium, high
    sortBy: "createdAt",
    sortOrder: "desc",
  },
}

const taskReducer = (state, action) => {
  switch (action.type) {
    case "SET_LOADING":
      return {
        ...state,
        loading: action.payload,
      }
    case "SET_TASKS":
      return {
        ...state,
        tasks: action.payload,
        loading: false,
        error: null,
      }
    case "ADD_TASK":
      return {
        ...state,
        tasks: [action.payload, ...state.tasks],
        loading: false,
        error: null,
      }
    case "UPDATE_TASK":
      return {
        ...state,
        tasks: state.tasks.map((task) => (task._id === action.payload._id ? action.payload : task)),
        loading: false,
        error: null,
      }
    case "DELETE_TASK":
      return {
        ...state,
        tasks: state.tasks.filter((task) => task._id !== action.payload),
        loading: false,
        error: null,
      }
    case "SET_ERROR":
      return {
        ...state,
        error: action.payload,
        loading: false,
      }
    case "CLEAR_ERROR":
      return {
        ...state,
        error: null,
      }
    case "SET_FILTERS":
      return {
        ...state,
        filters: { ...state.filters, ...action.payload },
      }
    case "CLEAR_TASKS":
      return {
        ...state,
        tasks: [],
        loading: false,
        error: null,
      }
    default:
      return state
  }
}

export const TaskProvider = ({ children }) => {
  const [state, dispatch] = useReducer(taskReducer, initialState)

  const fetchTasks = useCallback(async (filters = {}) => {
    dispatch({ type: "SET_LOADING", payload: true })
    try {
      const params = new URLSearchParams()

      if (filters.status && filters.status !== "all") {
        params.append("status", filters.status)
      }
      if (filters.priority && filters.priority !== "all") {
        params.append("priority", filters.priority)
      }
      if (filters.sortBy) {
        params.append("sortBy", filters.sortBy)
      }
      if (filters.sortOrder) {
        params.append("sortOrder", filters.sortOrder)
      }

      const response = await apiClient.get(`/api/tasks?${params.toString()}`)
      dispatch({ type: "SET_TASKS", payload: response.data.tasks })
    } catch (error) {
      const message = error.response?.data?.message || "Failed to fetch tasks"
      dispatch({ type: "SET_ERROR", payload: message })
      toast.error(message)
    }
  }, [])

  const createTask = async (taskData) => {
    dispatch({ type: "SET_LOADING", payload: true })
    try {
      const response = await apiClient.post("/api/tasks", taskData)
      dispatch({ type: "ADD_TASK", payload: response.data.task })
      toast.success("Task created successfully!")
      return { success: true, task: response.data.task }
    } catch (error) {
      const message = error.response?.data?.message || "Failed to create task"
      dispatch({ type: "SET_ERROR", payload: message })
      toast.error(message)
      return { success: false, error: message }
    }
  }

  const updateTask = async (taskId, taskData) => {
    dispatch({ type: "SET_LOADING", payload: true })
    try {
      const response = await apiClient.put(`/api/tasks/${taskId}`, taskData)
      dispatch({ type: "UPDATE_TASK", payload: response.data.task })
      toast.success("Task updated successfully!")
      return { success: true, task: response.data.task }
    } catch (error) {
      const message = error.response?.data?.message || "Failed to update task"
      dispatch({ type: "SET_ERROR", payload: message })
      toast.error(message)
      return { success: false, error: message }
    }
  }

  const deleteTask = async (taskId) => {
    dispatch({ type: "SET_LOADING", payload: true })
    try {
      await apiClient.delete(`/api/tasks/${taskId}`)
      dispatch({ type: "DELETE_TASK", payload: taskId })
      toast.success("Task deleted successfully!")
      return { success: true }
    } catch (error) {
      const message = error.response?.data?.message || "Failed to delete task"
      dispatch({ type: "SET_ERROR", payload: message })
      toast.error(message)
      return { success: false, error: message }
    }
  }

  const toggleTaskStatus = async (taskId) => {
    try {
      const response = await apiClient.patch(`/api/tasks/${taskId}/toggle`)
      dispatch({ type: "UPDATE_TASK", payload: response.data.task })
      toast.success(response.data.message)
      return { success: true, task: response.data.task }
    } catch (error) {
      const message = error.response?.data?.message || "Failed to toggle task status"
      dispatch({ type: "SET_ERROR", payload: message })
      toast.error(message)
      return { success: false, error: message }
    }
  }

  const setFilters = (filters) => {
    dispatch({ type: "SET_FILTERS", payload: filters })
  }

  const clearError = () => {
    dispatch({ type: "CLEAR_ERROR" })
  }

  const clearTasks = () => {
    dispatch({ type: "CLEAR_TASKS" })
  }

  // Computed values
  const filteredTasks = state.tasks.filter((task) => {
    const { status, priority } = state.filters

    if (status === "completed" && !task.completed) return false
    if (status === "pending" && task.completed) return false
    if (priority !== "all" && task.priority !== priority) return false

    return true
  })

  const taskStats = {
    total: state.tasks.length,
    completed: state.tasks.filter((task) => task.completed).length,
    pending: state.tasks.filter((task) => !task.completed).length,
    high: state.tasks.filter((task) => task.priority === "high").length,
    medium: state.tasks.filter((task) => task.priority === "medium").length,
    low: state.tasks.filter((task) => task.priority === "low").length,
  }

  const value = {
    ...state,
    filteredTasks,
    taskStats,
    fetchTasks,
    createTask,
    updateTask,
    deleteTask,
    toggleTaskStatus,
    setFilters,
    clearError,
    clearTasks,
  }

  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>
}

export const useTask = () => {
  const context = useContext(TaskContext)
  if (!context) {
    throw new Error("useTask must be used within a TaskProvider")
  }
  return context
}
