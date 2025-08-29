import React from 'react';
import { GoogleMap, Marker, LoadScript } from '@react-google-maps/api';

export default function MapViewGoogle({ coordinates, siteName }) {
  if (!coordinates || coordinates.latitude == null || coordinates.longitude == null) {
    return (
      <div className="w-full h-64 flex items-center justify-center text-red-500">
        Coordenadas inválidas
      </div>
    );
  }

  const containerStyle = {
    width: '100%',
    height: '400px', // Ajusta según tu diseño
  };

  const center = {
    lat: coordinates.latitude,
    lng: coordinates.longitude,
  };

  return (
    <LoadScript googleMapsApiKey="TU_GOOGLE_MAPS_API_KEY">
      <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={10}>
        <Marker position={center} title={siteName || 'Ubicación de lanzamiento'} />
      </GoogleMap>
    </LoadScript>
  );
}
