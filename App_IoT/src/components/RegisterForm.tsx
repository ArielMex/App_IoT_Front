import { useState } from "react"
import "../styles/Login.css"

interface RegisterFormData {
  name: string | number | readonly string[] | undefined
  email: string
  password: string
  confirmPassword: string
  dateOfBirth: string
}

export default function RegisterForm() {
  const [formData, setFormData] = useState<RegisterFormData>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    dateOfBirth: "",
  })
  const [error, setError] = useState("")

  const validateAge = (birthDate: string) => {
    const today = new Date()
    const birth = new Date(birthDate)
    let age = today.getFullYear() - birth.getFullYear()
    const monthDiff = today.getMonth() - birth.getMonth()
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--
    }
    
    return age >= 13
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match")
      return
    }

    if (!validateAge(formData.dateOfBirth)) {
      setError("You must be at least 13 years old to register")
      return
    }

    try {
      // Here you would typically make an API call to your registration endpoint
      const response = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        throw new Error("Registration failed")
      }

      // Handle successful registration
      window.location.href = "/login"
    } catch (err) {
      setError("Registration failed. Please try again.")
    }
  }

  return (
    <div className="auth-container">
      <div className="form-section">
        <div className="form-container">
          <div className="logo">REGÍSTRATE</div>
          <h1 className="form-title">CREA UNA CUENTA</h1>
          {error && <div className="error-message">{error}</div>}
          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <label htmlFor="name">Nombre</label>
              <input
                type="text"
                id="name"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div className="input-group">
              <label htmlFor="email">Correo</label>
              <input
                type="email"
                id="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
            <div className="input-group">
              <label htmlFor="dateOfBirth">Fecha de nacimiento</label>
              <input
                type="date"
                id="dateOfBirth"
                required
                value={formData.dateOfBirth}
                onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
              />
            </div>
            <div className="input-group">
              <label htmlFor="password">Contraseña</label>
              <input
                type="password"
                id="password"
                required
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
            </div>
            <div className="input-group">
              <label htmlFor="confirmPassword">Confirmar contraseña</label>
              <input
                type="password"
                id="confirmPassword"
                required
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              />
            </div>
            <button type="submit" className="submit-button">
              REGISTRARSE
            </button>
          </form>
          <div className="auth-links">
            <p>
              ¿Ya tienes una cuenta? <a href="/login">Inicia Sesión</a>
            </p>
          </div>
        </div>
      </div>
      <div className="illustration-section" />
    </div>
  );
}