import postalCodesData from "./data/postalCodes.json";

// Import opcional (spanish-cities-info/postal-codes), separado del entry
// principal a propósito: el mapa completo pesa ~227 KB sin comprimir y solo
// se paga si se importa este subpath explícitamente. `City` (index.ts) no
// incluye este dato — quien quiera combinarlo hace el spread él mismo.
//
// Fuente: callejero censal del INE (vía regi-es/ds-codigos-postales-ine-es).
// Un municipio puede figurar sin CP si el callejero no asocia ningún tramo
// de vía a su código INE (ver nota de cobertura en el README) — en ese caso
// el lookup cae en `undefined`. En la práctica, a fecha de esta versión, los
// 8.132 municipios tienen al menos un CP conocido.
export const postalCodesByIneCode: Record<string, string[]> = postalCodesData;

/**
 * Códigos postales de un municipio por su código INE. Devuelve `[]` si el
 * código INE no existe o no tiene CP conocido en la fuente.
 */
export function getPostalCodes(ineCode: string): string[] {
  return postalCodesByIneCode[ineCode] ?? [];
}
