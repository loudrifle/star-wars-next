export interface Character {
  name: string;
  films: string[];
}

export interface SwapiResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Character[];
}
