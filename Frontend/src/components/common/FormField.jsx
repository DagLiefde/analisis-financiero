import PropTypes from 'prop-types'

/**
 * FormField Component
 * Componente reutilizable para campos de formulario
 * Sigue el principio de Open/Closed - extensible sin modificar el código base
 */
const FormField = ({ 
  label, 
  type = 'text', 
  placeholder, 
  value, 
  onChange, 
  required = false,
  disabled = false,
  error = null,
  ...props 
}) => {
  const inputClasses = `form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-[#0d1c19] focus:outline-0 focus:ring-0 border bg-[#f8fcfb] h-14 placeholder:text-[#479e8d] p-[15px] text-base font-normal leading-normal ${
    error ? 'border-red-500 focus:border-red-500' : 'border-[#cee9e3] focus:border-[#cee9e3]'
  } ${disabled ? 'bg-[#e6f4f1] cursor-not-allowed' : ''}`

  return (
    <div className="flex max-w-[480px] flex-wrap items-end gap-4 px-4 py-3">
      <label className="flex flex-col min-w-40 flex-1">
        <p className="text-[#0d1c19] text-base font-medium leading-normal pb-2">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </p>
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          required={required}
          disabled={disabled}
          className={inputClasses}
          {...props}
        />
        {error && (
          <p className="text-red-500 text-sm mt-1">{error}</p>
        )}
      </label>
    </div>
  )
}

FormField.propTypes = {
  label: PropTypes.string.isRequired,
  type: PropTypes.string,
  placeholder: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onChange: PropTypes.func.isRequired,
  required: PropTypes.bool,
  disabled: PropTypes.bool,
  error: PropTypes.string,
}

export default FormField

