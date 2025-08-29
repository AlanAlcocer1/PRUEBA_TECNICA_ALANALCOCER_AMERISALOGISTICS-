import React, { useState } from 'react'
import jsPDF from 'jspdf'

export default function Table({ launches, onSelect, launchpads = [] }) {
  const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'asc' })
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedRows, setSelectedRows] = useState([])
  const itemsPerPage = 10

  // Ordenamiento
  const sortedLaunches = [...launches].sort((a, b) => {
    const { key, direction } = sortConfig
    let aVal, bVal

    switch (key) {
      case 'name':
        aVal = a.name?.toLowerCase() || ''
        bVal = b.name?.toLowerCase() || ''
        break
      case 'date':
        aVal = new Date(a.date_utc).getTime() || 0
        bVal = new Date(b.date_utc).getTime() || 0
        break
      case 'status':
        aVal = a.success === null ? 0 : a.success ? 2 : 1
        bVal = b.success === null ? 0 : b.success ? 2 : 1
        break
      default:
        aVal = ''
        bVal = ''
    }

    if (aVal < bVal) return direction === 'asc' ? -1 : 1
    if (aVal > bVal) return direction === 'asc' ? 1 : -1
    return 0
  })

  // Paginación
  const totalPages = Math.ceil(sortedLaunches.length / itemsPerPage)
  const paginatedLaunches = sortedLaunches.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  const requestSort = (key) => {
    let direction = 'asc'
    if (sortConfig.key === key && sortConfig.direction === 'asc') direction = 'desc'
    setSortConfig({ key, direction })
  }

  // Selección de filas
  const toggleRowSelection = (launch) => {
    const exists = selectedRows.find(r => r.id === launch.id)
    if (exists) {
      setSelectedRows(selectedRows.filter(r => r.id !== launch.id))
    } else {
      setSelectedRows([...selectedRows, launch])
    }
  }

  // Función para cargar imagen como Data URL
  const loadImageAsDataURL = (url) => {
    return new Promise((resolve, reject) => {
      const img = new Image()
      img.crossOrigin = 'Anonymous'
      img.onload = () => {
        const canvas = document.createElement('canvas')
        canvas.width = img.width
        canvas.height = img.height
        const ctx = canvas.getContext('2d')
        ctx.drawImage(img, 0, 0)
        resolve(canvas.toDataURL('image/png'))
      }
      img.onerror = reject
      img.src = url
    })
  }

  // Exportar PDF
  const exportPDF = async () => {
    const doc = new jsPDF()
    let yPosition = 20

    doc.setFontSize(18)
    doc.text('Reporte de Lanzamientos', 14, yPosition)
    yPosition += 10
    doc.setFontSize(12)
    doc.text(`Total registros exportados: ${selectedRows.length}`, 14, yPosition)
    yPosition += 10

    for (let i = 0; i < selectedRows.length; i++) {
      const launch = selectedRows[i]
      const pad = launchpads.find(p => p.id === launch.launchpad)

      doc.text(`Nombre: ${launch.name}`, 14, yPosition)
      doc.text(
        `Fecha: ${launch.date_utc ? new Date(launch.date_utc).toLocaleDateString() : 'No disponible'}`,
        14,
        yPosition + 6
      )
      doc.text(
        `Estado: ${launch.success === null ? 'No disponible' : launch.success ? 'Éxito' : 'Fallido'}`,
        14,
        yPosition + 12
      )
      doc.text(`Ubicación: ${pad ? pad.full_name : 'No disponible'}`, 14, yPosition + 18)

      // Insertar imagen si existe
      if (launch.links?.patch?.small) {
        try {
          const imgData = await loadImageAsDataURL(launch.links.patch.small)
          doc.addImage(imgData, 'PNG', 150, yPosition - 2, 40, 40)
        } catch (e) {
          console.log('Error cargando imagen:', e)
        }
      }

      yPosition += 50

      // Salto de página
      if (yPosition > 270) {
        doc.addPage()
        yPosition = 20
      }
    }

    doc.save('lanzamientos.pdf')
  }

  return (
    <div className="w-full max-w-6xl mx-auto overflow-x-auto">
      <div className="flex justify-end mb-2">
        <button
          onClick={exportPDF}
          className="px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700"
          disabled={selectedRows.length === 0}
        >
          Exportar PDF
        </button>
      </div>

      <table className="min-w-full bg-white border border-gray-200 shadow-md rounded-lg table-auto">
        <thead className="bg-gray-50">
          <tr>
            <th></th>
            <th
              className="px-6 py-3 text-left font-medium text-gray-700 cursor-pointer"
              onClick={() => requestSort('name')}
            >
              Nombre {sortConfig.key === 'name' ? (sortConfig.direction === 'asc' ? '▲' : '▼') : ''}
            </th>
            <th
              className="px-6 py-3 text-left font-medium text-gray-700 cursor-pointer"
              onClick={() => requestSort('date')}
            >
              Fecha {sortConfig.key === 'date' ? (sortConfig.direction === 'asc' ? '▲' : '▼') : ''}
            </th>
            <th
              className="px-6 py-3 text-left font-medium text-gray-700 cursor-pointer"
              onClick={() => requestSort('status')}
            >
              Estado {sortConfig.key === 'status' ? (sortConfig.direction === 'asc' ? '▲' : '▼') : ''}
            </th>
            <th className="px-6 py-3 text-left font-medium text-gray-700">Ubicación</th>
          </tr>
        </thead>
        <tbody>
          {paginatedLaunches.length === 0 ? (
            <tr>
              <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                No hay registros
              </td>
            </tr>
          ) : (
            paginatedLaunches.map((launch) => {
              const isSelected = selectedRows.some(r => r.id === launch.id)
              return (
                <tr
                  key={launch.id}
                  onClick={() => { onSelect(launch); toggleRowSelection(launch) }}
                  className={`hover:bg-gray-100 transition-colors cursor-pointer ${isSelected ? 'bg-blue-100' : ''}`}
                >
                  <td className="px-2 py-4">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => toggleRowSelection(launch)}
                      onClick={(e) => e.stopPropagation()}
                    />
                  </td>
                  <td className="px-6 py-4">{launch.name || 'No disponible'}</td>
                  <td className="px-6 py-4">
                    {launch.date_utc ? new Date(launch.date_utc).toLocaleDateString() : 'No disponible'}
                  </td>
                  <td className="px-6 py-4">
                    {launch.success === null ? 'No disponible' : launch.success ? 'Éxito' : 'Fallido'}
                  </td>
                  <td className="px-6 py-4">
                    {(() => {
                      const pad = launchpads.find(p => p.id === launch.launchpad)
                      return pad ? pad.full_name : 'No disponible'
                    })()}
                  </td>
                </tr>
              )
            })
          )}
        </tbody>
      </table>

      {/* Paginación */}
      <div className="flex flex-wrap justify-center items-center gap-3 mt-4">
        <button
          onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
          disabled={currentPage === 1}
          className={`px-4 py-2 rounded-lg text-white font-medium ${
            currentPage === 1 ? 'bg-gray-300 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          Anterior
        </button>
        <span className="px-3 py-2 font-medium text-gray-700">
          Página {currentPage} / {totalPages}
        </span>
        <button
          onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
          disabled={currentPage === totalPages}
          className={`px-4 py-2 rounded-lg text-white font-medium ${
            currentPage === totalPages ? 'bg-gray-300 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          Siguiente
        </button>
      </div>
    </div>
  )
}
