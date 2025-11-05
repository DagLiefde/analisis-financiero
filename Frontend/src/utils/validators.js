/**
 * Valida un email
 * @param {string} email - Email a validar
 * @returns {boolean} True si es válido
 */
export const validateEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return regex.test(email)
}

/**
 * Valida un número de teléfono
 * @param {string} phone - Teléfono a validar
 * @returns {boolean} True si es válido
 */
export const validatePhone = (phone) => {
  const regex = /^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,9}$/
  return regex.test(phone)
}

/**
 * Valida que un campo no esté vacío
 * @param {string} value - Valor a validar
 * @returns {boolean} True si no está vacío
 */
export const validateRequired = (value) => {
  return value !== null && value !== undefined && value.toString().trim() !== ''
}

/**
 * Valida la longitud mínima de un string
 * @param {string} value - Valor a validar
 * @param {number} minLength - Longitud mínima
 * @returns {boolean} True si cumple la longitud mínima
 */
export const validateMinLength = (value, minLength) => {
  return value && value.length >= minLength
}

/**
 * Valida que un valor sea un número
 * @param {any} value - Valor a validar
 * @returns {boolean} True si es un número
 */
export const validateNumber = (value) => {
  return !isNaN(parseFloat(value)) && isFinite(value)
}

/**
 * Valida un rango de valores
 * @param {number} value - Valor a validar
 * @param {number} min - Valor mínimo
 * @param {number} max - Valor máximo
 * @returns {boolean} True si está en el rango
 */
export const validateRange = (value, min, max) => {
  const num = parseFloat(value)
  return !isNaN(num) && num >= min && num <= max
}

