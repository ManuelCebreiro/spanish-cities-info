# Changelog

## [2.3.0] - 2026-08-22

### Añadido

- Campo `island` (opcional) en `City`: presente solo en los 155 municipios de Illes Balears, Las Palmas y Santa Cruz de Tenerife (las 11 islas habitadas: Mallorca, Menorca, Eivissa, Formentera, Gran Canaria, Fuerteventura, Lanzarote, Tenerife, La Palma, La Gomera, El Hierro). En el resto de España la clave no está presente en el objeto (no `null`, no `""`). Fuente: [`codislas.xlsx`](https://www.ine.es/daco/daco42/codmun/26codislas.xlsx) del INE (01-01-2025), cruzado por código INE contra `cities.json` — 155/155 coincidencias. Nombres normalizados al orden natural (`La Gomera`, `El Hierro`) y "Ibiza" → `Eivissa`, por consistencia con el criterio de nombre cooficial ya usado en el resto del dataset.
- `getCitiesByIsland(island)`: todos los municipios de una isla, por simetría con `getCitiesByCommunity`. Devuelve `[]` si la isla no existe o no tiene municipios.

## [2.2.0] - 2026-08-21

### Breaking

- Se añade el campo `exports` en `package.json`, que restringe los subpaths accesibles del paquete a los documentados: `.`, `./provincias/*` y `./comunidades/*`. Antes, sin `exports`, cualquier ruta interna era importable directamente (ej. `require('spanish-cities-info/dist/data/cities.json')`). A partir de esta versión, importar cualquier ruta no listada falla con `ERR_PACKAGE_PATH_NOT_EXPORTED` (verificado). Si dependías de un archivo interno en vez de la API pública, usa las funciones exportadas o los imports modulares documentados.

### Añadido

- Imports modulares por provincia y comunidad autónoma: `spanish-cities-info/provincias/<slug>` y `spanish-cities-info/comunidades/<slug>` (ej. `spanish-cities-info/provincias/lugo`, `spanish-cities-info/comunidades/galicia`). Cada uno exporta `cities: City[]` autocontenido, sin depender del dataset completo, para que un bundler que resuelva ese subpath solo incluya esa zona. Los 52 módulos de provincia y 19 de comunidad se generan en build (`scripts/generate-modules.js`, corre como `prebuild`) a partir de `src/data/cities.json` y `src/data/provinceCommunityMap.json` — no se mantienen a mano.
- No rompe nada existente: la entrada principal (`import { getAllCities, ... } from 'spanish-cities-info'`) sigue funcionando exactamente igual.

## [2.1.0] - 2026-08-21

### Añadido

- `getCommunities()`: listado de las 19 comunidades y ciudades autónomas, sin duplicados. El README de la 2.0.0 ya prometía "listar comunidades autónomas" pero la función no existía — corregido.
- `getCitiesByCommunity(community)`: todos los municipios de una comunidad autónoma, por simetría con `getCitiesByProvince`. Devuelve `[]` si la comunidad no existe.

## [2.0.0] - 2026-08-20

### Breaking

- `latitude` y `longitude` pasan de `string` a `number` en el objeto `City`.
- Renombrados en `City`: `city` → `name`, `cityCode` → `ineCode` (código INE de 5 dígitos, provincia + municipio).
- Eliminados de `City`: `countryCode`, `provinceCode`, `communityCode`. No tienen equivalente directo — el paquete cubre solo España y los códigos de provincia/comunidad no se exponían de forma útil por sí solos.
- Eliminado el campo `language` (idiomas cooficiales por ciudad). No tenía un caso de uso confirmado; se podrá reintroducir en el futuro si hace falta.
- Eliminada la función `getAllCitiesFromCommunity`. Cada `City` incluye ahora `community` directamente, así que el equivalente es filtrar tú mismo: `getAllCities().filter(c => c.community === 'Andalucía')`. También puedes filtrar por provincia con la nueva `getCitiesByProvince`.
- `getCitiesInRange` ya no incluye la ciudad de referencia en su propio resultado (antes se incluía a sí misma, con distancia 0).
- `getCityByName` y `getCitiesInRange` devuelven `[]` en vez de `undefined`/`null` cuando no hay resultados.
- El paquete pasa de exportación `export =` (CommonJS) a exports nombrados. Si usabas `import cities = require('spanish-cities-info')`, ahora usa `import { getAllCities, getCitiesInRange, ... } from 'spanish-cities-info'`.
- El formato interno de `data/cities.json` cambia de un array plano de objetos a un objeto agrupado por provincia con arrays de tuplas `[nombre, códigoINE, lat, lon]`. No afecta a quien use las funciones del paquete, pero sí a quien importara ese JSON directamente en vez de pasar por la API.

### Añadido

- `getCitiesByProvince(province)`: todas las ciudades de una provincia.
- `getProvinces()`: listado de las 52 provincias.
- El campo `community` (comunidad autónoma) está de nuevo presente en cada `City`. (Durante el desarrollo de esta versión se había perdido al migrar el dataset; en esta versión final está recuperado y verificado — 19 comunidades y ciudades autónomas, derivadas de un lookup provincia→comunidad contrastado con el INE.)

### Corregido

- El dataset se reconcilió contra la fuente oficial del INE (municipios a 01-01-2026): se corrigieron 3 nombres con errores, se añadió el municipio que faltaba (Usansolo, Bizkaia, independizado en 2023) y se eliminaron 6 municipios que estaban duplicados dos veces con distinto nombre bajo el mismo código INE. El dataset queda en exactamente 8.132 municipios, el recuento oficial.
- **El paquete publicado desde 2024 no era funcional tras instalarlo.** Desde el commit "minimize size package" (jun 2024), `.npmignore` excluía `data/cities.json` del tarball de npm — cualquier instalación fallaba con `Cannot find module` al llamar a cualquier función de la librería. Corregido: los datos ahora se publican dentro de `dist/`.
- Tamaño del paquete: pasa de ~1,06 MB sin comprimir (v1.0.6) a ~379 KB — por debajo del principal competidor directo (`all-spanish-cities`, ~800 KB).

## [1.0.6] - 2024-06-14
- Fallo en la compilación.

## [1.0.5] - 2024-06-14
- Cambiar lo que devuelve `getAllCities`. Para que devuelva un array de ciudades. 

## [1.0.4] - 2024-06-12
- Cambio de nombre en la funcion `getCityByZipCode` por  `getCityByCityCode`, para guardar coherencia entre los nombres. Devolución en caso de errores en la funcion `getAllCitiesFromCommunity` y `getCitiesInRange`. Dejar disponible la data/cities.json en github. Estaba en el gitignore.

## [1.0.3] - 2024-06-09
- Devolver en `getAllCities` ciudades ordenadas alfabéticamente por ciudad. REVISION de ERROES

## [1.0.2] - 2024-06-09
- Devolver en `getAllCities` ciudades ordenadas alfabéticamente por ciudad.

## [1.0.1] - 2024-06-08
- Cambiar Readme. Añadir mejor descripción y cambiar erratas.

## [1.0.0] - 2024-06-08
- Renombrar paquete de 'locationsInfo' a 'spanish-cities-info' para reflejar mejor el contenido
- Cambios en alguna funcion mal nombrada.

## Changelog anterior para `locationsinfo`

## [1.1.6] - 2024-06-06
- Minimizar tamaño del paquete.

## [1.1.5] - 2024-06-06
- Minimizar tamaño del paquete.

## [1.1.4] - YYYY-MM-DD
- Arreglos en la función `getCitiesInRange`, ya no es necesario pasar a la funcion la lista de Ciudades en la que basarse para el rango de distancia. Ya la incluyo en la función, para que sea más cómodo usarla y sobre todo eficiente.

## [1.1.3] - YYYY-MM-DD
- Arreglos con problemas de data

## [1.1.2] - YYYY-MM-DD
- Arreglos de configuracion

## [1.1.1] - YYYY-MM-DD
- Se ha agregado la función `getCitiesInRange` para encontrar ciudades dentro de un rango.
- Mejora en la función, `getCitiByName`. 
  Ahora devuelve un array de ciudades en lugar de un solo objeto de ciudad. Esto se ha implementado para admitir búsquedas más flexibles que incluyan cualquier parte del nombre de la ciudad. 
    Por ejemplo, si buscas "Ferr", la función devolverá ciudades como "Ferrol", "Ferreries" y "San Fernando de Henares". Esta mejora proporciona una funcionalidad más versátil y útil para los usuarios al realizar búsquedas por nombre de ciudad.
    Cambios en el objeto City:
- Añadido soporte para el campo language. Cataluña (ca), Galicia (ga), País Vasco (eu). Además incluye también (cast) como el resto de ciudades.
- Se han corregido errores menores en otras funciones.
- Se ha actualizado la documentación.

## [1.1.0] - YYYY-MM-DD
- Se han agregado nuevas funciones para manipular los datos de las ciudades.
- Se ha mejorado la eficiencia de algunas funciones.
- Se ha actualizado la documentación.

## [1.0.0] - YYYY-MM-DD
- Versión inicial del paquete.
- Se han incluido funciones básicas para acceder a los datos de las ciudades.
