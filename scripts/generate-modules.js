// Genera src/provincias/<slug>.ts y src/comunidades/<slug>.ts a partir de
// src/data/cities.json y src/data/provinceCommunityMap.json.
//
// Cada módulo de provincia exporta `cities: City[]` ya mapeado (no las
// tuplas crudas), auto-contenido (sin importar cities.json), para que un
// bundler que resuelva `spanish-cities-info/provincias/<slug>` solo incluya
// esa provincia y no el dataset completo. Los módulos de comunidad importan
// y concatenan los de sus provincias, así que tampoco cargan más que su zona.
//
// Se ejecuta como "prebuild" (ver package.json), antes de `tsc`.

const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const CITIES_JSON = path.join(ROOT, "src", "data", "cities.json");
const COMMUNITY_MAP_JSON = path.join(
  ROOT,
  "src",
  "data",
  "provinceCommunityMap.json",
);
const PROVINCIAS_DIR = path.join(ROOT, "src", "provincias");
const COMUNIDADES_DIR = path.join(ROOT, "src", "comunidades");

// Misma normalización que src/index.ts (normalize + case-insensitive),
// más el paso final de slug (espacios -> guiones).
function normalize(value) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

function slug(value) {
  return normalize(value).replace(/\s+/g, "-");
}

function resetDir(dir) {
  fs.rmSync(dir, { recursive: true, force: true });
  fs.mkdirSync(dir, { recursive: true });
}

function main() {
  const citiesByProvince = JSON.parse(fs.readFileSync(CITIES_JSON, "utf8"));
  const provinceToCommunity = JSON.parse(
    fs.readFileSync(COMMUNITY_MAP_JSON, "utf8"),
  );

  resetDir(PROVINCIAS_DIR);
  resetDir(COMUNIDADES_DIR);

  const provinceSlugs = {};
  const slugCollisions = new Set();

  for (const province of Object.keys(citiesByProvince)) {
    const provinceSlug = slug(province);
    if (provinceSlugs[province] === undefined) {
      if (Object.values(provinceSlugs).includes(provinceSlug)) {
        slugCollisions.add(provinceSlug);
      }
    }
    provinceSlugs[province] = provinceSlug;
  }

  if (slugCollisions.size > 0) {
    throw new Error(
      `Colision de slugs de provincia, revisa normalize(): ${[...slugCollisions].join(", ")}`,
    );
  }

  for (const province of Object.keys(citiesByProvince)) {
    const community = provinceToCommunity[province];
    if (!community) {
      throw new Error(
        `Provincia "${province}" no tiene comunidad autónoma asignada en provinceCommunityMap.json`,
      );
    }

    // Tuplas compactas, no objetos City expandidos: mismo patrón que
    // src/data/cities.json + mapToCity, para que cada módulo de provincia
    // sea pequeño y autocontenido (sin importar el JSON completo).
    const tuples = citiesByProvince[province];

    const content =
      `import { City } from "../types";\n` +
      `import { mapToCity } from "../mapToCity";\n\n` +
      `const raw: [string, string, number, number][] = ${JSON.stringify(tuples)};\n\n` +
      `export const cities: City[] = raw.map((m) => mapToCity(m, ${JSON.stringify(province)}, ${JSON.stringify(community)}));\n`;

    fs.writeFileSync(
      path.join(PROVINCIAS_DIR, `${provinceSlugs[province]}.ts`),
      content,
      "utf8",
    );
  }

  const provincesByCommunity = {};
  for (const province of Object.keys(citiesByProvince)) {
    const community = provinceToCommunity[province];
    if (!provincesByCommunity[community]) provincesByCommunity[community] = [];
    provincesByCommunity[community].push(province);
  }

  const communitySlugs = {};
  for (const community of Object.keys(provincesByCommunity)) {
    communitySlugs[community] = slug(community);
  }
  const communitySlugValues = Object.values(communitySlugs);
  const communitySlugCollisions = communitySlugValues.filter(
    (s, i) => communitySlugValues.indexOf(s) !== i,
  );
  if (communitySlugCollisions.length > 0) {
    throw new Error(
      `Colision de slugs de comunidad, revisa normalize(): ${communitySlugCollisions.join(", ")}`,
    );
  }

  for (const community of Object.keys(provincesByCommunity)) {
    const provinces = provincesByCommunity[community].sort();

    const imports = provinces
      .map(
        (province, i) =>
          `import { cities as p${i} } from "../provincias/${provinceSlugs[province]}";`,
      )
      .join("\n");
    const merged = provinces.map((_, i) => `...p${i}`).join(", ");

    const content =
      `import { City } from "../types";\n` +
      `${imports}\n\n` +
      `export const cities: City[] = [${merged}];\n`;

    fs.writeFileSync(
      path.join(COMUNIDADES_DIR, `${communitySlugs[community]}.ts`),
      content,
      "utf8",
    );
  }

  console.log(
    `Generados ${Object.keys(citiesByProvince).length} modulos en src/provincias/ ` +
      `y ${Object.keys(provincesByCommunity).length} en src/comunidades/.`,
  );
}

main();
