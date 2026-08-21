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

function normalize(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

/**
 * 2. Mantiene tu antiguo getCityByName
 */
export function getCityByName(name: string): City[] {
  const results: City[] = [];
  const search = normalize(name);

  for (const province in data) {
    data[province].forEach((m) => {
      if (normalize(m[0]).includes(search)) {
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

const INE_CODE_PATTERN = /^\d{5}$/;

/**
 * 5. Mantiene tu antiguo getCitiesInRange
 *
 * `referenceCity` acepta el nombre de la ciudad o, para desambiguar entre
 * municipios con el mismo nombre en provincias distintas (ej. "Sada" existe
 * en A Coruña y en Navarra), su código INE de 5 dígitos.
 */
export function getCitiesInRange(
  referenceCity: string,
  rangeKm: number,
): City[] {
  const all = getAllCities();
  const ref = INE_CODE_PATTERN.test(referenceCity)
    ? getCityByCityCode(referenceCity)
    : all.find((c) => c.name === referenceCity);

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

/**
 * 7. Lista de comunidades y ciudades autónomas, sin duplicados
 */
export function getCommunities(): string[] {
  const communities = new Set(
    Object.keys(PROVINCE_TO_COMMUNITY).map(
      (province) => PROVINCE_TO_COMMUNITY[province],
    ),
  );
  return Array.from(communities).sort();
}

/**
 * 8. Todas las ciudades de una comunidad autónoma
 */
export function getCitiesByCommunity(community: string): City[] {
  const provinces = Object.keys(PROVINCE_TO_COMMUNITY).filter(
    (province) => PROVINCE_TO_COMMUNITY[province] === community,
  );
  const result: City[] = [];
  provinces.forEach((province) => {
    data[province].forEach((m) => result.push(mapToCity(m, province)));
  });
  return result;
}
