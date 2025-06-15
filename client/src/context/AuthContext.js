"use client"

import { createContext, useContext, useReducer, useEffect } from "react"
import apiClient from "../utils/axios"
import toast from "react-hot-toast"

const AuthContext = createContext()

const initialState = {
  user: null,
  token: localStorage.getItem("token"),
  isAuthenticated: false,
  loading: true,
  error: null,
}

const authReducer = (state, action) => {
  switch (action.type) {
    case "SET_LOADING":
      return {
        ...state,
        loading: action.payload,
      }
    case "LOGIN_SUCCESS":
    case "REGISTER_SUCCESS":
      localStorage.setItem("token", action.payload.token)
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        loading: false,
        error: null,
      }
    case "LOGOUT":
      localStorage.removeItem("token")
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        loading: false,
        error: null,
      }
    case "AUTH_ERROR":
      localStorage.removeItem("token")
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        loading: false,
        error: action.payload,
      }
    case "CLEAR_ERROR":
      return {
        ...state,
        error: null,
      }
    case "LOAD_USER_SUCCESS":
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        loading: false,
        error: null,
      }
    default:
      return state
  }
}

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState)

  // Set auth token in axios headers
  useEffect(() => {
    if (state.token) {
      apiClient.defaults.headers.common["Authorization"] = `Bearer ${state.token}`
    } else {
      delete apiClient.defaults.headers.common["Authorization"]
    }
  }, [state.token])

  // Load user on app start
  useEffect(() => {
    if (state.token) {
      loadUser()
    } else {
      dispatch({ type: "SET_LOADING", payload: false })
    }
  }, [])

  const loadUser = async () => {
    try {
      const response = await apiClient.get("/api/auth/profile")
      dispatch({
        type: "LOAD_USER_SUCCESS",
        payload: response.data.user,
      })
    } catch (error) {
      console.error("Load user error:", error)
      dispatch({ type: "AUTH_ERROR", payload: "Failed to load user" })
    }
  }

  const register = async (userData) => {
    dispatch({ type: "SET_LOADING", payload: true })
    try {
      const response = await apiClient.post("/api/auth/register", userData)
      dispatch({
        type: "REGISTER_SUCCESS",
        payload: response.data,
      })
      toast.success("Registration successful!")
      return { success: true }
    } catch (error) {
      const message = error.response?.data?.message || "Registration failed"
      dispatch({ type: "AUTH_ERROR", payload: message })
      toast.error(message)
      return { success: false, error: message }
    }
  }

  const login = async (credentials) => {
    dispatch({ type: "SET_LOADING", payload: true })
    try {
      const response = await apiClient.post("/api/auth/login", credentials)
      dispatch({
        type: "LOGIN_SUCCESS",
        payload: response.data,
      })
      toast.success("Login successful!")
      return { success: true }
    } catch (error) {
      const message = error.response?.data?.message || "Login failed"
      dispatch({ type: "AUTH_ERROR", payload: message })
      toast.error(message)
      return { success: false, error: message }
    }
  }

  const logout = () => {
    dispatch({ type: "LOGOUT" })
    toast.success("Logged out successfully")
  }

  const clearError = () => {
    dispatch({ type: "CLEAR_ERROR" })
  }

  const value = {
    ...state,
    register,
    login,
    logout,
    clearError,
    loadUser,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
