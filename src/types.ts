export interface RawCityData {
  [province: string]: [string, string, number, number][];
}

export interface City {
  name: string;
  ineCode: string;
  province: string;
  community: string;
  latitude: number;
  longitude: number;
}
