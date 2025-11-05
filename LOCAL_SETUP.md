# Guía de Setup Local - Frontend y Backend

Esta guía explica cómo ejecutar localmente el frontend y backend de la aplicación de Análisis Financiero sin usar Docker o Kubernetes.

## 📋 Prerrequisitos

### Backend (Spring Boot)
- **Java 17** o superior
- **Maven** (incluido como wrapper `mvnw`)
- **PostgreSQL 13** o superior
- Variables de entorno configuradas para la base de datos

### Frontend (React + Vite)
- **Node.js 18** o superior
- **npm** o **yarn**

## 🔧 Configuración del Backend

### 1. Configurar Variables de Entorno

El backend requiere las siguientes variables de entorno. Puedes configurarlas en tu sistema o crear un archivo `.env` y exportarlas:

```bash
# Base de datos PostgreSQL
export DB_URL=jdbc:postgresql://localhost:5432/analisis_financiero
export DB_USERNAME=tu_usuario
export DB_PASSWORD=tu_contraseña

# Configuración del servidor
export SERVER_PORT=8080
export CONTEXT_PATH=/api

# JWT Secret (genera uno seguro)
export JWT_SECRET=tu_jwt_secret_muy_seguro_aqui

# CORS (opcional - si no se define, permite todos los orígenes)
export ALLOWED_ORIGINS=http://localhost:3000
```

### 2. Crear la Base de Datos

Ejecuta en PostgreSQL:

```sql
CREATE DATABASE analisis_financiero;
```

### 3. Ejecutar el Backend

Navega al directorio del backend:

```bash
cd AnalisisFinanciero_PI_1_Backend
```

Ejecuta el backend con Maven:

```bash
# En Linux/Mac
./mvnw spring-boot:run

# En Windows
mvnw.cmd spring-boot:run
```

El backend estará disponible en:
- **URL Base**: `http://localhost:8080/api`
- **Swagger UI**: `http://localhost:8080/doc/swagger-ui.html`
- **API Docs**: `http://localhost:8080/api/v3/api-docs`

## 🎨 Configuración del Frontend

### 1. Instalar Dependencias

Navega al directorio del frontend:

```bash
cd Frontend/AnalisisFinanciero_PI_1_Frontend
```

Instala las dependencias:

```bash
npm install
```

### 2. Configurar Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto frontend:

```env
# Configuración del Backend API
VITE_API_URL=http://localhost:8080/api

# Timeout para las peticiones HTTP (en milisegundos)
VITE_API_TIMEOUT=10000

# Entorno de desarrollo
VITE_ENV=development
```

**Nota**: Puedes copiar el archivo `.env.example` como base:

```bash
cp .env.example .env
```

### 3. Ejecutar el Frontend

Ejecuta el servidor de desarrollo:

```bash
npm run dev
```

El frontend estará disponible en:
- **URL**: `http://localhost:3000`

## 🚀 Ejecutar Ambos Servicios

### Opción 1: Terminales Separadas (Recomendado)

**Terminal 1 - Backend:**
```bash
cd AnalisisFinanciero_PI_1_Backend
./mvnw spring-boot:run
```

**Terminal 2 - Frontend:**
```bash
cd Frontend/AnalisisFinanciero_PI_1_Frontend
npm run dev
```

### Opción 2: Scripts de Inicio

Puedes crear scripts personalizados para iniciar ambos servicios. Por ejemplo, un script `start-dev.sh`:

```bash
#!/bin/bash
# Iniciar backend en background
cd AnalisisFinanciero_PI_1_Backend
./mvnw spring-boot:run &
BACKEND_PID=$!

# Esperar a que el backend esté listo
sleep 10

# Iniciar frontend
cd ../Frontend/AnalisisFinanciero_PI_1_Frontend
npm run dev

# Detener backend al salir
kill $BACKEND_PID
```

## ✅ Verificar la Integración

### 1. Verificar que el Backend está Corriendo

Abre tu navegador y visita:
- Swagger UI: `http://localhost:8080/doc/swagger-ui.html`
- Health Check: `http://localhost:8080/api/actuator/health`

### 2. Verificar que el Frontend está Corriendo

Abre tu navegador y visita:
- Frontend: `http://localhost:3000`

### 3. Probar la Conexión

1. Abre la consola del navegador (F12)
2. Intenta hacer login en el frontend
3. Verifica que las peticiones HTTP se envían correctamente a `http://localhost:8080/api`

### 4. Verificar CORS

Si ves errores de CORS en la consola del navegador:
- El backend está configurado para permitir todos los orígenes por defecto
- Si necesitas restringir orígenes, configura `ALLOWED_ORIGINS` en el backend

## 🔍 Endpoints Disponibles

### Autenticación
- `POST /api/auth/login` - Iniciar sesión

### Centros Gestores
- `GET /api/centros-gestores/{codigo}` - Buscar por código
- `GET /api/centros-gestores/{codigo}/detalles` - Buscar con detalles
- `GET /api/centros-gestores/detalles` - Listar todos con detalles (paginado)

### Clasificadores Presupuestales
- `GET /api/clasificadores/{codigo}` - Buscar por código
- `GET /api/clasificadores/{codigo}/detalles` - Buscar con detalles
- `GET /api/clasificadores/detalles` - Listar todos con detalles (paginado)

### Detalles Ponderados
- `POST /api/detalle-ponderado-centro-gestor` - Crear detalle centro gestor
- `POST /api/detalle-ponderado-clasificador` - Crear detalle clasificador

### Administración (Requiere autenticación y rol ADMINISTRADOR)
- `POST /api/admin/usuarios` - Crear usuario
- `GET /api/admin/roles` - Listar roles
- `GET /api/admin/usuarios` - Listar usuarios

## 🐛 Solución de Problemas

### Backend no inicia

1. **Verifica Java 17:**
   ```bash
   java -version
   ```

2. **Verifica las variables de entorno:**
   ```bash
   echo $DB_URL
   echo $JWT_SECRET
   ```

3. **Verifica que PostgreSQL esté corriendo:**
   ```bash
   # Linux/Mac
   sudo systemctl status postgresql
   
   # O verifica la conexión
   psql -U tu_usuario -d analisis_financiero
   ```

4. **Limpia y reconstruye:**
   ```bash
   ./mvnw clean install
   ./mvnw spring-boot:run
   ```

### Frontend no se conecta al Backend

1. **Verifica que el backend esté corriendo:**
   ```bash
   curl http://localhost:8080/api/actuator/health
   ```

2. **Verifica el archivo `.env`:**
   ```bash
   cat .env
   ```
   Debe contener: `VITE_API_URL=http://localhost:8080/api`

3. **Verifica que el puerto del backend sea 8080:**
   - Revisa `application.properties` o la variable `SERVER_PORT`

4. **Reinicia el servidor de desarrollo:**
   ```bash
   # Detén el servidor (Ctrl+C) y vuelve a iniciarlo
   npm run dev
   ```

### Errores de CORS

Si ves errores de CORS en la consola del navegador:

1. **Verifica la configuración de CORS en el backend:**
   - El archivo `CorsConfig.java` permite todos los orígenes por defecto
   - Si necesitas restringir, configura `ALLOWED_ORIGINS=http://localhost:3000`

2. **Verifica que el frontend esté en el puerto correcto:**
   - El frontend debe correr en el puerto 3000 (configurado en `vite.config.js`)

### Errores de Autenticación

1. **Verifica que el token se esté guardando:**
   - Abre DevTools → Application → Local Storage
   - Debe haber una clave `token` con el JWT

2. **Verifica el formato de las credenciales:**
   - El backend espera: `{ "email": "usuario@udea.edu.co", "password": "contraseña" }`

3. **Revisa la respuesta del backend:**
   - Abre DevTools → Network → busca la petición `/auth/login`
   - Verifica la respuesta y los códigos de estado HTTP

## 📝 Notas Importantes

1. **Puertos:**
   - Backend: `8080` (configurable con `SERVER_PORT`)
   - Frontend: `3000` (configurable en `vite.config.js`)

2. **Context Path:**
   - El backend usa `/api` como context path
   - Todas las URLs del frontend deben incluir `/api` al final de la URL base

3. **Variables de Entorno:**
   - El frontend usa variables con prefijo `VITE_` (requerido por Vite)
   - El backend usa variables de entorno estándar o `application.properties`

4. **Autenticación:**
   - El frontend guarda el token JWT en `localStorage`
   - El interceptor de axios añade automáticamente el header `Authorization: Bearer <token>`

5. **CORS:**
   - El backend permite todos los orígenes por defecto en desarrollo
   - En producción, configura `ALLOWED_ORIGINS` para restringir orígenes

## 🎯 Próximos Pasos

1. **Ejecuta ambos servicios** siguiendo las instrucciones anteriores
2. **Accede a Swagger** para ver la documentación de la API
3. **Prueba el login** desde el frontend
4. **Explora los endpoints** disponibles según tu rol y permisos

## 📚 Documentación Adicional

- **Backend README**: `AnalisisFinanciero_PI_1_Backend/README.md`
- **Frontend README**: `Frontend/AnalisisFinanciero_PI_1_Frontend/README.md`
- **Swagger UI**: `http://localhost:8080/doc/swagger-ui.html`

---

**Última actualización**: Integración local completada sin Docker/Kubernetes

