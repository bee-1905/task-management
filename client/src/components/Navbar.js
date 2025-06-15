"use client"
import { Link, useNavigate, useLocation } from "react-router-dom"
import { motion } from "framer-motion"
import { useAuth } from "../context/AuthContext"
import { useTheme } from "../context/ThemeContext"
import { CheckSquare, Sun, Moon, LogOut, User } from "lucide-react"

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const navigate = useNavigate()
  const location = useLocation()

  const handleLogout = () => {
    logout()
    navigate("/login")
  }

  return (
    <motion.nav className="navbar" initial={{ y: -100 }} animate={{ y: 0 }} transition={{ duration: 0.3 }}>
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">
          <CheckSquare className="navbar-icon" />
          <span>TaskManager</span>
        </Link>

        <div className="navbar-actions">
          <motion.button
            className="btn btn-icon"
            onClick={toggleTheme}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
          >
            {theme === "light" ? <Moon size={20} /> : <Sun size={20} />}
          </motion.button>

          {isAuthenticated ? (
            <div className="navbar-user">
              <div className="user-info">
                <User size={16} />
                <span className="user-name">{user?.name}</span>
              </div>
              <motion.button
                className="btn btn-secondary btn-sm"
                onClick={handleLogout}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <LogOut size={16} />
                Logout
              </motion.button>
            </div>
          ) : (
            <div className="navbar-auth">
              {location.pathname !== "/login" && (
                <Link to="/login" className="btn btn-secondary btn-sm">
                  Login
                </Link>
              )}
              {location.pathname !== "/register" && (
                <Link to="/register" className="btn btn-primary btn-sm">
                  Register
                </Link>
              )}
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        .navbar {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 1000;
          background-color: var(--bg-secondary);
          border-bottom: 1px solid var(--border-color);
          backdrop-filter: blur(10px);
        }

        .navbar-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 1rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .navbar-brand {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          text-decoration: none;
          color: var(--text-primary);
          font-weight: 600;
          font-size: 1.25rem;
        }

        .navbar-icon {
          color: var(--accent-primary);
        }

        .navbar-actions {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .navbar-user {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .user-info {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: var(--text-secondary);
          font-size: 0.875rem;
        }

        .user-name {
          font-weight: 500;
        }

        .navbar-auth {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        @media (max-width: 768px) {
          .navbar-container {
            padding: 0.75rem 1rem;
          }

          .user-info {
            display: none;
          }

          .navbar-brand span {
            display: none;
          }
        }
      `}</style>
    </motion.nav>
  )
}

export default Navbar
