const Card = ({ title, children, className = '', actions }) => {
  return (
    <div className={`card ${className}`}>
      {title && (
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-text-primary">{title}</h3>
          {actions && <div className="flex space-x-2">{actions}</div>}
        </div>
      )}
      {children}
    </div>
  )
}

export default Card

