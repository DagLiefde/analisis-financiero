/**
 * Formatea un número como moneda
 * @param {number} amount - Cantidad a formatear
 * @param {string} currency - Código de moneda (default: 'USD')
 * @returns {string} Cantidad formateada
 */
export const formatCurrency = (amount, currency = 'USD') => {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: currency,
  }).format(amount)
}

/**
 * Formatea una fecha
 * @param {string|Date} date - Fecha a formatear
 * @param {string} format - Formato deseado ('short', 'long', 'full')
 * @returns {string} Fecha formateada
 */
export const formatDate = (date, format = 'short') => {
  const options = {
    short: { year: 'numeric', month: '2-digit', day: '2-digit' },
    long: { year: 'numeric', month: 'long', day: 'numeric' },
    full: { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }
  }

  return new Intl.DateTimeFormat('es-CO', options[format]).format(new Date(date))
}

/**
 * Formatea un número con separadores de miles
 * @param {number} number - Número a formatear
 * @returns {string} Número formateado
 */
export const formatNumber = (number) => {
  return new Intl.NumberFormat('es-CO').format(number)
}

/**
 * Formatea un porcentaje
 * @param {number} value - Valor a formatear (0-1 o 0-100)
 * @param {number} decimals - Número de decimales
 * @returns {string} Porcentaje formateado
 */
export const formatPercentage = (value, decimals = 2) => {
  const percentage = value > 1 ? value : value * 100
  return `${percentage.toFixed(decimals)}%`
}

/**
 * Trunca un texto a una longitud específica
 * @param {string} text - Texto a truncar
 * @param {number} maxLength - Longitud máxima
 * @returns {string} Texto truncado
 */
export const truncateText = (text, maxLength = 50) => {
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength) + '...'
}

