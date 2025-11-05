# Análisis Financiero - Frontend

Frontend del sistema de análisis financiero construido con **React**, **Vite** y **TailwindCSS**, siguiendo principios **SOLID** y arquitectura por capas.

## 🚀 Características

- ⚛️ React 18 con Vite
- 🎨 TailwindCSS con colores institucionales
- 🧭 React Router para navegación
- 📡 Axios con interceptores para peticiones HTTP
- 🏗️ Arquitectura por capas (Presentación, Lógica, Datos, Configuración)
- 🧩 Componentes reutilizables aplicando SOLID
- 🪝 Custom hooks para lógica de negocio
- 🔐 Sistema de autenticación
- 🌍 Variables de entorno para múltiples ambientes
- 📊 Componentes de visualización (Gráficos, Tablas)

## 📚 Documentación

- 📖 **[ARCHITECTURE.md](./ARCHITECTURE.md)** - Arquitectura del proyecto y principios SOLID
- 🔧 **[ENV_SETUP.md](./ENV_SETUP.md)** - Guía de configuración de variables de entorno

## 📁 Estructura del Proyecto

```
src/
├── components/          # Componentes reutilizables
│   ├── common/         # Button, FormField, Header, Footer
│   ├── charts/         # BarChart
│   ├── tables/         # DataTable
│   └── layouts/        # PageLayout
├── pages/              # Páginas de la aplicación
│   ├── Login.jsx       # Página de login
│   ├── Form.jsx        # Formulario de datos
│   └── Details.jsx     # Detalles con gráficos
├── services/           # Servicios para consumo de API
│   ├── api.js          # Cliente HTTP configurado
│   ├── analisisService.js
│   └── reportesService.js
├── hooks/              # Custom hooks
│   ├── useAuth.js      # Hook de autenticación
│   └── useFormData.js  # Hook de datos de formulario
├── config/             # Configuraciones
│   └── api.config.js   # Configuración de API y endpoints
├── utils/              # Utilidades y helpers
│   ├── validators.js
│   └── formatters.js
├── styles/             # Estilos globales
│   └── index.css
└── App.jsx             # Componente principal
```

## 🛠️ Instalación

### 1. Clona el repositorio

```bash
git clone https://github.com/garcialvarez/AnalisisFinanciero_PI_1_Frontend.git
cd AnalisisFinanciero_PI_1_Frontend
```

### 2. Instala las dependencias

```bash
npm install
```

### 3. Configura las variables de entorno

Crea un archivo `.env` en la raíz del proyecto:

```env
# API Configuration
VITE_API_URL=http://localhost:8080/api
VITE_API_TIMEOUT=10000

# Environment
VITE_ENV=development
```

> 📝 **Nota**: Consulta [ENV_SETUP.md](./ENV_SETUP.md) para más detalles sobre configuración de ambientes.

## 📝 Scripts Disponibles

```bash
# Desarrollo
npm run dev          # Inicia el servidor de desarrollo (http://localhost:3000)

# Producción
npm run build        # Construye la aplicación para producción
npm run preview      # Previsualiza la build de producción

# Calidad de código
npm run lint         # Ejecuta el linter
```

## 🎨 Tecnologías Utilizadas

- **React 18** - Librería de UI
- **Vite** - Build tool y dev server ultra-rápido
- **TailwindCSS** - Framework de CSS utility-first
- **React Router** - Enrutamiento declarativo
- **Axios** - Cliente HTTP con interceptores
- **PropTypes** - Validación de tipos en componentes

## 🏗️ Arquitectura y Principios

Este proyecto sigue una **arquitectura por capas** aplicando **principios SOLID**:

### Capas de la Aplicación

1. **Capa de Presentación** - Componentes UI puros
2. **Capa de Lógica de Negocio** - Custom hooks
3. **Capa de Datos** - Servicios de API
4. **Capa de Configuración** - Variables de entorno

### Principios SOLID

- ✅ **Single Responsibility**: Cada componente tiene una única responsabilidad
- ✅ **Open/Closed**: Componentes extensibles sin modificar código
- ✅ **Liskov Substitution**: Componentes intercambiables
- ✅ **Interface Segregation**: Props específicas por componente
- ✅ **Dependency Inversion**: Dependencia de abstracciones (hooks)

> 📖 Lee más sobre la arquitectura en [ARCHITECTURE.md](./ARCHITECTURE.md)

## 🎯 Componentes Principales

### Componentes Comunes
- `Header` - Encabezado con logo y navegación
- `Footer` - Pie de página con enlaces
- `Button` - Botón con variantes (primary, secondary, outline)
- `FormField` - Campo de formulario con validación

### Componentes Especializados
- `BarChart` - Gráfico de barras personalizable
- `DataTable` - Tabla de datos con columnas configurables

### Layouts
- `PageLayout` - Layout base para páginas

### Custom Hooks
- `useAuth` - Manejo de autenticación
- `useFormData` - Almacenamiento y recuperación de datos

## 🌍 Variables de Entorno

### Desarrollo Local
```env
VITE_API_URL=http://localhost:8080/api
VITE_ENV=development
```

### Producción
```env
VITE_API_URL=https://api.tudominio.com/api
VITE_ENV=production
```

> 🔧 Consulta [ENV_SETUP.md](./ENV_SETUP.md) para configuración detallada

## 🚦 Empezando

```bash
# 1. Instalar dependencias
npm install

# 2. Configurar variables de entorno
# Crea .env con la URL de tu API

# 3. Iniciar servidor de desarrollo
npm run dev

# 4. Abrir en el navegador
# http://localhost:3000
```

## 📊 Vistas Disponibles

1. **Login** (`/login`) - Autenticación de usuarios
2. **Formulario** (`/form`) - Captura de datos mensuales
3. **Detalles** (`/details`) - Visualización con gráficos y tablas

## 🎨 Colores Institucionales

- `#0D1C1A` - Texto principal
- `#479E8C` - Color principal
- `#F7FCFA` - Color secundario
- `#CFE8E3` - Bordes
- `#3EBDAC` - Hover/Acciones

## 🔗 Backend

Este proyecto se conecta con el backend disponible en:
[AnalisisFinanciero_PI_1_Backend](https://github.com/garcialvarez/AnalisisFinanciero_PI_1_Backend)

## 🎨 Mockups

Los diseños están basados en los mockups de Figma:
[Vistas Principales](https://www.figma.com/design/Ywk5CmF1lueOkpBKGwbFql/Vistas-principales)

## 📄 Licencia

Este proyecto es privado y confidencial.
