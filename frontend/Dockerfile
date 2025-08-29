FROM node:20-slim

WORKDIR /app

COPY package*.json ./

# SOLUCIÓN NUCLEAR: Instalar MANUALMENTE todas las variantes de rollup
RUN npm install @rollup/rollup-linux-x64-gnu --save-optional --force && \
    npm install @rollup/rollup-linux-x64-musl --save-optional --force && \
    npm install @rollup/rollup-win32-x64-msvc --save-optional --force && \
    npm install @rollup/rollup-darwin-x64 --save-optional --force && \
    npm install @rollup/rollup-darwin-arm64 --save-optional --force

# Ahora instalar el resto de dependencias
RUN npm install --force --legacy-peer-deps

COPY . .

EXPOSE 5173

CMD ["npm", "run", "dev", "--host", "0.0.0.0"]