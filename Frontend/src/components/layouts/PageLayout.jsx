import PropTypes from 'prop-types'
import Header from '../common/Header'
import Footer from '../common/Footer'

/**
 * PageLayout Component
 * Layout reutilizable para páginas de la aplicación
 * Sigue el principio de Single Responsibility
 */
const PageLayout = ({ children, showNavigation = false, onNavigate }) => {
  return (
    <div 
      className="min-h-screen bg-[#f8fcfb] flex flex-col" 
      style={{ fontFamily: 'Manrope, "Noto Sans", sans-serif' }}
    >
      <Header showNavigation={showNavigation} onNavigate={onNavigate} />
      
      <div className="px-4 md:px-40 flex flex-1 justify-center py-5">
        {children}
      </div>

      <Footer />
    </div>
  )
}

PageLayout.propTypes = {
  children: PropTypes.node.isRequired,
  showNavigation: PropTypes.bool,
  onNavigate: PropTypes.func,
}

export default PageLayout

