import PropTypes from 'prop-types'
import { useMemo, useEffect } from 'react'

/**
 * BarChart Component
 * Componente para visualizar datos en gráfico de barras
 * Sigue el principio de Single Responsibility
 */
const BarChart = ({ data, title }) => {
  const maxValue = useMemo(() => {
    if (!data || data.length === 0) return 100
    return Math.max(...data.map(item => item.value), 1)
  }, [data])

  // Agregar estilos CSS para animación
  useEffect(() => {
    const styleId = 'barchart-animations'
    if (!document.getElementById(styleId)) {
      const style = document.createElement('style')
      style.id = styleId
      style.textContent = `
        @keyframes slideUp {
          from {
            transform: scaleY(0);
            opacity: 0.5;
          }
          to {
            transform: scaleY(1);
            opacity: 1;
          }
        }
        .bar-animated {
          transform-origin: bottom;
          animation: slideUp 0.6s ease-out forwards;
        }
      `
      document.head.appendChild(style)
    }
  }, [])

  if (!data || data.length === 0) {
    return (
      <div className="flex min-w-72 flex-1 flex-col gap-2 rounded-lg border border-[#cee9e3] p-6">
        <p className="text-[#0d1c19] text-base font-medium leading-normal">{title}</p>
        <div className="flex items-center justify-center min-h-[180px]">
          <p className="text-[#479e8d] text-sm">No hay datos para mostrar</p>
        </div>
      </div>
    )
  }

  // Altura máxima de las barras en píxeles
  const maxBarHeight = 200

  return (
    <div className="flex flex-wrap gap-4 px-4 py-6">
      <div className="flex min-w-72 flex-1 flex-col gap-2 rounded-lg border border-[#cee9e3] p-6">
        <p className="text-[#0d1c19] text-base font-medium leading-normal mb-4">
          {title}
        </p>
        <div className="flex items-end justify-center gap-3 min-h-[250px] px-3 pb-8">
          {data.map((item, index) => {
            const heightPercentage = maxValue > 0 ? (item.value / maxValue) * 100 : 0
            const barHeight = (heightPercentage / 100) * maxBarHeight
            
            return (
              <div key={`${item.label}-${index}`} className="flex flex-col items-center gap-2 flex-1">
                {/* Contenedor de la barra con altura fija para alineación */}
                <div 
                  className="flex items-end justify-center w-full"
                  style={{ height: `${maxBarHeight}px` }}
                >
                  {/* Barra animada */}
                  <div
                    className="border-[#479e8d] bg-[#479e8d] border-t-2 rounded-t-lg w-full relative transition-all duration-300 ease-out hover:bg-[#3ebdac] hover:border-[#3ebdac] hover:shadow-md bar-animated"
                    style={{ 
                      height: `${Math.max(barHeight, 5)}px`,
                      minHeight: '5px'
                    }}
                    title={`${item.label}: ${item.value.toFixed(2)}%`}
                  >
                    {/* Valor sobre la barra */}
                    {barHeight > 20 && (
                      <span className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-[#0d1c19] text-xs font-semibold whitespace-nowrap">
                        {item.value.toFixed(1)}%
                      </span>
                    )}
                  </div>
                </div>
                {/* Etiqueta del mes */}
                <p className="text-[#479e8d] text-[13px] font-bold leading-normal tracking-[0.015em] mt-1">
                  {item.label}
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

BarChart.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      value: PropTypes.number.isRequired,
    })
  ).isRequired,
  title: PropTypes.string.isRequired,
}

export default BarChart

