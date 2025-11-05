import api from './api'
import { API_ENDPOINTS } from '../config/api.config'

/**
 * Servicio para gestionar centros gestores y clasificadores
 * Conecta con los endpoints reales del backend
 */
const analisisService = {
  /**
   * Obtener todos los centros gestores con detalles (paginado)
   */
  getCentrosGestores: async (page = 0, size = 10, sortBy = 'codigo', sortDir = 'asc') => {
    try {
      const response = await api.get(API_ENDPOINTS.centrosGestoresTodosDetalles, {
        params: { page, size, sortBy, sortDir }
      })
      return response.data
    } catch (error) {
      console.error('Error al obtener centros gestores:', error)
      throw error
    }
  },

  /**
   * Obtener un centro gestor por código
   */
  getCentroGestorByCodigo: async (codigo) => {
    try {
      const response = await api.get(API_ENDPOINTS.centroGestorByCodigo(codigo))
      return response.data
    } catch (error) {
      console.error('Error al obtener centro gestor:', error)
      throw error
    }
  },

  /**
   * Obtener centro gestor con detalles por código
   */
  getCentroGestorDetalles: async (codigo) => {
    try {
      const response = await api.get(API_ENDPOINTS.centroGestorDetalles(codigo))
      return response.data
    } catch (error) {
      console.error('Error al obtener centro gestor con detalles:', error)
      throw error
    }
  },

  /**
   * Obtener todos los clasificadores con detalles (paginado)
   */
  getClasificadores: async (page = 0, size = 10, sortBy = 'codigo', sortDir = 'asc') => {
    try {
      const response = await api.get(API_ENDPOINTS.clasificadoresTodosDetalles, {
        params: { page, size, sortBy, sortDir }
      })
      return response.data
    } catch (error) {
      console.error('Error al obtener clasificadores:', error)
      throw error
    }
  },

  /**
   * Obtener un clasificador por código
   */
  getClasificadorByCodigo: async (codigo) => {
    try {
      const response = await api.get(API_ENDPOINTS.clasificadorByCodigo(codigo))
      return response.data
    } catch (error) {
      console.error('Error al obtener clasificador:', error)
      throw error
    }
  },

  /**
   * Obtener clasificador con detalles por código
   */
  getClasificadorDetalles: async (codigo) => {
    try {
      const response = await api.get(API_ENDPOINTS.clasificadorDetalles(codigo))
      return response.data
    } catch (error) {
      console.error('Error al obtener clasificador con detalles:', error)
      throw error
    }
  },

  /**
   * Crear detalle ponderado para centro gestor
   */
  createDetalleCentroGestor: async (data) => {
    try {
      const response = await api.post(API_ENDPOINTS.detallePonderadoCentroGestor, data)
      return response.data
    } catch (error) {
      console.error('Error al crear detalle centro gestor:', error)
      throw error
    }
  },

  /**
   * Crear detalle ponderado para clasificador
   */
  createDetalleClasificador: async (data) => {
    try {
      const response = await api.post(API_ENDPOINTS.detallePonderadoClasificador, data)
      return response.data
    } catch (error) {
      console.error('Error al crear detalle clasificador:', error)
      throw error
    }
  }
}

export default analisisService

