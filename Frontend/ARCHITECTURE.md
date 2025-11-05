# Arquitectura del Proyecto - Frontend

## 📋 Descripción General

Este proyecto frontend sigue una arquitectura por capas aplicando principios **SOLID** y patrones de diseño modernos con React.

## 🏗️ Estructura del Proyecto

```
src/
├── components/           # Componentes reutilizables
│   ├── common/          # Componentes comunes (Button, FormField, Header, Footer)
│   ├── charts/          # Componentes de visualización (BarChart)
│   ├── tables/          # Componentes de tablas (DataTable)
│   └── layouts/         # Layouts de página (PageLayout)
├── hooks/               # Custom hooks
│   ├── useAuth.js       # Hook para autenticación
│   └── useFormData.js   # Hook para manejo de datos de formulario
├── pages/               # Páginas de la aplicación
│   ├── Login.jsx        # Página de inicio de sesión
│   ├── Form.jsx         # Página de formulario
│   └── Details.jsx      # Página de detalles con gráficos
├── services/            # Servicios de API
│   ├── api.js           # Cliente HTTP configurado
│   ├── analisisService.js
│   └── reportesService.js
├── config/              # Configuraciones
│   └── api.config.js    # Configuración de API y endpoints
├── utils/               # Utilidades
│   ├── validators.js    # Funciones de validación
│   └── formatters.js    # Funciones de formateo
└── styles/              # Estilos globales
    └── index.css
```

## 🎯 Principios SOLID Aplicados

### 1. Single Responsibility Principle (SRP)
Cada componente y módulo tiene una única responsabilidad:

- **Header.jsx**: Solo maneja el encabezado de la aplicación
- **Footer.jsx**: Solo maneja el pie de página
- **FormField.jsx**: Solo maneja campos de formulario individuales
- **Button.jsx**: Solo maneja la renderización de botones
- **BarChart.jsx**: Solo renderiza gráficos de barras
- **DataTable.jsx**: Solo renderiza tablas de datos
- **useAuth.js**: Solo maneja la lógica de autenticación
- **useFormData.js**: Solo maneja el almacenamiento y recuperación de datos

### 2. Open/Closed Principle (OCP)
Los componentes son extensibles sin modificar su código:

```jsx
// Button acepta múltiples variantes sin modificar el componente
<Button variant="primary">Enviar</Button>
<Button variant="secondary">Cancelar</Button>
<Button variant="outline">Ver más</Button>

// FormField acepta cualquier tipo de input
<FormField type="text" label="Nombre" />
<FormField type="email" label="Email" />
<FormField type="number" label="Edad" />
```

### 3. Liskov Substitution Principle (LSP)
Los componentes pueden ser sustituidos por sus variantes sin romper la funcionalidad:

```jsx
// Cualquier tipo de botón puede usarse en el mismo contexto
<Button onClick={handleSubmit}>Enviar</Button>
<Button variant="secondary" onClick={handleCancel}>Cancelar</Button>
```

### 4. Interface Segregation Principle (ISP)
Los componentes solo dependen de las props que realmente necesitan:

```jsx
// Header solo recibe las props necesarias
<Header title="Mi App" showNavigation={true} onNavigate={navigate} />

// Footer solo recibe lo que usa
<Footer year={2024} companyName="Acme Co" />
```

### 5. Dependency Inversion Principle (DIP)
Los componentes dependen de abstracciones (hooks, props) no de implementaciones concretas:

```jsx
// Login usa el hook useAuth (abstracción)
const { login, loading, error } = useAuth()

// Details usa el hook useFormData (abstracción)
const { data, loading } = useFormData('formData')
```

## 🔌 Variables de Entorno

### Configuración

Crea un archivo `.env` en la raíz del proyecto:

```env
# API Configuration
VITE_API_URL=http://localhost:8000/api
VITE_API_TIMEOUT=10000

# Environment
VITE_ENV=development
```

### Uso en el Código

Las variables de entorno se centralizan en `src/config/api.config.js`:

```javascript
export const API_CONFIG = {
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api',
  timeout: parseInt(import.meta.env.VITE_API_TIMEOUT || '10000', 10),
}
```

### Entornos

**Desarrollo Local:**
```env
VITE_API_URL=http://localhost:8000/api
VITE_ENV=development
```

**Producción:**
```env
VITE_API_URL=https://api.tudominio.com/api
VITE_ENV=production
```

## 📦 Capas de la Aplicación

### 1. Capa de Presentación (Presentation Layer)
- **Componentes UI puros** en `components/`
- Solo se encargan de renderizar
- Reciben datos por props
- Emiten eventos mediante callbacks

### 2. Capa de Lógica de Negocio (Business Logic Layer)
- **Custom Hooks** en `hooks/`
- Manejan la lógica de la aplicación
- Encapsulan estado y efectos
- Reutilizables entre componentes

### 3. Capa de Datos (Data Layer)
- **Services** en `services/`
- Comunicación con APIs
- Transformación de datos
- Manejo de errores HTTP

### 4. Capa de Configuración (Configuration Layer)
- **Config** en `config/`
- Variables de entorno
- Constantes de la aplicación
- Configuración de librerías externas

## 🔄 Flujo de Datos

```
Usuario → Página → Hook → Service → API
         ↓         ↓        ↓         ↓
    Componente → Estado → Cache → Backend
```

## 🎨 Componentes Reutilizables

### Common Components
- `Header`: Encabezado con logo y navegación
- `Footer`: Pie de página con enlaces
- `Button`: Botón con variantes (primary, secondary, outline)
- `FormField`: Campo de formulario con validación

### Specialized Components
- `BarChart`: Gráfico de barras personalizable
- `DataTable`: Tabla de datos con columnas configurables

### Layout Components
- `PageLayout`: Layout base para páginas

## 🪝 Custom Hooks

### useAuth
Maneja la autenticación del usuario:
```jsx
const { login, logout, isAuthenticated, loading, error } = useAuth()
```

### useFormData
Maneja el almacenamiento y recuperación de datos:
```jsx
const { data, setData, clearData, loading } = useFormData('formData')
```

## 📝 Convenciones de Código

1. **Nombres de archivos**: PascalCase para componentes (`Button.jsx`), camelCase para hooks (`useAuth.js`)
2. **PropTypes**: Todos los componentes tienen validación de props
3. **Comentarios**: JSDoc para funciones y componentes principales
4. **Exportaciones**: Export default para componentes, named exports para utilidades

## 🚀 Ventajas de esta Arquitectura

1. **Mantenibilidad**: Código organizado y fácil de mantener
2. **Reutilización**: Componentes y hooks reutilizables
3. **Testabilidad**: Componentes aislados fáciles de testear
4. **Escalabilidad**: Fácil agregar nuevas funcionalidades
5. **Flexibilidad**: Cambiar implementaciones sin romper la aplicación
6. **Separación de responsabilidades**: Cada capa tiene su función específica

## 📚 Recursos

- [React Documentation](https://react.dev/)
- [SOLID Principles](https://en.wikipedia.org/wiki/SOLID)
- [Vite Environment Variables](https://vitejs.dev/guide/env-and-mode.html)

