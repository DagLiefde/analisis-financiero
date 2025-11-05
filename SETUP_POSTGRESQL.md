# Guía de Configuración de PostgreSQL

El backend necesita PostgreSQL para funcionar. Sigue estos pasos para instalarlo y configurarlo en macOS.

## 🔧 Instalación de PostgreSQL

### Opción 1: Con Homebrew (Recomendado)

```bash
# 1. Instalar PostgreSQL
brew install postgresql@15

# 2. Iniciar el servicio de PostgreSQL
brew services start postgresql@15

# 3. Verificar que está corriendo
brew services list | grep postgresql
```

### Opción 2: Con Postgres.app (Interfaz Gráfica)

1. Descarga Postgres.app desde: https://postgresapp.com/
2. Instálalo y ábrelo
3. Click en "Initialize" para crear un nuevo servidor
4. El servidor se iniciará automáticamente

### Opción 3: Con Docker (Si prefieres contenedores)

```bash
docker run --name postgres-analisis -e POSTGRES_PASSWORD=root -e POSTGRES_DB=bd_analisisfinanciero -p 5432:5432 -d postgres:15
```

## 📊 Configuración de la Base de Datos

Una vez que PostgreSQL esté corriendo, crea la base de datos:

```bash
# Conectar a PostgreSQL (si usaste Homebrew)
psql postgres

# O si usaste Postgres.app, abre la terminal desde la app
```

Luego ejecuta:

```sql
-- Crear la base de datos
CREATE DATABASE bd_analisisfinanciero;

-- Verificar que se creó
\l

-- Salir de psql
\q
```

## ✅ Verificar que PostgreSQL está Corriendo

```bash
# Verificar el puerto
lsof -i :5432

# O verificar con Homebrew
brew services list | grep postgresql
```

Deberías ver algo como:
```
postgresql@15 started tomascadavid ~/Library/LaunchAgents/homebrew.mxcl.postgresql@15.plist
```

## 🚀 Iniciar PostgreSQL Manualmente

Si PostgreSQL no se inicia automáticamente:

### Con Homebrew:
```bash
brew services start postgresql@15
```

### Con Postgres.app:
- Abre la aplicación Postgres.app
- El servidor se iniciará automáticamente

### Verificar la conexión:
```bash
psql -h localhost -p 5432 -U postgres -d postgres
```

## 🐛 Solución de Problemas

### Error: "Connection refused"

1. **Verifica que PostgreSQL está corriendo:**
   ```bash
   brew services list | grep postgresql
   ```

2. **Si no está corriendo, inícialo:**
   ```bash
   brew services start postgresql@15
   ```

3. **Verifica el puerto:**
   ```bash
   lsof -i :5432
   ```

### Error: "database does not exist"

1. **Conecta a PostgreSQL:**
   ```bash
   psql postgres
   ```

2. **Crea la base de datos:**
   ```sql
   CREATE DATABASE bd_analisisfinanciero;
   ```

### Error: "password authentication failed"

Si usaste Homebrew, el usuario por defecto es tu usuario del sistema. Puedes cambiar la contraseña:

```bash
psql postgres
ALTER USER tu_usuario WITH PASSWORD 'root';
```

O si prefieres usar el usuario `postgres`:

```bash
createuser -s postgres
psql postgres
ALTER USER postgres WITH PASSWORD 'root';
```

## 📝 Notas Importantes

- **Puerto por defecto:** 5432
- **Base de datos:** `bd_analisisfinanciero`
- **Usuario:** `postgres` (o tu usuario del sistema si usaste Homebrew)
- **Contraseña:** `root` (según tu `application.properties`)

## 🔄 Después de Configurar PostgreSQL

Una vez que PostgreSQL esté corriendo y la base de datos esté creada:

1. **Inicia el backend:**
   ```bash
   cd AnalisisFinanciero_PI_1_Backend
   ./mvnw spring-boot:run
   ```

2. **El backend debería conectarse automáticamente** y crear las tablas necesarias gracias a `ddl-auto=update`

3. **Verifica en los logs** que no haya errores de conexión

