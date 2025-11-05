import PropTypes from 'prop-types'

/**
 * DataTable Component
 * Componente reutilizable para tablas de datos
 * Sigue el principio de Single Responsibility
 */
const DataTable = ({ columns, data, emptyMessage = 'No hay datos disponibles' }) => {
  if (!data || data.length === 0) {
    return (
      <div className="px-4 py-3">
        <div className="flex overflow-hidden rounded-lg border border-[#cee9e3] bg-[#f8fcfb] p-6">
          <p className="text-[#479e8d] text-center w-full">{emptyMessage}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="px-4 py-3">
      <div className="flex overflow-hidden rounded-lg border border-[#cee9e3] bg-[#f8fcfb]">
        <table className="flex-1">
          <thead>
            <tr className="bg-[#f8fcfb]">
              {columns.map((column, index) => (
                <th
                  key={index}
                  className="px-4 py-3 text-left text-[#0d1c19] text-sm font-medium leading-normal"
                >
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, rowIndex) => (
              <tr key={rowIndex} className="border-t border-t-[#cee9e3]">
                {columns.map((column, colIndex) => (
                  <td
                    key={colIndex}
                    className={`h-[72px] px-4 py-2 text-sm font-normal leading-normal ${
                      column.highlight ? 'text-[#479e8d]' : 'text-[#0d1c19]'
                    }`}
                  >
                    {column.render ? column.render(row) : row[column.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

DataTable.propTypes = {
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      header: PropTypes.string.isRequired,
      key: PropTypes.string,
      render: PropTypes.func,
      highlight: PropTypes.bool,
    })
  ).isRequired,
  data: PropTypes.array.isRequired,
  emptyMessage: PropTypes.string,
}

export default DataTable

