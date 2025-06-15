// API configuration
const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000"

export const API_ENDPOINTS = {
  BASE_URL: API_BASE_URL,
  AUTH: {
    REGISTER: `${API_BASE_URL}/api/auth/register`,
    LOGIN: `${API_BASE_URL}/api/auth/login`,
    PROFILE: `${API_BASE_URL}/api/auth/profile`,
  },
  TASKS: {
    BASE: `${API_BASE_URL}/api/tasks`,
    TOGGLE: (id) => `${API_BASE_URL}/api/tasks/${id}/toggle`,
  },
}

export default API_BASE_URL
