import { useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import PageLayout from '../components/layouts/PageLayout'
import BarChart from '../components/charts/BarChart'
import DataTable from '../components/tables/DataTable'
import useFormData from '../hooks/useFormData'

/**
 * Details Page
 * Página de detalles refactorizada con componentes reutilizables
 * Sigue principios SOLID: Single Responsibility y Dependency Inversion
 */
const Details = () => {
  const navigate = useNavigate()
  const { data, loading } = useFormData('formData', {
    consecutive: '001',
    costCenter: 'CC-100',
    pospre: 'PRE',
    months: {
      january: '8',
      february: '6',
      march: '12',
      april: '11',
      may: '9',
      june: '6',
      july: '7',
      august: '10',
      september: '9',
      october: '6',
      november: '9',
      december: '7'
    }
  })

  useEffect(() => {
    if (!loading && !data) {
      navigate('/form')
    }
  }, [loading, data, navigate])

  // Transformar datos para el gráfico - usar useMemo para recalcular cuando cambien los datos
  const monthNames = useMemo(() => [
    { key: 'january', label: 'Ene', fullLabel: 'Enero' },
    { key: 'february', label: 'Feb', fullLabel: 'Febrero' },
    { key: 'march', label: 'Mar', fullLabel: 'Marzo' },
    { key: 'april', label: 'Abr', fullLabel: 'Abril' },
    { key: 'may', label: 'May', fullLabel: 'Mayo' },
    { key: 'june', label: 'Jun', fullLabel: 'Junio' },
    { key: 'july', label: 'Jul', fullLabel: 'Julio' },
    { key: 'august', label: 'Ago', fullLabel: 'Agosto' },
    { key: 'september', label: 'Sep', fullLabel: 'Septiembre' },
    { key: 'october', label: 'Oct', fullLabel: 'Octubre' },
    { key: 'november', label: 'Nov', fullLabel: 'Noviembre' },
    { key: 'december', label: 'Dic', fullLabel: 'Diciembre' }
  ], [])

  // Datos para el gráfico de barras - recalcular cuando cambien los datos
  const chartData = useMemo(() => {
    if (!data || !data.months) return []
    return monthNames.map(month => ({
      label: month.label,
      value: parseFloat(data.months[month.key]) || 0
    }))
  }, [data, monthNames])

  // Datos para la tabla - recalcular cuando cambien los datos
  const tableData = useMemo(() => {
    if (!data || !data.months) return []
    return monthNames.map(month => ({
      month: month.fullLabel,
      percentage: parseFloat(data.months[month.key]) || 0
    }))
  }, [data, monthNames])

  // Generar una clave única basada en los datos para forzar re-render del gráfico cuando cambien
  const chartKey = useMemo(() => {
    if (!data || !data.months) return 'default'
    // Usar solo los datos, no Date.now() para que solo cambie cuando cambien los datos
    return JSON.stringify(data.months)
  }, [data])

  if (loading || !data) {
    return (
      <PageLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <p className="text-[#479e8d] text-lg">Cargando datos...</p>
        </div>
      </PageLayout>
    )
  }

  // Configuración de columnas de la tabla
  const tableColumns = [
    {
      header: 'Mes',
      key: 'month',
      highlight: false
    },
    {
      header: 'Porcentaje',
      render: (row) => `${row.percentage.toFixed(2)}%`,
      highlight: true
    }
  ]

  return (
    <PageLayout showNavigation onNavigate={navigate}>
      <div className="flex flex-col max-w-[960px] flex-1">
        <div className="flex flex-wrap justify-between gap-3 p-4">
          <p className="text-[#0d1c19] tracking-light text-[32px] font-bold leading-tight min-w-72">
            Resumen de Gastos por Centro de Costos
          </p>
        </div>

        <BarChart 
          key={chartKey}
          data={chartData} 
          title="Gastos Mensuales por Centro de Costos" 
        />

        <DataTable 
          columns={tableColumns} 
          data={tableData}
          emptyMessage="No hay datos disponibles para mostrar"
        />
      </div>
    </PageLayout>
  )
}

export default Details
