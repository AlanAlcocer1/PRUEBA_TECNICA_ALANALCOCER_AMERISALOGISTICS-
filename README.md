# Prueba Técnica SpaceX Dashboard 2025

Esta prueba tecnica es un dashboard interactivo para visualizar y analizar datos de lanzamientos de SpaceX. Incluye funcionalidades avanzadas como visualización en mapas, análisis estadístico con IA y exportación de datos. 

## Funcionalidades principales
- Visualización de lanzamientos en tabla y mapa.
- Detalle de cada lanzamiento, incluyendo ubicación y datos relevantes.
- Gráficos estadísticos generados por IA (FastAPI + Python).
- Exportación de datos a PDF (sin imágenes, por limitación técnica).
- Interfaz moderna y responsiva con React y Tailwind CSS.

## Tecnologías utilizadas
- **React + Vite**: Para el frontend rápido y moderno.
- **Tailwind CSS**: Para estilos flexibles y personalizables.
- **FastAPI + Python**: Backend para análisis de datos y generación de gráficos con IA.
- **Docker & Docker Compose**: Para levantar el frontend y backend juntos, facilitando la instalación y despliegue en cualquier entorno.
- **Leaflet**: Para visualización de ubicaciones en mapas.

## IA y análisis
El backend incluye un módulo de IA que analiza los datos de lanzamientos, genera gráficos estadísticos y expone endpoints para el frontend. Esto permite obtener insights avanzados de los datos de SpaceX.

## ¿Por qué Docker?
Docker permite levantar todo el entorno (frontend y backend) de forma sencilla y reproducible, evitando problemas de dependencias y configuraciones locales. Solo necesitas tener Docker instalado y ejecutar:

```sh
docker-compose up --build
```

## Limitaciones
- La exportación a PDF no incluye imágenes de los lanzamientos (por limitación técnica de la librería utilizada).

## Instalación y uso
1. Clona el repositorio.
2. Ve a la carpeta `dashboard`.
3. Ejecuta `docker-compose up --build`.
4. Accede a `http://localhost:5173` para usar el dashboard.

---

Adjunto capturas y un video de la funcionalidad.
