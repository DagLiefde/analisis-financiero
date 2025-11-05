import { useState } from 'react'
import PageLayout from '../components/layouts/PageLayout'
import FormField from '../components/common/FormField'
import Button from '../components/common/Button'
import useAuth from '../hooks/useAuth'

/**
 * Login Page
 * Página de inicio de sesión refactorizada con componentes reutilizables
 * Sigue principios SOLID: Single Responsibility y Dependency Inversion
 */
const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const { login, loading, error } = useAuth()

  const handleSubmit = async (e) => {
    e.preventDefault()
    await login({ email, password })
  }

  return (
    <PageLayout>
      <div className="flex flex-col w-full max-w-[512px] py-5">
        <h2 className="text-[#0d1c19] tracking-light text-[28px] font-bold leading-tight px-4 text-center pb-3 pt-5">
          Bienvenido
        </h2>

        <form onSubmit={handleSubmit}>
          <FormField
            label="Email"
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <FormField
            label="Contraseña"
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {error && (
            <div className="px-4 py-2">
              <p className="text-red-500 text-sm text-center">{error}</p>
            </div>
          )}

          <div className="flex px-4 py-3">
            <Button 
              type="submit" 
              fullWidth 
              disabled={loading}
            >
              {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
            </Button>
          </div>

          <p className="text-[#479e8d] text-sm font-normal leading-normal pb-3 pt-1 px-4 text-center underline cursor-pointer">
            ¿Olvidaste tu contraseña?
          </p>
        </form>
      </div>
    </PageLayout>
  )
}

export default Login
