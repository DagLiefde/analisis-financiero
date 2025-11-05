import PropTypes from 'prop-types'

/**
 * Button Component
 * Componente reutilizable para botones
 * Sigue el principio de Open/Closed
 */
const Button = ({ 
  children, 
  onClick, 
  type = 'button',
  variant = 'primary',
  disabled = false,
  fullWidth = false,
  className = '',
  ...props 
}) => {
  const baseClasses = 'flex cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 text-sm font-bold leading-normal tracking-[0.015em] transition-colors'
  
  const variantClasses = {
    primary: 'bg-[#479e8d] hover:bg-[#3ebdac] text-white',
    secondary: 'bg-[#e6f4f1] hover:bg-[#cee9e3] text-[#0d1c19]',
    outline: 'border-2 border-[#479e8d] text-[#479e8d] hover:bg-[#e6f4f1]',
  }

  const disabledClasses = 'opacity-50 cursor-not-allowed'
  const widthClasses = fullWidth ? 'w-full' : 'min-w-[84px] max-w-[480px]'

  const buttonClasses = `${baseClasses} ${variantClasses[variant]} ${widthClasses} ${disabled ? disabledClasses : ''} ${className}`

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={buttonClasses}
      {...props}
    >
      <span className="truncate">{children}</span>
    </button>
  )
}

Button.propTypes = {
  children: PropTypes.node.isRequired,
  onClick: PropTypes.func,
  type: PropTypes.oneOf(['button', 'submit', 'reset']),
  variant: PropTypes.oneOf(['primary', 'secondary', 'outline']),
  disabled: PropTypes.bool,
  fullWidth: PropTypes.bool,
  className: PropTypes.string,
}

export default Button

