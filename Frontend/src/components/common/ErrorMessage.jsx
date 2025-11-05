const ErrorMessage = ({ message, onRetry }) => {
  return (
    <div className="bg-secondary-light border border-primary rounded-lg p-4">
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <svg className="h-5 w-5 text-primary" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
        </div>
        <div className="ml-3 flex-1">
          <h3 className="text-sm font-medium text-text-primary">Error</h3>
          <p className="mt-1 text-sm text-text-secondary">{message}</p>
          {onRetry && (
            <button
              onClick={onRetry}
              className="mt-3 text-sm font-medium text-primary hover:text-primary-light"
            >
              Intentar de nuevo
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default ErrorMessage

