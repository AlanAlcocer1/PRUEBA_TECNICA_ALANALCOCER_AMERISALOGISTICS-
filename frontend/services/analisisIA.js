// services/analyticsApi.js
const API_BASE_URL = 'http://backend:8000'; // URL del servicio backend en Docker Compose

export const analyticsApi = {
  // Obtener gráfico de lanzamientos por año
  getLaunchesPerYear: async () => {
    const response = await fetch(`${API_BASE_URL}/charts/launches-per-year`);
    return await response.json();
  },

  // Obtener gráfico de éxito por cohete
  getSuccessByRocket: async () => {
    const response = await fetch(`${API_BASE_URL}/charts/success-by-rocket`);
    return await response.json();
  },

  // Obtener tiempo promedio entre lanzamientos
  getAvgTimeBetweenLaunches: async () => {
    const response = await fetch(`${API_BASE_URL}/stats/avg-time-between-launches`);
    return await response.json();
  },

  // Obtener datos de lanzamientos
  getLaunchesData: async () => {
    const response = await fetch(`${API_BASE_URL}/launches`);
    return await response.json();
  }
};