# spanish-cities-info

Listado completo de los municipios de España (8.132, verificado contra el INE) con funciones para consultarlos: buscar por código INE, por nombre, por provincia, por isla, listar comunidades autónomas, encontrar municipios dentro de un radio en km de otro, y consultar códigos postales (import opcional, aparte del dataset principal).

## Tipo `City`

```javascript
{
  name: 'Ferrol',
  ineCode: '15036',
  province: 'A Coruña',
  community: 'Galicia',
  latitude: 43.5098,
  longitude: -8.2704
}
```

> **`island` es opcional.** Solo está presente en los 155 municipios de Illes Balears,
> Las Palmas y Santa Cruz de Tenerife (ej. `island: 'Gran Canaria'`). En el resto de
> España (incluida la España peninsular, Ceuta y Melilla) la clave `island` no existe
> en el objeto — no es `null` ni `""`.

> **`latitude`/`longitude` son el centroide geométrico del término municipal completo**,
> no el centro urbano ni un punto de referencia histórico. En municipios grandes o de
> forma irregular pueden quedar a varios km del núcleo de población — verificado hasta
> ~7,5 km en casos como Murcia, consistente en una muestra de control de 26 municipios
> contra Wikipedia/geodatos.net. No es un error si al comparar visualmente contra Google
> Maps el punto no cae exactamente sobre el pueblo.

> **`City` no incluye códigos postales.** Es un import aparte
> (`spanish-cities-info/postal-codes`) precisamente para no cargar ese dato en quien no
> lo necesita — ver la sección [Códigos postales (import opcional)](#códigos-postales-import-opcional).

## Instalación

```
npm install spanish-cities-info
```

## Uso

```javascript
import {
  getAllCities,
  getCityByCityCode,
  getCityByName,
  getCitiesByProvince,
  getCitiesInRange,
  getProvinces,
  getCommunities,
  getCitiesByCommunity,
  getCitiesByIsland,
} from 'spanish-cities-info';
```

### `getAllCities()`

Devuelve los 8.132 municipios, ordenados alfabéticamente por nombre.

```javascript
getAllCities();
// [{ name: 'A Baña', ineCode: '15007', province: 'A Coruña', community: 'Galicia', latitude: 42.9634, longitude: -8.7529 }, ...]
```

### `getCityByCityCode(ineCode)`

Busca un municipio por su código INE (5 dígitos). Devuelve `undefined` si no existe.

```javascript
getCityByCityCode('15036');
// { name: 'Ferrol', ineCode: '15036', province: 'A Coruña', community: 'Galicia', latitude: 43.5098, longitude: -8.2704 }
```

### `getCityByName(name)`

Busca municipios cuyo nombre contenga el texto indicado (no distingue mayúsculas/minúsculas ni tildes). Devuelve `[]` si no hay coincidencias.

```javascript
getCityByName('Ferrol');
// [{ name: 'Ferrol', ineCode: '15036', province: 'A Coruña', community: 'Galicia', latitude: 43.5098, longitude: -8.2704 }]

getCityByName('almeria');
// [{ name: 'Alhama de Almería', ... }, { name: 'Almería', ineCode: '04013', province: 'Almería', community: 'Andalucía', latitude: 36.8757, longitude: -2.3423 }, { name: 'Huércal de Almería', ... }]
```

### `getCitiesByProvince(province)`

Todos los municipios de una provincia. Útil para un select en cascada en un formulario. Devuelve `[]` si la provincia no existe.

```javascript
getCitiesByProvince('Melilla');
// [{ name: 'Melilla', ineCode: '52001', province: 'Melilla', community: 'Melilla', latitude: 35.291, longitude: -2.9505 }]
```

### `getCitiesInRange(referenceCity, rangeKm)`

Municipios dentro de un radio en km de una ciudad de referencia (no incluye la propia ciudad de referencia). Devuelve `[]` si la ciudad de referencia no existe.

```javascript
getCitiesInRange('Ferrol', 10).map((c) => c.name);
// ['Ares', 'Mugardos', 'Narón']
```

`referenceCity` también acepta el código INE de 5 dígitos en vez del nombre, para desambiguar
entre municipios con el mismo nombre en provincias distintas (ej. "Sada" existe tanto en
A Coruña como en Navarra):

```javascript
getCitiesInRange('15036', 10).map((c) => c.name);
// ['Ares', 'Mugardos', 'Narón'] — equivalente, usando el código INE de Ferrol
```

### `getProvinces()`

Listado de las 52 provincias, ordenado alfabéticamente.

```javascript
getProvinces();
// ['A Coruña', 'Alacant', 'Albacete', 'Almería', 'Araba', ...]
```

### `getCommunities()`

Listado de las 19 comunidades y ciudades autónomas, sin duplicados y ordenado alfabéticamente.

```javascript
getCommunities();
// ['Andalucía', 'Aragón', 'Asturias', 'Canarias', 'Cantabria', ...]
```

### `getCitiesByCommunity(community)`

Todos los municipios de una comunidad autónoma. Devuelve `[]` si la comunidad no existe.

```javascript
getCitiesByCommunity('Melilla');
// [{ name: 'Melilla', ineCode: '52001', province: 'Melilla', community: 'Melilla', latitude: 35.291, longitude: -2.9505 }]
```

### `getCitiesByIsland(island)`

Todos los municipios de una isla. Solo aplica a los 155 municipios de Illes Balears, Las
Palmas y Santa Cruz de Tenerife — el resto de España (incluida la España peninsular,
Ceuta y Melilla) no tiene este dato, así que su `City.island` es `undefined`. Devuelve
`[]` si la isla no existe o no tiene municipios.

```javascript
getCitiesByIsland('Menorca');
// [{ name: 'Alaior', ineCode: '07002', province: 'Illes Balears', community: 'Illes Balears', island: 'Menorca', latitude: 39.9339, longitude: 4.1403 }, ...]
```

Islas disponibles: `Mallorca`, `Menorca`, `Eivissa`, `Formentera`, `Gran Canaria`,
`Fuerteventura`, `Lanzarote`, `Tenerife`, `La Palma`, `La Gomera`, `El Hierro`.

## Imports modulares

Si solo necesitas los municipios de una provincia o comunidad autónoma, puedes importar
directamente esa zona sin cargar el dataset completo (8.132 municipios). Cada import
modular es autocontenido: un bundler que resuelva `spanish-cities-info/provincias/lugo`
solo incluye los municipios de Lugo, no el resto de España.

```javascript
import { cities } from 'spanish-cities-info/provincias/lugo';
// 67 municipios de Lugo

import { cities } from 'spanish-cities-info/comunidades/galicia';
// 313 municipios: A Coruña + Lugo + Ourense + Pontevedra
```

El slug es el nombre de la provincia/comunidad en minúsculas, sin tildes ni `ñ`, con
espacios sustituidos por guiones — por ejemplo `getProvinces()` devuelve `'A Coruña'`
y el import correspondiente es `spanish-cities-info/provincias/a-coruna`;
`getCommunities()` devuelve `'País Vasco'` y su import es
`spanish-cities-info/comunidades/pais-vasco`.

## Códigos postales (import opcional)

Los códigos postales **no** están en `City` ni en el import principal — viven en su
propio subpath, igual que los imports por provincia/comunidad. Así, quien no los
necesita no paga su peso: el mapa completo (8.132 municipios) pesa ~227 KB sin
comprimir / ~52 KB gzip, frente a los ~330 KB / ~125 KB gzip del import principal. Si
importas solo `spanish-cities-info`, ese coste no existe en tu bundle.

```javascript
import { getPostalCodes } from 'spanish-cities-info/postal-codes';

getPostalCodes('15036');
// ['15401', '15402', '15403', '15404', '15405', '15406', '15590', '15592', '15593', '15594', '15595']

getPostalCodes('00000'); // código INE inexistente
// []
```

También expone el mapa completo `ineCode → postalCodes[]`, por si necesitas recorrerlo
en vez de consultar municipio a municipio:

```javascript
import { postalCodesByIneCode } from 'spanish-cities-info/postal-codes';

postalCodesByIneCode['15036'];
// ['15401', '15402', ...]
```

Si quieres un `City` con sus códigos postales incluidos, combínalos tú mismo — el
paquete no los devuelve ya fusionados, precisamente para no forzar esa carga a quien no
lo pide:

```javascript
import { getCityByCityCode } from 'spanish-cities-info';
import { getPostalCodes } from 'spanish-cities-info/postal-codes';

const city = { ...getCityByCityCode('15036'), postalCodes: getPostalCodes('15036') };
```

> **La cobertura puede tener huecos en zonas rurales.** La fuente es el callejero
> censal del INE, que asocia códigos postales a tramos de vía concretos — si el INE no
> tiene ningún tramo censado bajo un código INE de municipio, ese código postal
> simplemente no aparece en la fuente. Esto afecta sobre todo a parroquias y núcleos
> rurales dispersos dentro de municipios grandes (verificado en una muestra de control:
> Ferrol y Folgoso do Courel tienen menos CP en este dataset que en agregadores de
> terceros que cruzan fuentes adicionales). No es un error del paquete ni del dataset
> origen, es una propiedad conocida de la fuente oficial. Si un municipio no tiene
> ningún CP conocido, su clave no está presente en `postalCodesByIneCode` y
> `getPostalCodes` devuelve `[]` — en la práctica, a fecha de esta versión, los 8.132
> municipios tienen al menos un CP conocido.
>
> Algunos códigos postales pertenecen administrativamente a un municipio distinto del
> que sirven (ej. `28523`, bajo Madrid en este dataset, es en realidad la oficina de
> Rivas-Vaciamadrid) — son núcleos de población partidos entre términos municipales con
> cartería asignada de forma no estrictamente administrativa, un fenómeno real y
> documentado del sistema postal español, no un error de cruce de datos.

## Datos

Municipios y códigos INE: [Instituto Nacional de Estadística](https://www.ine.es/daco/daco42/codmun/codmun.htm), a fecha 01-01-2026. Comunidades autónomas: lookup provincia → comunidad verificado contra el INE (19 comunidades y ciudades autónomas). Islas: [`codislas.xlsx`](https://www.ine.es/daco/daco42/codmun/26codislas.xlsx) del INE, a fecha 01-01-2025 (155 municipios de Illes Balears, Las Palmas y Santa Cruz de Tenerife), cruzado por código INE contra `cities.json`.

Códigos postales: [`regi-es/ds-codigos-postales-ine-es`](https://github.com/regi-es/ds-codigos-postales-ine-es) (edición callejero 2026-07, diccionario 2026), que a su vez elabora los datos a partir del Callejero del Censo Electoral y el diccionario de municipios, ambos del INE. Cruzado por código INE contra `cities.json` (8.132/8.132 municipios con coincidencia). Se descarta el código `28000` (dato inválido confirmado, no es un CP real de entrega de Correos); el resto de códigos "cross-municipio" (ej. un CP que administrativamente sirve a un municipio distinto del que aparece en el dataset) se conserva tal cual, ver nota más arriba. `regi-es/ds-codigos-postales-ine-es` no es un fork de [`inigoflores/ds-codigos-postales-ine-es`](https://github.com/inigoflores/ds-codigos-postales-ine-es) — es un dataset independiente, mantenido por otra organización, que regenera los datos de ediciones más recientes del INE mientras conserva compatibilidad de formato (mismo CSV) con el proyecto original. Datos derivados del INE, reutilizados conforme a la Ley 37/2007; fuente: sitio web del INE, www.ine.es.

El INE publica actualizaciones de este listado periódicamente (normalmente cada enero, a veces también en julio). Cuando hay una nueva versión, se descarga el fichero oficial y se compara contra el dataset actual con `scripts/reconcile_ine.py` para detectar altas, bajas y cambios de nombre antes de actualizar el paquete.

## Contribución

Si encuentras algún error en los datos o echas en falta algo, abre un issue.
Las correcciones de datos se validan contra la fuente oficial del INE
(`scripts/reconcile_ine.py`) antes de aplicarse.

Para cambios en el código, [pull requests](https://github.com/ManuelCebreiro/spanish-cities-info/pulls) bienvenidos.