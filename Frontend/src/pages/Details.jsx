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
      </div>
    </PageLayout>
  )
}

export default Details
