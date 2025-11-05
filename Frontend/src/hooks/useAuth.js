import { useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'

/**
 * useAuth Hook
 * Custom hook para manejar autenticación
 * Sigue el principio de Single Responsibility
 */
export const useAuth = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  const login = useCallback(async (credentials) => {
    setLoading(true)
    setError(null)

    try {
      // Llamada a la API de autenticación del backend
      const response = await api.post('/auth/login', credentials)
      
      // El backend retorna un objeto AuthResponse con el token y datos del usuario
      if (response.data && response.data.token && response.data.status === 'LOGIN_SUCCESS') {
        localStorage.setItem('token', response.data.token)
        
        // Guardar información completa del usuario del AuthResponse
        const userData = {
          id: response.data.id,
          nombre: response.data.nombre,
          apellido: response.data.apellido,
          email: response.data.email,
          rolNombre: response.data.rolNombre,
          permisos: response.data.permisos || []
        }
        localStorage.setItem('user', JSON.stringify(userData))
        
        navigate('/form')
        return { success: true, user: userData }
      } else {
        // Si no hay token o el status no es LOGIN_SUCCESS, el backend retornó un error
        const errorMessage = response.data?.message || response.data?.status || 'Error al iniciar sesión'
        setError(errorMessage)
        return { success: false, error: errorMessage }
      }
    } catch (err) {
      // Manejo de errores de la API
      const errorMessage = err.response?.data?.message || 
                          err.response?.data?.error || 
                          err.message || 
                          'Error al iniciar sesión'
      setError(errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      setLoading(false)
    }
  }, [navigate])

  const logout = useCallback(() => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    navigate('/login')
  }, [navigate])

  const isAuthenticated = useCallback(() => {
    return !!localStorage.getItem('token')
  }, [])

  return {
    login,
    logout,
    isAuthenticated,
    loading,
    error,
  }
}

export default useAuth

