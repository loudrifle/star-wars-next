export interface Character {
  name: string;
  films: string[];
}

export interface SwapiAllCharactersResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Character[];
}
