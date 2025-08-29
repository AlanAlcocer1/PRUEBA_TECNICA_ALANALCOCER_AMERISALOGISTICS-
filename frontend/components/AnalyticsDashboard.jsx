// components/AnalyticsDashboard.jsx
import React, { useState, useEffect } from 'react';
import { analyticsApi } from '../services/analisisIA';

export default function AnalyticsDashboard() {
  const [launchesPerYear, setLaunchesPerYear] = useState(null);
  const [successByRocket, setSuccessByRocket] = useState(null);
  const [avgTime, setAvgTime] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      const [yearData, rocketData, timeData] = await Promise.all([
        analyticsApi.getLaunchesPerYear(),
        analyticsApi.getSuccessByRocket(),
        analyticsApi.getAvgTimeBetweenLaunches()
      ]);

      setLaunchesPerYear(yearData);
      setSuccessByRocket(rocketData);
      setAvgTime(timeData);
    } catch (error) {
      console.error('Error loading analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 rounded-lg">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Análisis SpaceX</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Gráfico de lanzamientos por año */}
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold mb-4">Lanzamientos por Año</h3>
          {launchesPerYear && (
            <img 
              src={`data:image/png;base64,${launchesPerYear.image}`} 
              alt="Lanzamientos por año"
              className="w-full h-64 object-contain"
            />
          )}
        </div>

        {/* Gráfico de éxito por cohete */}
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold mb-4">Éxito por Cohete</h3>
          {successByRocket && (
            <img 
              src={`data:image/png;base64,${successByRocket.image}`} 
              alt="Éxito por cohete"
              className="w-full h-64 object-contain"
            />
          )}
        </div>
      </div>

      {/* Estadística de tiempo promedio */}
      {avgTime && (
        <div className="bg-white p-4 rounded-lg shadow-sm mt-6">
          <h3 className="text-lg font-semibold mb-2">Estadísticas</h3>
          <p className="text-gray-700">
            Tiempo promedio entre lanzamientos: <span className="font-bold">{avgTime.avg_days_between_launches.toFixed(1)} días</span>
          </p>
        </div>
      )}

      <button
        onClick={loadAnalytics}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
      >
        Actualizar Datos
      </button>
    </div>
  );
}