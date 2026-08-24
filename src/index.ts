import citiesData from "./data/cities.json";
import { calculateDistance } from "./geolocalitationUtils";
import { City, RawCityData } from "./types";
import { PROVINCE_TO_COMMUNITY } from "./provinceCommunityMap";
import { mapToCity as mapToCityBase } from "./mapToCity";

const data = citiesData as unknown as RawCityData;

// Los módulos generados en provincias/ y comunidades/ usan directamente
// mapToCityBase (mismo patrón de tuplas). Aquí se envuelve para no tener
// que pasar `community` en cada llamada, ya que aquí sí tenemos el mapa
// completo a mano.
function mapToCity(
  munArray: [string, string, number, number],
  province: string,
): City {
  return mapToCityBase(munArray, province, PROVINCE_TO_COMMUNITY[province]);
}

function normalize(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

// El dataset es estático, así que estas estructuras se calculan una sola
// vez al cargar el módulo en vez de en cada llamada. `ALL_CITIES` mantiene
// el orden provincia -> tupla (no alfabético): `getCityByName` depende de
// ese orden para su resultado.
const ALL_CITIES: City[] = [];
const NORMALIZED_NAMES: string[] = [];
const CITIES_BY_PROVINCE = new Map<string, City[]>();
const CITY_BY_INE_CODE = new Map<string, City>();

for (const province in data) {
  const citiesInProvince: City[] = [];
  data[province].forEach((m) => {
    const city = mapToCity(m, province);
    ALL_CITIES.push(city);
    NORMALIZED_NAMES.push(normalize(city.name));
    citiesInProvince.push(city);
    CITY_BY_INE_CODE.set(city.ineCode, city);
  });
  CITIES_BY_PROVINCE.set(province, citiesInProvince);
}

// Copia ordenada alfabéticamente, usada por getAllCities() y
// getCitiesInRange(). El sort es estable, así que los municipios con el
// mismo nombre (ej. "Sada", en A Coruña y en Navarra) mantienen entre sí
// el orden relativo que tienen en `ALL_CITIES`.
const ALL_CITIES_SORTED: City[] = [...ALL_CITIES].sort((a, b) =>
  a.name.localeCompare(b.name),
);

// Los objetos `City` se crean una única vez y se comparten entre
// `ALL_CITIES_SORTED`, `CITY_BY_INE_CODE` y `CITIES_BY_PROVINCE`. Las
// funciones devuelven copias superficiales del *array* para que mutarlo
// (`push`/`sort`/`splice`) no corrompa la caché interna. No clonan cada
// `City`: mutar un campo de un objeto devuelto sí es visible en llamadas
// futuras, un riesgo que se acepta porque clonar los 8.132 objetos en cada
// llamada no compensa frente a ese caso de uso marginal.
export function getCityByCityCode(cityCode: string): City | undefined {
  return CITY_BY_INE_CODE.get(cityCode);
}

export function getCityByName(name: string): City[] {
  const search = normalize(name);
  const results: City[] = [];
  for (let i = 0; i < ALL_CITIES.length; i++) {
    if (NORMALIZED_NAMES[i].includes(search)) {
      results.push(ALL_CITIES[i]);
    }
  }
  return results;
}

export function getAllCities(): City[] {
  return [...ALL_CITIES_SORTED];
}

export function getCitiesByProvince(province: string): City[] {
  const cities = CITIES_BY_PROVINCE.get(province);
  return cities ? [...cities] : [];
}

const INE_CODE_PATTERN = /^\d{5}$/;

/**
 * `referenceCity` acepta el nombre de la ciudad o, para desambiguar entre
 * municipios con el mismo nombre en provincias distintas (ej. "Sada" existe
 * en A Coruña y en Navarra), su código INE de 5 dígitos.
 */
export function getCitiesInRange(
  referenceCity: string,
  rangeKm: number,
): City[] {
  const ref = INE_CODE_PATTERN.test(referenceCity)
    ? getCityByCityCode(referenceCity)
    : ALL_CITIES_SORTED.find((c) => c.name === referenceCity);

  if (!ref) return [];

  return ALL_CITIES_SORTED.filter((city) => {
    const dist = calculateDistance(ref, city);
    return dist <= rangeKm && dist > 0;
  });
}

export function getProvinces(): string[] {
  return Object.keys(data).sort();
}

export function getCommunities(): string[] {
  const communities = new Set(
    Object.keys(PROVINCE_TO_COMMUNITY).map(
      (province) => PROVINCE_TO_COMMUNITY[province],
    ),
  );
  return Array.from(communities).sort();
}

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

// Solo Illes Balears, Las Palmas y Santa Cruz de Tenerife tienen dato de
// isla; en el resto de provincias no habrá coincidencias.
export function getCitiesByIsland(island: string): City[] {
  const result: City[] = [];
  for (const province in data) {
    data[province].forEach((m) => {
      const city = mapToCity(m, province);
      if (city.island === island) result.push(city);
    });
  }
  return result;
}
