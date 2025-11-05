import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import PageLayout from '../components/layouts/PageLayout'
import FormField from '../components/common/FormField'
import Button from '../components/common/Button'
import useFormData from '../hooks/useFormData'
import analisisService from '../services/analisisService'

/**
 * Form Page
 * Página de formulario refactorizada con componentes reutilizables
 * Sigue principios SOLID: Single Responsibility y Dependency Inversion
 */
const Form = () => {
  const navigate = useNavigate()
  const { setData } = useFormData('formData')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  
  const [formData, setFormData] = useState({
    consecutive: '',
    costCenter: '',
    pospre: '',
    months: {
      january: '',
      february: '',
      march: '',
      april: '',
      may: '',
      june: '',
      july: '',
      august: '',
      september: '',
      october: '',
      november: '',
      december: ''
    }
  })

  const handleMonthChange = (month, value) => {
    setFormData({
      ...formData,
      months: {
        ...formData.months,
        [month]: value
      }
    })
    // Limpiar error cuando el usuario modifica
    if (error) setError(null)
  }

  const calculateTotal = () => {
    return Object.values(formData.months).reduce((acc, val) => acc + (parseFloat(val) || 0), 0)
  }

  // Mapeo de meses en inglés a español (formato del backend)
  const monthMapping = {
    january: 'enero',
    february: 'febrero',
    march: 'marzo',
    april: 'abril',
    may: 'mayo',
    june: 'junio',
    july: 'julio',
    august: 'agosto',
    september: 'septiembre',
    october: 'octubre',
    november: 'noviembre',
    december: 'diciembre'
  }

  // Transformar datos del formulario al formato del DTO del backend
  const transformFormDataToDTO = (centroGestorId, months) => {
    // Calcular el total a partir de los meses recibidos
    const total = Object.values(months).reduce((acc, val) => acc + (parseFloat(val) || 0), 0)
    
    const dto = {
      centroGestorId: centroGestorId,
      total: total
    }

    // Mapear cada mes del formulario al formato del backend
    Object.keys(monthMapping).forEach(englishMonth => {
      const spanishMonth = monthMapping[englishMonth]
      const value = parseFloat(months[englishMonth]) || 0
      dto[spanishMonth] = value
    })

    return dto
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    
    const total = calculateTotal()
    
    if (total !== 100) {
      setError('La suma de los porcentajes mensuales debe ser igual a 100%')
      return
    }

    if (!formData.costCenter || formData.costCenter.trim() === '') {
      setError('El Centro de Costos es requerido')
      return
    }

    setLoading(true)

    try {
      // Paso 1: Buscar el centro gestor por código para obtener su ID
      const centroGestor = await analisisService.getCentroGestorByCodigo(formData.costCenter.trim())
      
      if (!centroGestor || !centroGestor.centroGestorId) {
        setError(`No se encontró un Centro Gestor con el código: ${formData.costCenter}`)
        setLoading(false)
        return
      }

      // Paso 2: Transformar los datos al formato del DTO
      const dto = transformFormDataToDTO(centroGestor.centroGestorId, formData.months)

      // Paso 3: Enviar al backend
      const response = await analisisService.createDetalleCentroGestor(dto)
      
      // Paso 4: Guardar también en localStorage para compatibilidad
      setData(formData)
      
      // Paso 5: Mostrar éxito y navegar
      alert('¡Datos guardados exitosamente en el backend!')
      navigate('/details')
      
    } catch (err) {
      console.error('Error al enviar formulario:', err)
      const errorMessage = err.response?.data?.message || 
                          err.response?.data?.error || 
                          err.message || 
                          'Error al guardar los datos. Por favor, verifica que el Centro de Costos sea válido (ej: CG001, CG002, CG003, CG004).'
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const monthPairs = [
    [
      { key: 'january', label: 'Enero' },
      { key: 'february', label: 'Febrero' }
    ],
    [
      { key: 'march', label: 'Marzo' },
      { key: 'april', label: 'Abril' }
    ],
    [
      { key: 'may', label: 'Mayo' },
      { key: 'june', label: 'Junio' }
    ],
    [
      { key: 'july', label: 'Julio' },
      { key: 'august', label: 'Agosto' }
    ],
    [
      { key: 'september', label: 'Septiembre' },
      { key: 'october', label: 'Octubre' }
    ],
    [
      { key: 'november', label: 'Noviembre' },
      { key: 'december', label: 'Diciembre' }
    ]
  ]

  return (
    <PageLayout showNavigation onNavigate={navigate}>
      <div className="flex flex-col w-full max-w-[512px] py-5">
        <h2 className="text-[#0d1c19] tracking-light text-[28px] font-bold leading-tight px-4 text-center pb-3 pt-5">
          Información del Departamento
        </h2>

        <form onSubmit={handleSubmit}>
          {/* Información básica */}
          <FormField
            label="Consecutivo"
            placeholder="Ingrese número consecutivo"
            value={formData.consecutive}
            onChange={(e) => setFormData({ ...formData, consecutive: e.target.value })}
            required
          />

          <FormField
            label="Centro de Costos"
            placeholder="Ingrese centro de costos"
            value={formData.costCenter}
            onChange={(e) => setFormData({ ...formData, costCenter: e.target.value })}
            required
          />

          <FormField
            label="POSPRE"
            placeholder="Ingrese POSPRE"
            value={formData.pospre}
            onChange={(e) => setFormData({ ...formData, pospre: e.target.value })}
            required
          />

          <h2 className="text-[#0d1c19] tracking-light text-[28px] font-bold leading-tight px-4 text-center pb-3 pt-5">
            Distribución Porcentual Mensual
          </h2>

          {/* Campos de meses en pares */}
          {monthPairs.map((pair, pairIndex) => (
            <div key={pairIndex} className="flex max-w-[480px] flex-wrap items-end gap-4 px-4 py-3">
              {pair.map((month) => (
                <label key={month.key} className="flex flex-col min-w-40 flex-1">
                  <p className="text-[#0d1c19] text-base font-medium leading-normal pb-2">
                    {month.label}
                  </p>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="%"
                    value={formData.months[month.key]}
                    onChange={(e) => handleMonthChange(month.key, e.target.value)}
                    className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-[#0d1c19] focus:outline-0 focus:ring-0 border border-[#cee9e3] bg-[#f8fcfb] focus:border-[#cee9e3] h-14 placeholder:text-[#479e8d] p-[15px] text-base font-normal leading-normal"
                    required
                  />
                </label>
              ))}
            </div>
          ))}

          {/* Total */}
          <FormField
            label="Total"
            value={`${calculateTotal().toFixed(2)}%`}
            onChange={() => {}}
            disabled
          />

          <p className="text-[#479e8d] text-sm font-normal leading-normal pb-3 pt-1 px-4 text-center">
            Nota: La suma de los porcentajes mensuales debe ser igual a 100%.
          </p>

          {/* Mensaje de error */}
          {error && (
            <div className="px-4 py-2 mx-4 mb-2 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm font-medium">{error}</p>
            </div>
          )}

          {/* Mensaje de ayuda para códigos válidos */}
          <p className="text-[#479e8d] text-xs font-normal leading-normal pb-2 px-4 text-center">
            Códigos de Centro de Costos válidos: CG001, CG002, CG003, CG004
          </p>

          <div className="flex px-4 py-3 justify-center">
            <Button type="submit" disabled={loading}>
              {loading ? 'Enviando...' : 'Enviar'}
            </Button>
          </div>
        </form>
      </div>
    </PageLayout>
  )
}

export default Form
