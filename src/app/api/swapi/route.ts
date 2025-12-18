// Workaround (other option could be mirroring)
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

import { Character, SwapiAllCharactersResponse } from "@/types/http";
import { NextResponse } from "next/server";

/**
 *Looking at the api schema i saw that the film u mentioned is number 4.
  I get it statically, but it is also possible to get it dinamically by making a query that searches for the film name
 */
const FILM_URL = "https://swapi.dev/api/films/4/";

/**
 *The url to get all people (characters)
 */
const CHARACTERS_URL = "https://swapi.dev/api/people/";

export async function GET(): Promise<
  NextResponse<Character[] | { error: string }>
> {
  try {
    /**
     * The response is paginated so using the while method is dynamic and independent of the number of pages
     */
    let allCharacters: Character[] = [];
    let url: string | null = CHARACTERS_URL;

    while (url) {
      const response = await fetch(url);
      if (!response.ok) throw new Error("Error fetching SWAPI");
      const data: SwapiAllCharactersResponse = await response.json();
      allCharacters = [...allCharacters, ...data.results];
      url = data.next;
    }

    /**
     * When all characters have been fetched, filter for those who were in film number 4.
     * Decided to filter server side because it is more efficient, faster and there are less logic in the frontend.
     * (I've also seen that "localCompare" is the best way to sort an Array of strings)
     */
    const filteredCharacters = allCharacters
      .filter((person) => person.films.includes(FILM_URL))
      .sort((a, b) => a.name.localeCompare(b.name));

    return NextResponse.json(filteredCharacters);
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Error getting characters" },
      { status: 500 }
    );
  }
}
