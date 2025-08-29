import { useEffect, useState, useRef } from 'react'
import { getLaunchesAndPads } from '../services/api'
import { analyticsApi } from '../services/analisisIA' // Asegúrate de crear este servicio
import Table from '../components/Table'
import DetailCard from '../components/DetailCard'
import AnalyticsDashboard from '../components/AnalyticsDashboard' // Componente nuevo
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'

// Configurar íconos de Leaflet
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})

// Componente para forzar redimensionamiento del mapa en modal
function MapResizer() {
  const map = useMap()
  useEffect(() => {
    setTimeout(() => {
      map.invalidateSize()
    }, 100)
  }, [map])
  return null
}

// Componente MapViewLeaflet
function MapViewLeaflet({ coordinates, siteName, isVisible }) {
  if (!coordinates || coordinates.latitude == null || coordinates.longitude == null) {
    return (
      <div className="w-full h-64 flex items-center justify-center text-red-500">
        Coordenadas inválidas
      </div>
    )
  }

  return (
    <div className="w-full h-64 rounded-xl overflow-hidden border border-gray-200">
      {isVisible && (
        <MapContainer
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
          <MapResizer />
        </MapContainer>
      )}
    </div>
  )
}

function App() {
  const [launches, setLaunches] = useState([])
  const [launchpads, setLaunchpads] = useState([])
  const [selected, setSelected] = useState(null)
  const [filter, setFilter] = useState('')
  const [showMap, setShowMap] = useState(false)
  const [showAnalytics, setShowAnalytics] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const padRef = useRef(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)
        const { launches, launchpads } = await getLaunchesAndPads()
        setLaunches(launches)
        setLaunchpads(launchpads)
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  const filtered = launches.filter((l) => {
    const nameMatch = l.name?.toLowerCase().includes(filter.toLowerCase())
    const dateMatch = l.date_utc
      ? new Date(l.date_utc).toLocaleDateString().includes(filter)
      : false
    return nameMatch || dateMatch
  })

  const handleSelect = (launch) => {
    setSelected(launch)
  }

  const getPadCoordinates = () => {
    if (!selected || !launchpads) return null
    const pad = launchpads.find(p => p.id === selected.launchpad)
    padRef.current = pad
    if (!pad || pad.latitude == null || pad.longitude == null) return null
    return {
      latitude: typeof pad.latitude === 'string' ? parseFloat(pad.latitude) : pad.latitude,
      longitude: typeof pad.longitude === 'string' ? parseFloat(pad.longitude) : pad.longitude,
      name: pad.full_name
    }
  }

  const coordinates = getPadCoordinates()

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white text-gray-900 p-6 flex flex-col items-center relative">
      <h1 className="text-4xl font-bold mb-6 text-gray-800">Mini Dashboard - SpaceX</h1>

      {/* Botones de toggle entre vistas */}
      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setShowAnalytics(false)}
          className={`px-6 py-2 rounded-lg font-medium transition-colors ${
            !showAnalytics
              ? 'bg-blue-500 text-white hover:bg-blue-600'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Lanzamientos
        </button>
        <button
          onClick={() => setShowAnalytics(true)}
          className={`px-6 py-2 rounded-lg font-medium transition-colors ${
            showAnalytics
              ? 'bg-green-500 text-white hover:bg-green-600'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Análisis
        </button>
      </div>

      {showAnalytics ? (
        <AnalyticsDashboard />
      ) : (
        <>
          {/* Filtro y tabla de lanzamientos */}
          <input
            type="text"
            placeholder="Filtrar por nombre o fecha"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="mb-4 p-2 rounded border border-gray-300 w-full max-w-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          />

          <Table launches={filtered} onSelect={handleSelect} launchpads={launchpads} />

          {selected && (
            <div className="w-full max-w-md mt-8">
              <DetailCard
                launch={selected}
                launchpads={launchpads}
                onShowMap={() => setShowMap(true)}
              />
            </div>
          )}

          {/* Modal Leaflet */}
          <div
            className={`fixed inset-0 flex items-center justify-center z-50 transition-opacity duration-200 ${
              showMap ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
            }`}
          >
            <div className="bg-black bg-opacity-50 fixed inset-0"></div>
            <div className="bg-white rounded-lg p-6 shadow-lg relative w-full max-w-xl mx-4 z-10">
              <button
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 bg-white rounded-full p-1 shadow-md"
                onClick={() => setShowMap(false)}
              >
                ✖
              </button>
              {coordinates ? (
                <>
                  <h3 className="text-lg font-semibold mb-4">{coordinates.name}</h3>
                  <MapViewLeaflet
                    coordinates={coordinates}
                    siteName={coordinates.name}
                    isVisible={showMap}
                  />
                </>
              ) : (
                <div className="text-center text-gray-700 py-8">Ubicación no disponible</div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default App