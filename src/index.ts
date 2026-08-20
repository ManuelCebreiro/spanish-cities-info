import citiesData from "./data/cities.json";
import { calculateDistance } from "./geolocalitationUtils";
import { City, RawCityData } from "./types";
import { PROVINCE_TO_COMMUNITY } from "./provinceCommunityMap";

const data = citiesData as unknown as RawCityData;

// Función interna auxiliar para transformar el array [0,1,2,3] en objeto City
// Esto centraliza el cambio y evita errores si el JSON cambia de nuevo.
function mapToCity(
  munArray: [string, string, number, number],
  province: string,
): City {
  return {
    name: munArray[0],
    ineCode: munArray[1],
    province: province,
    community: PROVINCE_TO_COMMUNITY[province],
    latitude: munArray[2],
    longitude: munArray[3],
  };
}

/**
 * 1. Mantiene tu antiguo getCityByCityCode
 */
export function getCityByCityCode(cityCode: string): City | undefined {
  for (const province in data) {
    const found = data[province].find((m) => m[1] === cityCode);
    if (found) return mapToCity(found, province);
  }
  return undefined;
}

/**
 * 2. Mantiene tu antiguo getCityByName
 */
export function getCityByName(name: string): City[] {
  const results: City[] = [];
  const search = name.toLowerCase();

  for (const province in data) {
    data[province].forEach((m) => {
      if (m[0].toLowerCase().includes(search)) {
        results.push(mapToCity(m, province));
      }
    });
  }
  return results;
}

/**
 * 3. Mantiene tu antiguo getAllCities (¡Ahora con 8000!)
 */
export function getAllCities(): City[] {
  const all: City[] = [];
  for (const province in data) {
    data[province].forEach((m) => all.push(mapToCity(m, province)));
  }
  return all.sort((a, b) => a.name.localeCompare(b.name));
}

/**
 * 4. Nuevo: getCitiesByProvince (Muy útil para formularios)
 */
export function getCitiesByProvince(province: string): City[] {
  const provinceData = data[province];
  return provinceData ? provinceData.map((m) => mapToCity(m, province)) : [];
}

/**
 * 5. Mantiene tu antiguo getCitiesInRange
 */
export function getCitiesInRange(
  referenceCityName: string,
  rangeKm: number,
): City[] {
  const all = getAllCities();
  const ref = all.find((c) => c.name === referenceCityName);

  if (!ref) return [];

  return all.filter((city) => {
    const dist = calculateDistance(ref, city);
    return dist <= rangeKm && dist > 0;
  });
}

/**
 * 6. Lista de provincias (Para el primer paso de un formulario)
 */
export function getProvinces(): string[] {
  return Object.keys(data).sort();
}
