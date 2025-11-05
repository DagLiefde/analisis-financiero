#!/bin/bash

# Script para iniciar el backend y frontend localmente
# Uso: ./start-local.sh

echo "🚀 Iniciando servicios localmente..."

# Colores para output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Verificar que Java esté instalado
if ! command -v java &> /dev/null; then
    echo -e "${YELLOW}⚠️  Java no está instalado. Por favor instala Java 17 o superior.${NC}"
    exit 1
fi

# Verificar que Node.js esté instalado
if ! command -v node &> /dev/null; then
    echo -e "${YELLOW}⚠️  Node.js no está instalado. Por favor instala Node.js 18 o superior.${NC}"
    exit 1
fi

# Verificar variables de entorno del backend
if [ -z "$DB_URL" ] || [ -z "$DB_USERNAME" ] || [ -z "$DB_PASSWORD" ] || [ -z "$JWT_SECRET" ]; then
    echo -e "${YELLOW}⚠️  Advertencia: Las variables de entorno del backend no están configuradas.${NC}"
    echo "   Por favor configura: DB_URL, DB_USERNAME, DB_PASSWORD, JWT_SECRET"
    echo ""
    read -p "¿Deseas continuar de todos modos? (y/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

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
        echo -e "${YELLOW}⚠️  El backend no respondió en 60 segundos. Verifica los logs.${NC}"
    fi
    sleep 1
done

# Volver al directorio raíz
cd ..

# Verificar archivo .env del frontend
if [ ! -f "Frontend/AnalisisFinanciero_PI_1_Frontend/.env" ]; then
    echo -e "${YELLOW}⚠️  Archivo .env no encontrado en el frontend.${NC}"
    echo "   Creando .env desde .env.example..."
    if [ -f "Frontend/AnalisisFinanciero_PI_1_Frontend/.env.example" ]; then
        cp Frontend/AnalisisFinanciero_PI_1_Frontend/.env.example Frontend/AnalisisFinanciero_PI_1_Frontend/.env
        echo -e "${GREEN}✓ Archivo .env creado${NC}"
    else
        echo -e "${YELLOW}⚠️  .env.example no encontrado. Por favor crea .env manualmente.${NC}"
    fi
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

echo ""
echo -e "${GREEN}✅ Servicios iniciados correctamente!${NC}"
echo ""
echo "📍 URLs:"
echo "   - Frontend: http://localhost:3000"
echo "   - Backend:  http://localhost:8080/api"
echo "   - Swagger:  http://localhost:8080/doc/swagger-ui.html"
echo ""
echo "📋 Logs:"
echo "   - Backend:  tail -f backend.log"
echo "   - Frontend: tail -f frontend.log"
echo ""
echo -e "${YELLOW}Presiona Ctrl+C para detener ambos servicios${NC}"
echo ""

# Esperar a que el usuario presione Ctrl+C
wait

