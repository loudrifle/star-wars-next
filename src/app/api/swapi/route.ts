// Workaround
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

import { Character, SwapiResponse } from "@/types/http";
import { NextResponse } from "next/server";

/**
 *Looking at the api schema i saw that the film that u told me is the number 4.
  I get it in a static way, but is also possible to get it dinamically making a query that looks for the film
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
    let allCharacters: Character[] = [];
    let url: string | null = CHARACTERS_URL;

    while (url) {
      const response = await fetch(url);
      if (!response.ok) throw new Error("Error fetching SWAPI");
      const data: SwapiResponse = await response.json();
      allCharacters = [...allCharacters, ...data.results];
      url = data.next;
    }

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
