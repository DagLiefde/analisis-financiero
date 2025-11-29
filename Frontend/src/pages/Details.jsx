import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import PageLayout from '../components/layouts/PageLayout'
import BarChart from '../components/charts/BarChart'
import DataTable from '../components/tables/DataTable'
import useFormData from '../hooks/useFormData'
import analisisService from '../services/analisisService'

const MONTH_NAMES = [
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
]

const defaultFormFallback = {
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
}

const mapDetalleToMonths = (detalle) => ({
  january: detalle?.enero?.toString() ?? '0',
  february: detalle?.febrero?.toString() ?? '0',
  march: detalle?.marzo?.toString() ?? '0',
  april: detalle?.abril?.toString() ?? '0',
  may: detalle?.mayo?.toString() ?? '0',
  june: detalle?.junio?.toString() ?? '0',
  july: detalle?.julio?.toString() ?? '0',
  august: detalle?.agosto?.toString() ?? '0',
  september: detalle?.septiembre?.toString() ?? '0',
  october: detalle?.octubre?.toString() ?? '0',
  november: detalle?.noviembre?.toString() ?? '0',
  december: detalle?.diciembre?.toString() ?? '0'
})

const Details = () => {
  const navigate = useNavigate()
  const { data: localData, loading: localLoading } = useFormData('formData', defaultFormFallback)
  const [centrosGestores, setCentrosGestores] = useState([])
  const [centrosLoading, setCentrosLoading] = useState(true)
  const [centrosError, setCentrosError] = useState(null)
  const [selectedCentroCodigo, setSelectedCentroCodigo] = useState('')
  const [selectedDetalle, setSelectedDetalle] = useState(null)
  const [detalleYear, setDetalleYear] = useState(new Date().getFullYear())
  const [exportingAll, setExportingAll] = useState(false)

  useEffect(() => {
    let isMounted = true

    const fetchCentros = async () => {
      setCentrosLoading(true)
      setCentrosError(null)
      try {
        const response = await analisisService.getCentrosGestores(0, 100, 'codigo', 'asc')
        const payload =
          response?.content ||
          response?.centros ||
          response?.data ||
          response ||
          []
        if (!isMounted) return
        const centrosConDetalles = payload.filter(
          (centro) => centro?.detallesPonderados?.length > 0
        )

        setCentrosGestores(centrosConDetalles)

        if (centrosConDetalles.length > 0) {
          const primerCentro = centrosConDetalles[0]
          setSelectedCentroCodigo(primerCentro.codigo)
          const ultimoDetalle =
            primerCentro.detallesPonderados[primerCentro.detallesPonderados.length - 1]
          setSelectedDetalle(ultimoDetalle)
          setDetalleYear(new Date().getFullYear())
        }
      } catch (error) {
        if (!isMounted) return
        setCentrosError('No pudimos cargar los centros desde el backend.')
      } finally {
        if (isMounted) setCentrosLoading(false)
      }
    }

    fetchCentros()

    return () => {
      isMounted = false
    }
  }, [])

  useEffect(() => {
    if (localData?.year) {
      setDetalleYear(localData.year)
    }
  }, [localData?.year])

  const selectedCentro = centrosGestores.find((centro) => centro.codigo === selectedCentroCodigo)

  const handleCentroChange = (codigo) => {
    setSelectedCentroCodigo(codigo)
    const centroSeleccionado = centrosGestores.find((centro) => centro.codigo === codigo)
    const ultimoDetalle =
      centroSeleccionado?.detallesPonderados?.slice(-1)[0] ?? null
    setSelectedDetalle(ultimoDetalle)
    setDetalleYear(new Date().getFullYear())
  }

  const detalleMonths = useMemo(
    () => (selectedDetalle ? mapDetalleToMonths(selectedDetalle) : null),
    [selectedDetalle]
  )

  const activeMonths = detalleMonths || localData?.months || null
  const chartData = useMemo(() => {
    if (!activeMonths) return []
    return MONTH_NAMES.map((month) => ({
      label: month.label,
      value: parseFloat(activeMonths[month.key]) || 0
    }))
  }, [activeMonths])

  const tableData = useMemo(() => {
    if (!activeMonths) return []
    return MONTH_NAMES.map((month) => ({
      month: month.fullLabel,
      percentage: parseFloat(activeMonths[month.key]) || 0
    }))
  }, [activeMonths])

  const chartKey = useMemo(() => {
    if (!activeMonths) return 'default'
    return JSON.stringify(activeMonths)
  }, [activeMonths])

  const displayCenter = selectedCentro?.nombreCentroGestor || localData?.costCenter || 'Sin centro'
  const displayYear = detalleYear || localData?.year || new Date().getFullYear()

  const exportToCSV = () => {
    if (!tableData || tableData.length === 0) {
      alert('No hay datos para exportar')
      return
    }

    // Encabezados del CSV
    const headers = ['Mes', 'Porcentaje (%)']
    
    // Filas de datos
    const rows = tableData.map((row) => [
      row.month,
      row.percentage.toFixed(2)
    ])

    // Combinar encabezados y filas
    const csvContent = [
      // Información del contexto
      `Centro Gestor,${displayCenter}`,
      `Código,${selectedCentro?.codigo || 'N/A'}`,
      `Año,${displayYear}`,
      '', // Línea vacía
      // Encabezados de la tabla
      headers.join(','),
      // Datos
      ...rows.map((row) => row.join(','))
    ].join('\n')

    // Crear blob y descargar
    const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    
    link.setAttribute('href', url)
    link.setAttribute('download', `gastos_${selectedCentro?.codigo || 'centro'}_${displayYear}_${new Date().toISOString().split('T')[0]}.csv`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const exportAllReportsToCSV = async () => {
    setExportingAll(true)
    try {
      // Obtener todos los centros gestores con sus detalles
      const response = await analisisService.getCentrosGestores(0, 100, 'codigo', 'asc')
      const payload =
        response?.content ||
        response?.centros ||
        response?.data ||
        response ||
        []

      // Filtrar solo centros con detalles
      const centrosConDetalles = payload.filter(
        (centro) => centro?.detallesPonderados?.length > 0
      )

      if (centrosConDetalles.length === 0) {
        alert('No hay reportes para exportar')
        return
      }

      // Preparar encabezados del CSV
      const monthHeaders = MONTH_NAMES.map((m) => m.fullLabel)
      const headers = ['Centro Gestor', 'Código', 'Año', ...monthHeaders, 'Total (%)']

      // Preparar filas de datos
      const rows = []
      centrosConDetalles.forEach((centro) => {
        centro.detallesPonderados.forEach((detalle) => {
          const meses = mapDetalleToMonths(detalle)
          const valores = MONTH_NAMES.map((month) => {
            const valor = parseFloat(meses[month.key]) || 0
            return valor.toFixed(2)
          })
          const total = valores.reduce((sum, val) => sum + parseFloat(val), 0).toFixed(2)
          
          // Usar el año actual ya que el detalle no tiene campo de año
          const año = new Date().getFullYear()
          
          rows.push([
            centro.nombreCentroGestor || 'N/A',
            centro.codigo || 'N/A',
            año.toString(),
            ...valores,
            total
          ])
        })
      })

      // Combinar encabezados y filas
      const csvContent = [
        headers.join(','),
        ...rows.map((row) => row.join(','))
      ].join('\n')

      // Crear blob y descargar
      const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' })
      const link = document.createElement('a')
      const url = URL.createObjectURL(blob)

      link.setAttribute('href', url)
      link.setAttribute(
        'download',
        `reporte_completo_gastos_${new Date().toISOString().split('T')[0]}.csv`
      )
      link.style.visibility = 'hidden'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } catch (error) {
      console.error('Error al exportar todos los reportes:', error)
      alert('Error al exportar los reportes. Por favor, intenta nuevamente.')
    } finally {
      setExportingAll(false)
    }
  }

  if (centrosLoading) {
    return (
      <PageLayout showNavigation onNavigate={navigate}>
        <div className="flex items-center justify-center min-h-[400px]">
          <p className="text-[#479e8d] text-lg">Cargando centros gestores...</p>
        </div>
      </PageLayout>
    )
  }

  if (centrosError) {
    return (
      <PageLayout showNavigation onNavigate={navigate}>
        <div className="flex items-center justify-center min-h-[400px] px-6">
          <p className="text-red-600 text-lg text-center">{centrosError}</p>
        </div>
      </PageLayout>
    )
  }

  return (
    <PageLayout showNavigation onNavigate={navigate}>
      <div className="flex flex-col max-w-[960px] flex-1">
        <div className="flex flex-wrap justify-between gap-3 p-4">
          <p className="text-[#0d1c19] tracking-light text-[32px] font-bold leading-tight min-w-72">
            Resumen de Gastos por Centro de Costos
          </p>
        </div>

        <div className="flex flex-wrap gap-3 px-4 pb-4 text-sm">
          <label className="flex flex-col gap-1 w-full max-w-[420px]">
            <span className="text-[#0d1c19] font-semibold">Centro Gestor</span>
            <select
              className="rounded-lg border border-[#cee9e3] bg-white px-3 py-2 text-[#0d1c19] focus:outline-none focus:ring-2 focus:ring-[#479e8d]"
              value={selectedCentroCodigo}
              onChange={(event) => handleCentroChange(event.target.value)}
            >
              {centrosGestores.map((centro) => (
                <option key={centro.centroGestorId} value={centro.codigo}>
                  {centro.codigo} — {centro.nombreCentroGestor}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="flex flex-wrap gap-3 px-4 pb-4 text-sm">
          <div className="rounded-lg border border-[#cee9e3] bg-[#f8fcfb] px-4 py-2">
            <p className="text-[#0d1c19] font-semibold leading-tight">Centro</p>
            <p className="text-[#479e8d]">{displayCenter}</p>
            {selectedCentro?.codigo && (
              <p className="text-[#479e8d] text-xs">Código: {selectedCentro.codigo}</p>
            )}
          </div>
          <div className="rounded-lg border border-[#cee9e3] bg-[#f8fcfb] px-4 py-2">
            <p className="text-[#0d1c19] font-semibold leading-tight">Año</p>
            <p className="text-[#479e8d]">{displayYear}</p>
          </div>
        </div>

        <div className="flex justify-end px-4 pb-2">
          <button
            type="button"
            onClick={exportToCSV}
            disabled={!tableData || tableData.length === 0}
            className="flex items-center gap-2 rounded-lg bg-[#479e8d] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#3a8a7a] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-[#479e8d]"
            title="Exportar datos a CSV"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            Exportar CSV
          </button>
        </div>

        <BarChart
          key={chartKey}
          data={chartData}
          title="Gastos Mensuales por Centro de Costos"
        />

        <DataTable
          columns={[
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
          ]}
          data={tableData}
          emptyMessage="No hay datos disponibles para mostrar"
        />

        <div className="flex justify-center px-4 pt-6 pb-4">
          <button
            type="button"
            onClick={exportAllReportsToCSV}
            disabled={exportingAll || centrosGestores.length === 0}
            className="flex items-center gap-2 rounded-lg bg-[#0d1c19] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#1a2e2a] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-[#0d1c19]"
            title="Descargar todos los reportes realizados en formato resumido"
          >
            {exportingAll ? (
              <>
                <svg
                  className="animate-spin h-5 w-5"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Exportando...
              </>
            ) : (
              <>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                Descargar Todos los Reportes (Resumen)
              </>
            )}
          </button>
        </div>
      </div>
    </PageLayout>
  )
}

export default Details
