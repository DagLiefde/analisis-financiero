/**
 * API Configuration
 * Centraliza la configuración de las URLs de las APIs
 * Permite cambiar entre entornos local y producción mediante variables de entorno
 */

export const API_CONFIG = {
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080/api',
  timeout: parseInt(import.meta.env.VITE_API_TIMEOUT || '10000', 10),
  headers: {
    'Content-Type': 'application/json',
  },
}

export const API_ENDPOINTS = {
  // Auth endpoints
  login: '/auth/login',
  logout: '/auth/logout',
  
  // Centros Gestores endpoints
  centrosGestores: '/centros-gestores',
  centroGestorByCodigo: (codigo) => `/centros-gestores/${codigo}`,
  centroGestorDetalles: (codigo) => `/centros-gestores/${codigo}/detalles`,
  centrosGestoresTodosDetalles: '/centros-gestores/detalles',
  
  // Clasificadores Presupuestales endpoints
  clasificadores: '/clasificadores',
  clasificadorByCodigo: (codigo) => `/clasificadores/${codigo}`,
  clasificadorDetalles: (codigo) => `/clasificadores/${codigo}/detalles`,
  clasificadoresTodosDetalles: '/clasificadores/detalles',
  
  // Detalle Ponderado endpoints
  detallePonderadoCentroGestor: '/detalle-ponderado-centro-gestor',
  detallePonderadoClasificador: '/detalle-ponderado-clasificador',
  
  // Admin endpoints
  adminUsuarios: '/admin/usuarios',
  adminRoles: '/admin/roles',
}

export const isProduction = import.meta.env.VITE_ENV === 'production'
export const isDevelopment = import.meta.env.VITE_ENV === 'development'

