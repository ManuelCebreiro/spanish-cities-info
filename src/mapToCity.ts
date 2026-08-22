import { City } from "./types";
import islandData from "./data/islandMap.json";

// Solo cubre los 155 municipios de Illes Balears, Las Palmas y Santa Cruz
// de Tenerife (fuente: INE, codislas.xlsx). El resto de España no tiene
// isla, así que la mayoría de lookups caen en undefined.
const ISLAND_BY_INE_CODE: Record<string, string> = islandData;

// Compartido entre index.ts y los módulos generados en provincias/ y
// comunidades/, para no duplicar esta transformación ni el patrón de datos
// compactos (tuplas) que representa.
export function mapToCity(
  munArray: [string, string, number, number],
  province: string,
  community: string,
): City {
  return {
    name: munArray[0],
    ineCode: munArray[1],
    province,
    community,
    island: ISLAND_BY_INE_CODE[munArray[1]],
    latitude: munArray[2],
    longitude: munArray[3],
  };
}
