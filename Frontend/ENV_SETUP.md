# Configuración de Variables de Entorno

## 📋 Guía de Configuración

Este documento explica cómo configurar las variables de entorno para diferentes ambientes (desarrollo local y producción).

## 🔧 Configuración Inicial

### 1. Crear archivo `.env`

Crea un archivo llamado `.env` en la **raíz del proyecto** (mismo nivel que `package.json`):

```bash
# En la raíz del proyecto
touch .env
```

### 2. Agregar Variables de Entorno

Agrega las siguientes variables al archivo `.env`:

```env
# ================================
# CONFIGURACIÓN DE API
# ================================

# URL base de la API backend
VITE_API_URL=http://localhost:8000/api

# Timeout para las peticiones HTTP (en milisegundos)
VITE_API_TIMEOUT=10000

# Entorno de ejecución
VITE_ENV=development
```

## 🌍 Configuraciones por Ambiente

### Desarrollo Local

**Archivo:** `.env` o `.env.development`

```env
# API local
VITE_API_URL=http://localhost:8000/api
VITE_API_TIMEOUT=10000
VITE_ENV=development
```

### Producción

**Archivo:** `.env.production`

```env
# API en la nube
VITE_API_URL=https://api.tudominio.com/api
VITE_API_TIMEOUT=30000
VITE_ENV=production
```

### Testing

**Archivo:** `.env.test`

```env
# API de pruebas
VITE_API_URL=http://localhost:8000/api
VITE_API_TIMEOUT=5000
VITE_ENV=test
```

## 📝 Variables Disponibles

| Variable | Descripción | Valor por Defecto | Requerido |
|----------|-------------|-------------------|-----------|
| `VITE_API_URL` | URL base de la API backend | `http://localhost:8000/api` | Sí |
| `VITE_API_TIMEOUT` | Timeout en milisegundos | `10000` | No |
| `VITE_ENV` | Ambiente de ejecución | `development` | No |

## 🔄 Cambiar entre Ambientes

### Opción 1: Múltiples archivos `.env`

Crea archivos separados y Vite los usará automáticamente:

```bash
.env                # Usado por defecto
.env.development    # Usado en desarrollo (npm run dev)
.env.production     # Usado en producción (npm run build)
```

### Opción 2: Modificar el archivo `.env`

Simplemente edita el archivo `.env` y cambia las URLs:

```env
# Para desarrollo local
VITE_API_URL=http://localhost:8000/api

# Para producción en AWS
VITE_API_URL=https://api-prod.tudominio.com/api

# Para producción en Azure
VITE_API_URL=https://api-azure.tudominio.com/api
```

### Opción 3: Variables de sistema

Puedes sobrescribir las variables con variables de sistema:

```bash
# En desarrollo
VITE_API_URL=http://localhost:8000/api npm run dev

# En producción
VITE_API_URL=https://api.tudominio.com/api npm run build
```

## 🎯 Uso en el Código

Las variables se acceden a través de `import.meta.env`:

```javascript
// En cualquier archivo .js o .jsx
console.log(import.meta.env.VITE_API_URL)
console.log(import.meta.env.VITE_ENV)
```

### Ejemplo Centralizado

En `src/config/api.config.js`:

```javascript
export const API_CONFIG = {
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api',
  timeout: parseInt(import.meta.env.VITE_API_TIMEOUT || '10000', 10),
}
```

## ⚠️ Notas Importantes

### 1. Prefijo `VITE_`

⚠️ **IMPORTANTE**: En Vite, todas las variables de entorno **DEBEN** comenzar con `VITE_` para ser expuestas al código cliente.

```env
# ✅ CORRECTO
VITE_API_URL=http://localhost:8000/api

# ❌ INCORRECTO (no será accesible)
API_URL=http://localhost:8000/api
```

### 2. Reiniciar el Servidor

Después de cambiar las variables de entorno, **debes reiniciar el servidor de desarrollo**:

```bash
# Detener con Ctrl+C y luego:
npm run dev
```

### 3. No Commitear `.env`

El archivo `.env` **NO debe** incluirse en el control de versiones:

```gitignore
# .gitignore
.env
.env.local
.env.*.local
```

### 4. Usar `.env.example`

Crea un archivo `.env.example` con valores de ejemplo:

```env
# .env.example
VITE_API_URL=http://localhost:8000/api
VITE_API_TIMEOUT=10000
VITE_ENV=development
```

Este archivo **SÍ** debe incluirse en Git como referencia.

## 🚀 Ejemplos de Uso

### Cambiar de Local a Producción

**Paso 1:** Edita `.env`

```env
# Cambiar esta línea:
VITE_API_URL=http://localhost:8000/api

# Por esta:
VITE_API_URL=https://api.tudominio.com/api
```

**Paso 2:** Reinicia el servidor

```bash
npm run dev
```

### Configurar para Producción en la Nube

**AWS:**
```env
VITE_API_URL=https://xyz123.execute-api.us-east-1.amazonaws.com/prod/api
```

**Azure:**
```env
VITE_API_URL=https://myapp.azurewebsites.net/api
```

**Google Cloud:**
```env
VITE_API_URL=https://myapp-xyz.uc.r.appspot.com/api
```

**Heroku:**
```env
VITE_API_URL=https://myapp.herokuapp.com/api
```

## 🔍 Verificar Variables

Para verificar que las variables están configuradas correctamente:

```javascript
// En cualquier componente o archivo
console.log('API URL:', import.meta.env.VITE_API_URL)
console.log('Environment:', import.meta.env.VITE_ENV)
console.log('Timeout:', import.meta.env.VITE_API_TIMEOUT)
```

O crea un componente de debug:

```jsx
// src/components/debug/EnvDebug.jsx
const EnvDebug = () => {
  if (import.meta.env.VITE_ENV !== 'development') return null
  
  return (
    <div style={{ position: 'fixed', bottom: 0, right: 0, background: '#000', color: '#0f0', padding: '10px' }}>
      <pre>
        {JSON.stringify({
          VITE_API_URL: import.meta.env.VITE_API_URL,
          VITE_ENV: import.meta.env.VITE_ENV,
        }, null, 2)}
      </pre>
    </div>
  )
}
```

## 📞 Soporte

Si tienes problemas con las variables de entorno:

1. Verifica que el prefijo `VITE_` esté presente
2. Reinicia el servidor de desarrollo
3. Limpia la caché: `rm -rf node_modules/.vite`
4. Verifica que el archivo `.env` esté en la raíz del proyecto

