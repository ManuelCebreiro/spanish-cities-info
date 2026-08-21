# spanish-cities-info

Listado completo de los municipios de España (8.132, verificado contra el INE) con funciones para consultarlos: buscar por código INE, por nombre, por provincia, listar comunidades autónomas, y encontrar municipios dentro de un radio en km de otro.

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

Busca municipios cuyo nombre contenga el texto indicado (no distingue mayúsculas/minúsculas). Devuelve `[]` si no hay coincidencias.

```javascript
getCityByName('Ferrol');
// [{ name: 'Ferrol', ineCode: '15036', province: 'A Coruña', community: 'Galicia', latitude: 43.5098, longitude: -8.2704 }]
```

### `getCitiesByProvince(province)`

Todos los municipios de una provincia. Útil para un select en cascada en un formulario. Devuelve `[]` si la provincia no existe.

```javascript
getCitiesByProvince('Melilla');
// [{ name: 'Melilla', ineCode: '52001', province: 'Melilla', community: 'Melilla', latitude: 35.291, longitude: -2.9505 }]
```

### `getCitiesInRange(referenceCityName, rangeKm)`

Municipios dentro de un radio en km de una ciudad de referencia (no incluye la propia ciudad de referencia). Devuelve `[]` si la ciudad de referencia no existe.

```javascript
getCitiesInRange('Ferrol', 10).map((c) => c.name);
// ['Ares', 'Mugardos', 'Narón']
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

## Datos

Municipios y códigos INE: [Instituto Nacional de Estadística](https://www.ine.es/daco/daco42/codmun/codmun.htm), a fecha 01-01-2026. Comunidades autónomas: lookup provincia → comunidad verificado contra el INE (19 comunidades y ciudades autónomas).

El INE publica actualizaciones de este listado periódicamente (normalmente cada enero, a veces también en julio). Cuando hay una nueva versión, se descarga el fichero oficial y se compara contra el dataset actual con `scripts/reconcile_ine.py` para detectar altas, bajas y cambios de nombre antes de actualizar el paquete.

## Contribución

Si encuentras algún error en los datos o echas en falta algo, abre un issue.
Las correcciones de datos se validan contra la fuente oficial del INE
(`scripts/reconcile_ine.py`) antes de aplicarse.

Para cambios en el código, [pull requests](https://github.com/ManuelCebreiro/locationsInfo/pulls) bienvenidos.