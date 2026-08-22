export interface RawCityData {
  [province: string]: [string, string, number, number][];
}

export interface City {
  name: string;
  ineCode: string;
  province: string;
  community: string;
  island?: string;
  latitude: number;
  longitude: number;
}
