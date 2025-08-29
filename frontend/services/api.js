// api.js - Servicio para obtener datos de la API v4 de SpaceX

const BASE_URL = 'https://api.spacexdata.com/v4';

export async function getLaunches() {
  const response = await fetch(`${BASE_URL}/launches`);
  if (!response.ok) throw new Error('Error al obtener lanzamientos');
  return response.json();
}

export async function getLaunchpads() {
  const response = await fetch(`${BASE_URL}/launchpads`);
  if (!response.ok) throw new Error('Error al obtener launchpads');
  return response.json();
}

export async function getLaunchesAndPads() {
  const [launches, launchpads] = await Promise.all([
    getLaunches(),
    getLaunchpads()
  ]);
  return { launches, launchpads };
}


