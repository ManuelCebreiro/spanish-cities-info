"""
Reconcilia data/cities.json contra la fuente oficial del INE
("Relacion de municipios y sus codigos por provincias", codmun.xlsx).

Uso:
    python scripts/reconcile_ine.py <ruta-al-xlsx-del-ine>

Fuente del xlsx: https://www.ine.es/daco/daco42/codmun/<YY>codmun.xlsx
(pagina: INEbase > Clasificaciones > Relacion de municipios... > Ultimos datos)
"""

import json
import sys
from pathlib import Path

import openpyxl

REPO_ROOT = Path(__file__).resolve().parent.parent
CITIES_JSON = REPO_ROOT / "src" / "data" / "cities.json"


def load_ine_official(xlsx_path: Path) -> dict[str, tuple[str, str]]:
    """Devuelve {ineCode: (nombre, provincia)} desde el xlsx oficial del INE."""
    wb = openpyxl.load_workbook(xlsx_path, data_only=True)
    official: dict[str, tuple[str, str]] = {}

    for ws in wb.worksheets:
        rows = list(ws.iter_rows(values_only=True))
        province_name = rows[1][0]
        for row in rows[3:]:
            cpro, cmun, _dc, nombre = row[0], row[1], row[2], row[3]
            if not cpro or not cmun or not nombre:
                continue
            ine_code = f"{cpro}{cmun}"
            official[ine_code] = (nombre, province_name)

    return official


def load_local_dataset(path: Path) -> dict[str, tuple[str, str]]:
    """Devuelve {ineCode: (nombre, provincia)} desde data/cities.json."""
    with open(path, encoding="utf-8") as f:
        data = json.load(f)

    local: dict[str, tuple[str, str]] = {}
    for province, municipios in data.items():
        for nombre, ine_code, _lat, _lon in municipios:
            local[ine_code] = (nombre, province)

    return local


def main() -> None:
    if len(sys.argv) != 2:
        print(__doc__)
        sys.exit(1)

    xlsx_path = Path(sys.argv[1])
    official = load_ine_official(xlsx_path)
    local = load_local_dataset(CITIES_JSON)

    official_codes = set(official)
    local_codes = set(local)

    only_local = sorted(local_codes - official_codes)
    only_official = sorted(official_codes - local_codes)
    common = official_codes & local_codes

    name_mismatches = [
        (code, local[code][0], official[code][0])
        for code in sorted(common)
        if local[code][0].strip() != official[code][0].strip()
    ]

    print(f"INE oficial:  {len(official_codes)} municipios")
    print(f"cities.json:  {len(local_codes)} municipios")
    print(f"En comun:     {len(common)}")
    print()

    print(f"--- Sobran en cities.json (no estan en INE): {len(only_local)} ---")
    for code in only_local:
        nombre, provincia = local[code]
        print(f"  {code}  {nombre}  ({provincia})")

    print()
    print(f"--- Faltan en cities.json (estan en INE, no en local): {len(only_official)} ---")
    for code in only_official:
        nombre, provincia = official[code]
        print(f"  {code}  {nombre}  ({provincia})")

    print()
    print(f"--- Nombres que no coinciden (mismo codigo INE): {len(name_mismatches)} ---")
    for code, local_name, official_name in name_mismatches:
        print(f"  {code}  local='{local_name}'  ine='{official_name}'")


if __name__ == "__main__":
    main()
