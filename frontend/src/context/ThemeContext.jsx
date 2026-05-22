import { createContext, useState, useEffect } from "react"

export const ThemeContext = createContext()

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem("theme")
    if (saved) return saved
    // Default to dark mode for premium aesthetics
    return "dark"
  })

  useEffect(() => {
    const root = window.document.documentElement
    if (theme === "light") {
      root.classList.remove("dark")
      root.classList.add("light")
    } else {
      root.classList.remove("light")
      root.classList.add("dark")
    }
    localStorage.setItem("theme", theme)
  }, [theme])

  const toggleTheme = () => {
    setTheme(prev => (prev === "dark" ? "light" : "dark"))
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}
