#!/bin/bash

# Script para iniciar el backend y frontend simultáneamente
# Uso: ./start-both.sh

# Colores para output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 Iniciando Backend y Frontend...${NC}"
echo ""

# Función para limpiar procesos al salir
cleanup() {
    echo -e "\n${YELLOW}🛑 Deteniendo servicios...${NC}"
    if [ ! -z "$BACKEND_PID" ]; then
        kill $BACKEND_PID 2>/dev/null
        echo -e "${GREEN}✓ Backend detenido${NC}"
    fi
    if [ ! -z "$FRONTEND_PID" ]; then
        kill $FRONTEND_PID 2>/dev/null
        echo -e "${GREEN}✓ Frontend detenido${NC}"
    fi
    exit 0
}

# Configurar trap para limpiar al salir
trap cleanup SIGINT SIGTERM

# Verificar que PostgreSQL esté corriendo
echo -e "${BLUE}📊 Verificando PostgreSQL...${NC}"
if ! brew services list 2>/dev/null | grep -q "postgresql@15.*started"; then
    echo -e "${YELLOW}⚠️  PostgreSQL no está corriendo. Iniciando...${NC}"
    brew services start postgresql@15
    sleep 3
fi

if brew services list 2>/dev/null | grep -q "postgresql@15.*started"; then
    echo -e "${GREEN}✅ PostgreSQL está corriendo${NC}"
else
    echo -e "${RED}❌ No se pudo iniciar PostgreSQL. Verifica la instalación.${NC}"
    exit 1
fi

# Verificar que la base de datos existe
if ! /opt/homebrew/opt/postgresql@15/bin/psql -U $(whoami) -d postgres -c "\l" 2>/dev/null | grep -q "bd_analisisfinanciero"; then
    echo -e "${YELLOW}⚠️  Base de datos no existe. Creando...${NC}"
    /opt/homebrew/opt/postgresql@15/bin/psql -U $(whoami) -d postgres -c "CREATE DATABASE bd_analisisfinanciero;" 2>/dev/null
fi

# Iniciar Backend
echo -e "${BLUE}📦 Iniciando Backend...${NC}"
cd AnalisisFinanciero_PI_1_Backend

if [ -f "./mvnw" ]; then
    ./mvnw spring-boot:run > ../backend.log 2>&1 &
    BACKEND_PID=$!
else
    echo -e "${YELLOW}⚠️  mvnw no encontrado. Usando mvn...${NC}"
    mvn spring-boot:run > ../backend.log 2>&1 &
    BACKEND_PID=$!
fi

echo -e "${GREEN}✓ Backend iniciado (PID: $BACKEND_PID)${NC}"
echo "   Logs: backend.log"
echo "   Esperando a que el backend esté listo..."

# Esperar a que el backend esté listo (máximo 60 segundos)
for i in {1..60}; do
    if curl -s http://localhost:8080/api/actuator/health > /dev/null 2>&1; then
        echo -e "${GREEN}✓ Backend listo en http://localhost:8080/api${NC}"
        break
    fi
    if [ $i -eq 60 ]; then
        echo -e "${RED}❌ El backend no respondió en 60 segundos. Verifica los logs en backend.log${NC}"
        kill $BACKEND_PID 2>/dev/null
        exit 1
    fi
    sleep 1
done

# Volver al directorio raíz
cd ..

# Verificar archivo .env del frontend
echo -e "${BLUE}🎨 Configurando Frontend...${NC}"
if [ ! -f "Frontend/AnalisisFinanciero_PI_1_Frontend/.env" ]; then
    echo -e "${YELLOW}⚠️  Archivo .env no encontrado. Creando...${NC}"
    cat > Frontend/AnalisisFinanciero_PI_1_Frontend/.env << EOF
# Configuración del Backend API
VITE_API_URL=http://localhost:8080/api

# Timeout para las peticiones HTTP (en milisegundos)
VITE_API_TIMEOUT=10000

# Entorno de desarrollo
VITE_ENV=development
EOF
    echo -e "${GREEN}✓ Archivo .env creado${NC}"
fi

# Iniciar Frontend
echo -e "${BLUE}🎨 Iniciando Frontend...${NC}"
cd Frontend/AnalisisFinanciero_PI_1_Frontend

# Instalar dependencias si no existen
if [ ! -d "node_modules" ]; then
    echo "   Instalando dependencias..."
    npm install
fi

npm run dev > ../../frontend.log 2>&1 &
FRONTEND_PID=$!

echo -e "${GREEN}✓ Frontend iniciado (PID: $FRONTEND_PID)${NC}"
echo "   Logs: frontend.log"

# Volver al directorio raíz
cd ../..

# Esperar un poco para que el frontend inicie
sleep 3

echo ""
echo -e "${GREEN}✅ Servicios iniciados correctamente!${NC}"
echo ""
echo -e "${BLUE}📍 URLs:${NC}"
echo "   - Frontend: http://localhost:3000"
echo "   - Backend:  http://localhost:8080/api"
echo "   - Swagger:  http://localhost:8080/api/doc/swagger-ui.html"
echo "   - Health:   http://localhost:8080/api/actuator/health"
echo ""
echo -e "${BLUE}📋 Logs:${NC}"
echo "   - Backend:  tail -f backend.log"
echo "   - Frontend: tail -f frontend.log"
echo ""
echo -e "${YELLOW}💡 Presiona Ctrl+C para detener ambos servicios${NC}"
echo ""

# Esperar a que el usuario presione Ctrl+C
wait

