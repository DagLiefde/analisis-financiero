import PropTypes from 'prop-types'

/**
 * Footer Component
 * Componente reutilizable para el pie de página
 * Sigue el principio de Single Responsibility
 */
const Footer = ({ links = [], year = 2024, companyName = 'Análisis Financiero' }) => {
  const defaultLinks = [
    { href: '#', label: 'Términos' },
    { href: '#', label: 'Privacidad' },
  ]

  const footerLinks = links.length > 0 ? links : defaultLinks

  return (
    <footer className="flex justify-center">
      <div className="flex max-w-[960px] flex-1 flex-col">
        <footer className="flex flex-col gap-6 px-5 py-10 text-center">
          <div className="flex flex-wrap items-center justify-center gap-6">
            {footerLinks.map((link, index) => (
              <a
                key={index}
                className="text-[#479e8d] text-base font-normal leading-normal min-w-40 hover:underline"
                href={link.href}
              >
                {link.label}
              </a>
            ))}
          </div>
          <p className="text-[#479e8d] text-base font-normal leading-normal">
            @{year} {companyName}
          </p>
        </footer>
      </div>
    </footer>
  )
}

Footer.propTypes = {
  links: PropTypes.arrayOf(
    PropTypes.shape({
      href: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
    })
  ),
  year: PropTypes.number,
  companyName: PropTypes.string,
}

export default Footer

