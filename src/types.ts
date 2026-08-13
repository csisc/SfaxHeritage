export interface Place {
  id: string;
  name: string;
  lat: number;
  lon: number;
  image?: string;
  wikipediaUrl?: string;
  wikidataDescription?: string;
}

export interface WikipediaDetails {
  extract: string;
  thumbnail?: string;
}
