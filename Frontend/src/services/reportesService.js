import api from './api'

/**
 * Servicio para gestionar reportes financieros
 */
const reportesService = {
  /**
   * Obtener todos los reportes
   */
  getAll: async (params = {}) => {
    try {
      const response = await api.get('/reportes', { params })
      return response.data
    } catch (error) {
      console.error('Error al obtener reportes:', error)
      throw error
    }
  },

  /**
   * Obtener un reporte por ID
   */
  getById: async (id) => {
    try {
      const response = await api.get(`/reportes/${id}`)
      return response.data
    } catch (error) {
      console.error('Error al obtener reporte:', error)
      throw error
    }
  },

  /**
   * Generar un nuevo reporte
   */
  generate: async (data) => {
    try {
      const response = await api.post('/reportes/generar', data)
      return response.data
    } catch (error) {
      console.error('Error al generar reporte:', error)
      throw error
    }
  },

  /**
   * Descargar un reporte
   */
  download: async (id, format = 'pdf') => {
    try {
      const response = await api.get(`/reportes/${id}/descargar`, {
        params: { format },
        responseType: 'blob'
      })
      return response.data
    } catch (error) {
      console.error('Error al descargar reporte:', error)
      throw error
    }
  }
}

export default reportesService

