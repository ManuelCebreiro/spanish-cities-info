import { City } from "./types";

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
    latitude: munArray[2],
    longitude: munArray[3],
  };
}
