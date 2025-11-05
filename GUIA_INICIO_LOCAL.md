# Guía Paso a Paso: Iniciar Backend y Frontend Localmente

Esta guía te mostrará cómo iniciar ambos servicios (backend y frontend) localmente y conectarlos correctamente.

## 📋 Prerrequisitos

Antes de comenzar, asegúrate de tener instalado:

- ✅ **Java 17** o superior
- ✅ **Maven** (incluido como wrapper `mvnw` en el backend)
- ✅ **Node.js 18** o superior
- ✅ **npm** o **yarn**
- ✅ **PostgreSQL 15** (instalado y corriendo)
- ✅ **Homebrew** (para macOS)

## 🔍 Verificación Inicial

### 1. Verificar que PostgreSQL esté corriendo

```bash
# Verificar estado de PostgreSQL
brew services list | grep postgresql

# Si no está corriendo, iniciarlo:
brew services start postgresql@15

# Verificar que el puerto 5432 esté en uso
lsof -i :5432
```

**Salida esperada:**
```
postgresql@15  started  ...
```

### 2. Verificar que la base de datos existe

```bash
# Conectar a PostgreSQL y verificar la base de datos
/opt/homebrew/opt/postgresql@15/bin/psql -U $(whoami) -d postgres -c "\l" | grep bd_analisisfinanciero
```

**Si no existe, créala:**
```bash
/opt/homebrew/opt/postgresql@15/bin/psql -U $(whoami) -d postgres -c "CREATE DATABASE bd_analisisfinanciero;"
```

### 3. Verificar puertos disponibles

```bash
# Verificar que el puerto 8080 esté libre (backend)
lsof -i :8080

# Verificar que el puerto 3000 esté libre (frontend)
lsof -i :3000
```

Si algún puerto está en uso, detén el proceso o cambia el puerto en la configuración.

## 🚀 Método 1: Script Automático (Recomendado)

### Paso 1: Ejecutar el script

Desde la raíz del proyecto:

```bash
cd /Users/tomascadavid/Desktop/PI
./start-both.sh
```

El script:
- ✅ Verifica que PostgreSQL esté corriendo
- ✅ Verifica que la base de datos exista
- ✅ Inicia el backend automáticamente
- ✅ Espera a que el backend esté listo
- ✅ Crea el archivo `.env` si no existe
- ✅ Inicia el frontend automáticamente
- ✅ Muestra las URLs de acceso

### Paso 2: Verificar que ambos servicios estén corriendo

Espera aproximadamente 30-60 segundos para que ambos servicios inicien completamente. Verás mensajes como:

```
✅ Backend iniciado (PID: xxxxx)
✅ Backend listo en http://localhost:8080/api
✅ Frontend iniciado (PID: xxxxx)
✅ Servicios iniciados correctamente!
```

### Paso 3: Acceder a los servicios

Una vez que ambos servicios estén corriendo, podrás acceder a:

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8080/api
- **Swagger UI**: http://localhost:8080/api/doc/swagger-ui.html
- **Health Check**: http://localhost:8080/api/actuator/health

### Paso 4: Detener los servicios

Presiona `Ctrl+C` en la terminal donde ejecutaste el script. Esto detendrá ambos servicios automáticamente.

## 🔧 Método 2: Inicio Manual (Dos Terminales)

Si prefieres más control sobre el proceso, puedes iniciar cada servicio en una terminal separada.

### Terminal 1: Backend

```bash
# 1. Navegar al directorio del backend
cd /Users/tomascadavid/Desktop/PI/AnalisisFinanciero_PI_1_Backend

# 2. Iniciar el backend
./mvnw spring-boot:run
```

**Espera a ver este mensaje:**
```
Started AnalisisFinancieroBackApplication in X.XXX seconds
```

### Terminal 2: Frontend

```bash
# 1. Navegar al directorio del frontend
cd /Users/tomascadavid/Desktop/PI/Frontend/AnalisisFinanciero_PI_1_Frontend

# 2. Verificar que el archivo .env exista
cat .env
# Debe mostrar:
# VITE_API_URL=http://localhost:8080/api
# VITE_API_TIMEOUT=10000
# VITE_ENV=development

# 3. Si no existe, créalo:
cat > .env << EOF
VITE_API_URL=http://localhost:8080/api
VITE_API_TIMEOUT=10000
VITE_ENV=development
EOF

# 4. Instalar dependencias (solo la primera vez)
npm install

# 5. Iniciar el frontend
npm run dev
```

**Espera a ver este mensaje:**
```
  VITE v5.x.x  ready in XXX ms

  ➜  Local:   http://localhost:3000/
  ➜  Network: use --host to expose
```

## ✅ Verificación de la Conexión

### 1. Verificar que el backend esté corriendo

```bash
# Probar el health check
curl http://localhost:8080/api/actuator/health

# Debe retornar:
# {"status":"UP","components":{"db":{"status":"UP",...}}}
```

### 2. Verificar que el frontend esté corriendo

Abre tu navegador y visita: http://localhost:3000

Deberías ver la página de login.

### 3. Probar la conexión desde el frontend

1. Abre la consola del navegador (F12)
2. Ve a la pestaña "Network"
3. Intenta hacer login o cualquier acción que llame al backend
4. Verifica que las peticiones aparezcan en la consola
5. Verifica que las peticiones vayan a `http://localhost:8080/api`

### 4. Verificar en Swagger

1. Abre: http://localhost:8080/api/doc/swagger-ui.html
2. Deberías ver todos los endpoints disponibles
3. Prueba el endpoint `/auth/login` desde Swagger

## 🔍 Verificación de Logs

### Ver logs del backend

```bash
# Ver logs en tiempo real
tail -f /Users/tomascadavid/Desktop/PI/backend.log

# O si iniciaste manualmente, los logs aparecen en la terminal
```

### Ver logs del frontend

```bash
# Ver logs en tiempo real
tail -f /Users/tomascadavid/Desktop/PI/frontend.log

# O si iniciaste manualmente, los logs aparecen en la terminal
```

## 🐛 Solución de Problemas Comunes

### Problema 1: El backend no inicia

**Síntomas:**
- Error: "Connection to localhost:5432 refused"
- El backend no responde

**Solución:**
```bash
# 1. Verificar que PostgreSQL esté corriendo
brew services list | grep postgresql

# 2. Si no está corriendo:
brew services start postgresql@15

# 3. Esperar unos segundos y verificar:
lsof -i :5432

# 4. Verificar que la base de datos exista:
/opt/homebrew/opt/postgresql@15/bin/psql -U $(whoami) -d postgres -c "\l" | grep bd_analisisfinanciero
```

### Problema 2: El frontend no se conecta al backend

**Síntomas:**
- Error en consola: "Failed to fetch" o "Network Error"
- Las peticiones no llegan al backend

**Solución:**
```bash
# 1. Verificar que el backend esté corriendo
curl http://localhost:8080/api/actuator/health

# 2. Verificar el archivo .env del frontend
cat Frontend/AnalisisFinanciero_PI_1_Frontend/.env
# Debe contener: VITE_API_URL=http://localhost:8080/api

# 3. Si el archivo no existe o está mal, créalo:
cd Frontend/AnalisisFinanciero_PI_1_Frontend
cat > .env << EOF
VITE_API_URL=http://localhost:8080/api
VITE_API_TIMEOUT=10000
VITE_ENV=development
EOF

# 4. Reiniciar el frontend (Ctrl+C y luego npm run dev)
```

### Problema 3: Error de CORS

**Síntomas:**
- Error en consola: "CORS policy" o "Access-Control-Allow-Origin"

**Solución:**

El backend ya está configurado para permitir todos los orígenes en desarrollo. Si aún tienes problemas:

1. Verifica que el backend esté corriendo
2. Verifica que el frontend esté en el puerto 3000
3. Revisa los logs del backend para ver si hay errores de CORS

### Problema 4: Puerto 8080 o 3000 ya en uso

**Síntomas:**
- Error: "Port 8080 is already in use" o similar

**Solución:**

```bash
# Ver qué proceso está usando el puerto 8080
lsof -i :8080

# Detener el proceso (reemplaza PID con el número que aparezca)
kill -9 PID

# O para el puerto 3000:
lsof -i :3000
kill -9 PID
```

### Problema 5: El frontend muestra errores de compilación

**Síntomas:**
- Errores en la consola del navegador
- Errores de módulos no encontrados

**Solución:**

```bash
# 1. Limpiar node_modules y reinstalar
cd Frontend/AnalisisFinanciero_PI_1_Frontend
rm -rf node_modules package-lock.json
npm install

# 2. Reiniciar el servidor de desarrollo
npm run dev
```

## 📝 Estructura de Archivos Importantes

```
PI/
├── AnalisisFinanciero_PI_1_Backend/
│   ├── src/main/resources/
│   │   └── application.properties    # Configuración del backend
│   └── mvnw                          # Maven wrapper
│
├── Frontend/AnalisisFinanciero_PI_1_Frontend/
│   ├── .env                          # Variables de entorno (DEBE existir)
│   ├── vite.config.js                # Configuración de Vite con proxy
│   └── src/
│       ├── config/
│       │   └── api.config.js         # Configuración de API y endpoints
│       ├── services/
│       │   ├── api.js                # Cliente HTTP configurado
│       │   └── analisisService.js    # Servicios para endpoints del backend
│       └── hooks/
│           └── useAuth.js             # Hook de autenticación
│
├── start-both.sh                     # Script para iniciar ambos servicios
├── backend.log                       # Logs del backend
├── frontend.log                      # Logs del frontend
└── GUIA_INICIO_LOCAL.md             # Esta guía
```

## 🔗 Endpoints Disponibles

### Autenticación (No requiere token)
- `POST /api/auth/login` - Iniciar sesión

### Centros Gestores (Requiere token)
- `GET /api/centros-gestores/{codigo}` - Buscar por código
- `GET /api/centros-gestores/{codigo}/detalles` - Buscar con detalles
- `GET /api/centros-gestores/detalles` - Listar todos con detalles (paginado)

### Clasificadores Presupuestales (Requiere token)
- `GET /api/clasificadores/{codigo}` - Buscar por código
- `GET /api/clasificadores/{codigo}/detalles` - Buscar con detalles
- `GET /api/clasificadores/detalles` - Listar todos con detalles (paginado)

### Detalles Ponderados (Requiere token)
- `POST /api/detalle-ponderado-centro-gestor` - Crear detalle centro gestor
- `POST /api/detalle-ponderado-clasificador` - Crear detalle clasificador

### Administración (Requiere token y rol ADMINISTRADOR)
- `POST /api/admin/usuarios` - Crear usuario
- `GET /api/admin/roles` - Listar roles
- `GET /api/admin/usuarios` - Listar usuarios

## 🎯 Flujo de Trabajo Recomendado

1. **Iniciar PostgreSQL** (si no está corriendo):
   ```bash
   brew services start postgresql@15
   ```

2. **Iniciar ambos servicios**:
   ```bash
   ./start-both.sh
   ```

3. **Esperar a que ambos servicios inicien** (30-60 segundos)

4. **Abrir el frontend** en el navegador: http://localhost:3000

5. **Probar la conexión**:
   - Hacer login desde el frontend
   - Verificar en la consola del navegador que las peticiones lleguen al backend
   - Verificar en Swagger que los endpoints funcionen

6. **Desarrollar y probar** tus cambios

7. **Detener los servicios** cuando termines (Ctrl+C)

## 📊 Verificación Final

Cuando ambos servicios estén corriendo correctamente, deberías poder:

✅ Ver el frontend en http://localhost:3000
✅ Ver Swagger en http://localhost:8080/api/doc/swagger-ui.html
✅ Hacer login desde el frontend
✅ Ver las peticiones en la consola del navegador (F12 > Network)
✅ Ver que las peticiones lleguen al backend (verificar en backend.log)
✅ No tener errores de CORS en la consola del navegador

## 🔄 Reiniciar Servicios

Si necesitas reiniciar los servicios:

1. **Detener los servicios** (Ctrl+C si usaste el script)
2. **Matar procesos si quedaron colgados**:
   ```bash
   # Backend
   lsof -i :8080 | grep LISTEN | awk '{print $2}' | xargs kill -9
   
   # Frontend
   lsof -i :3000 | grep LISTEN | awk '{print $2}' | xargs kill -9
   ```
3. **Volver a iniciar** con `./start-both.sh` o manualmente

## 📚 Referencias

- **Backend README**: `AnalisisFinanciero_PI_1_Backend/README.md`
- **Frontend README**: `Frontend/AnalisisFinanciero_PI_1_Frontend/README.md`
- **Setup Local Detallado**: `LOCAL_SETUP.md`
- **Setup PostgreSQL**: `SETUP_POSTGRESQL.md`

## 🆘 Obtener Ayuda

Si después de seguir esta guía aún tienes problemas:

1. Revisa los logs del backend: `tail -f backend.log`
2. Revisa los logs del frontend: `tail -f frontend.log`
3. Revisa la consola del navegador (F12)
4. Verifica que PostgreSQL esté corriendo: `brew services list | grep postgresql`
5. Verifica que los puertos estén libres: `lsof -i :8080` y `lsof -i :3000`

---

**Última actualización**: Integración completa frontend-backend local sin Docker/Kubernetes

