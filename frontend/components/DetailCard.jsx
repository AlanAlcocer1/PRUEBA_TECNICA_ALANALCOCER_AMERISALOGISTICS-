import React from 'react'

export default function DetailCard({ launch, launchpads = [], onShowMap }) {
  if (!launch) return null

  const pad = launchpads.find(p => p.id === launch.launchpad)

  return (
    <div className="bg-white shadow-lg rounded-xl p-6 border border-gray-200 w-full">
      <h2 className="text-2xl font-bold mb-2">{launch.name || 'Nombre no disponible'}</h2>
      <p className="text-gray-600 mb-1">
        <span className="font-semibold">Fecha:</span>{' '}
        {launch.date_utc ? new Date(launch.date_utc).toLocaleDateString() : 'No disponible'}
      </p>
      <p className="text-gray-600 mb-1">
        <span className="font-semibold">Estado:</span>{' '}
        {launch.success === null ? 'No disponible' : launch.success ? 'Éxito' : 'Fallido'}
      </p>
      <p className="text-gray-600 mb-4">
        <span className="font-semibold">Ubicación:</span> {pad ? pad.full_name : 'No disponible'}
      </p>

      {launch.links?.patch?.small && (
        <img
          src={launch.links.patch.small}
          alt={launch.name}
          className="w-32 h-32 object-contain mb-4"
        />
      )}

      <button
        onClick={onShowMap}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
      >
        Ver Mapa
      </button>
    </div>
  )
}
