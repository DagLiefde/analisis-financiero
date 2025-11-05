import { useState, useEffect, useCallback } from 'react'

/**
 * useFormData Hook
 * Custom hook para manejar datos de formulario con localStorage
 * Sigue el principio de Single Responsibility
 */
export const useFormData = (key = 'formData', initialData = null) => {
  const [data, setData] = useState(initialData)
  const [loading, setLoading] = useState(true)

  // Función para cargar datos desde localStorage
  const loadData = useCallback(() => {
    try {
      const savedData = localStorage.getItem(key)
      if (savedData) {
        const parsedData = JSON.parse(savedData)
        setData(parsedData)
        return parsedData
      } else {
        setData(initialData)
        return initialData
      }
    } catch (error) {
      console.error('Error loading data from localStorage:', error)
      setData(initialData)
      return initialData
    } finally {
      setLoading(false)
    }
  }, [key, initialData])

  useEffect(() => {
    loadData()
  }, [loadData])

  // Escuchar cambios en localStorage (útil cuando se actualiza desde otro componente)
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === key && e.newValue) {
        try {
          const newData = JSON.parse(e.newValue)
          setData(newData)
        } catch (error) {
          console.error('Error parsing storage change:', error)
        }
      }
    }

    // Escuchar eventos de storage en la misma ventana
    window.addEventListener('storage', handleStorageChange)
    
    // También escuchar eventos personalizados para cambios en la misma pestaña
    const handleCustomStorageChange = () => {
      loadData()
    }
    
    window.addEventListener('localStorageChange', handleCustomStorageChange)

    return () => {
      window.removeEventListener('storage', handleStorageChange)
      window.removeEventListener('localStorageChange', handleCustomStorageChange)
    }
  }, [key, loadData])

  const saveData = (newData) => {
    try {
      localStorage.setItem(key, JSON.stringify(newData))
      setData(newData)
      // Disparar evento personalizado para notificar cambios en la misma pestaña
      window.dispatchEvent(new Event('localStorageChange'))
      return true
    } catch (error) {
      console.error('Error saving data to localStorage:', error)
      return false
    }
  }

  const clearData = () => {
    try {
      localStorage.removeItem(key)
      setData(initialData)
      return true
    } catch (error) {
      console.error('Error clearing data from localStorage:', error)
      return false
    }
  }

  return {
    data,
    setData: saveData,
    clearData,
    loading,
  }
}

export default useFormData

