# Usar Node 20 (compatible con Vite)
FROM node:20-alpine

# Directorio de trabajo
WORKDIR /app

# Copiar archivos de dependencias e instalar
COPY package*.json ./
RUN npm install

# Copiar todo el proyecto
COPY . .

# Exponer puerto de Vite
EXPOSE 5173

# Comando para iniciar la app
CMD ["npm", "run", "dev"]
