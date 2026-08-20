import { City } from "./types";

export function degreesToRadians(degrees: number): number {
  return degrees * (Math.PI / 180);
}

export function calculateDistance(cityOne: City, cityTwo: City): number {
  // Radio de la Tierra en kilómetros
  const R = 6371;
  const lat1 = cityOne.latitude;
  const lon1 = cityOne.longitude;
  const lat2 = cityTwo.latitude;
  const lon2 = cityTwo.longitude;

  // Convertir grados a radianes
  const lat1Rad = degreesToRadians(lat1);
  const lon1Rad = degreesToRadians(lon1);
  const lat2Rad = degreesToRadians(lat2);
  const lon2Rad = degreesToRadians(lon2);

  // Diferencias de latitud y longitud
  const differenceLat = lat2Rad - lat1Rad;
  const differenceLon = lon2Rad - lon1Rad;

  // Fórmula haversine para calcular la distancia entre dos puntos en la superficie de una esfera
  const a =
    Math.sin(differenceLat / 2) * Math.sin(differenceLat / 2) +
    Math.cos(lat1Rad) *
      Math.cos(lat2Rad) *
      Math.sin(differenceLon / 2) *
      Math.sin(differenceLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;

  return distance;
}
