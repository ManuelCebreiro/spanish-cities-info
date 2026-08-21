// Fuente: INE, "Relación de comunidades y ciudades autónomas con sus códigos"
// https://www.ine.es/daco/daco42/codmun/cod_ccaa_provincia.htm (consultado 2026-08-20)
// Las claves coinciden exactamente con los nombres de provincia usados en data/cities.json.
// El dato vive en el JSON para que scripts/generate-modules.js (plain Node, sin TS)
// pueda leer la misma fuente sin duplicarla.
import data from "./data/provinceCommunityMap.json";

export const PROVINCE_TO_COMMUNITY: Record<string, string> = data;
