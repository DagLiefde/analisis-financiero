import { useState, useEffect } from 'react'

/**
 * Hook personalizado para manejar llamadas a la API
 * @param {Function} apiFunction - Función del servicio a ejecutar
 * @param {Array} dependencies - Dependencias para re-ejecutar la llamada
 */
export const useApi = (apiFunction, dependencies = []) => {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        setError(null)
        const result = await apiFunction()
        setData(result)
      } catch (err) {
        setError(err.message || 'Error al cargar los datos')
        console.error('Error en useApi:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, dependencies)

  return { data, loading, error, setData }
}

/**
 * Hook para manejar operaciones CRUD
 */
export const useCrud = (service) => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const execute = async (operation, ...args) => {
    try {
      setLoading(true)
      setError(null)
      const result = await service[operation](...args)
      return result
    } catch (err) {
      setError(err.message || 'Error en la operación')
      console.error('Error en useCrud:', err)
      throw err
    } finally {
      setLoading(false)
    }
  }

  return { execute, loading, error }
}

