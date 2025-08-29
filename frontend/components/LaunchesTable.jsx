// components/LaunchesTable.jsx
import React, { useState, useEffect } from 'react';
import { analyticsApi } from '../services/analyticsApi';

export default function LaunchesTable() {
  const [launches, setLaunches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLaunches();
  }, []);

  const loadLaunches = async () => {
    try {
      const data = await analyticsApi.getLaunchesData();
      setLaunches(data);
    } catch (error) {
      console.error('Error loading launches:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-4">Cargando datos...</div>;
  }

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="p-4 bg-gray-50">
        <h3 className="text-lg font-semibold">Datos de Lanzamientos</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 text-left">Nombre</th>
              <th className="px-4 py-2 text-left">Fecha</th>
              <th className="px-4 py-2 text-left">Cohete</th>
              <th className="px-4 py-2 text-left">Estado</th>
            </tr>
          </thead>
          <tbody>
            {launches.map((launch, index) => (
              <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                <td className="px-4 py-2">{launch.name}</td>
                <td className="px-4 py-2">{launch.date_utc}</td>
                <td className="px-4 py-2">{launch.rocket_name}</td>
                <td className="px-4 py-2">
                  <span className={`px-2 py-1 rounded text-xs ${
                    launch.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {launch.success ? 'Éxito' : 'Fallido'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}