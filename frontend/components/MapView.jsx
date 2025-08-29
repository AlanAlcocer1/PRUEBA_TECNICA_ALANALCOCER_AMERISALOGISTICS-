import { useEffect, useRef } from 'react'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

// Forzar íconos de marcador
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})

export default function MapViewLeaflet({ coordinates, siteName, isVisible }) {
  const mapRef = useRef()

  // Cuando el modal se vuelve visible, invalidamos tamaño
  useEffect(() => {
    if (isVisible && mapRef.current) {
      setTimeout(() => {
        mapRef.current.invalidateSize()
        mapRef.current.setView([coordinates.latitude, coordinates.longitude], 10)
      }, 100) // Pequeño delay
    }
  }, [isVisible, coordinates])

  if (!coordinates || coordinates.latitude == null || coordinates.longitude == null) {
    return (
      <div className="w-full h-64 flex items-center justify-center text-red-500">
        Coordenadas inválidas
      </div>
    )
  }

  return (
    <div className="w-full h-64 rounded-xl overflow-hidden border border-gray-200">
      <MapContainer
        ref={mapRef}
        center={[coordinates.latitude, coordinates.longitude]}
        zoom={10}
        scrollWheelZoom={true}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <Marker position={[coordinates.latitude, coordinates.longitude]}>
          <Popup>{siteName || 'Ubicación de lanzamiento'}</Popup>
        </Marker>
      </MapContainer>
    </div>
  )
}
