// Tests de regresión sobre el dataset compilado en dist/ — el que se
// publica en npm, no src/data/cities.json (fuente intermedia, sin
// community/island resueltos todavía). `npm test` corre `npm run build`
// antes (ver "pretest" en package.json), así que dist/ siempre está al día.
const { test } = require("node:test");
const assert = require("node:assert/strict");

const { getAllCities } = require("../dist/index.js");

const EXPECTED_TOTAL = 8132;
const INE_CODE_PATTERN = /^\d{5}$/;

test("el dataset tiene exactamente 8.132 municipios", () => {
  const cities = getAllCities();
  assert.equal(cities.length, EXPECTED_TOTAL);
});

test("no hay códigos INE duplicados", () => {
  const cities = getAllCities();
  const seen = new Set();
  const duplicates = [];

  for (const city of cities) {
    if (seen.has(city.ineCode)) {
      duplicates.push(city.ineCode);
    }
    seen.add(city.ineCode);
  }

  assert.deepEqual(duplicates, []);
});

test("no hay huecos en los campos obligatorios", () => {
  const cities = getAllCities();
  const incomplete = [];

  for (const city of cities) {
    const isNonEmptyString = (value) =>
      typeof value === "string" && value.trim().length > 0;
    const isFiniteNumber = (value) =>
      typeof value === "number" && Number.isFinite(value);

    const valid =
      isNonEmptyString(city.name) &&
      isNonEmptyString(city.ineCode) &&
      isNonEmptyString(city.province) &&
      isNonEmptyString(city.community) &&
      isFiniteNumber(city.latitude) &&
      isFiniteNumber(city.longitude);

    if (!valid) incomplete.push(city);
  }

  assert.deepEqual(incomplete, []);
});

test("todos los códigos INE tienen el formato de 5 dígitos", () => {
  const cities = getAllCities();
  const malformed = cities
    .map((city) => city.ineCode)
    .filter((ineCode) => !INE_CODE_PATTERN.test(ineCode));

  assert.deepEqual(malformed, []);
});
