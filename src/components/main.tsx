"use client";
import { CharacterCard } from "@/components/character-card";
import { CharacterCardSkeleton } from "@/components/character-skeleton";
import { ErrorCard } from "@/components/error-card";
import { Character } from "@/types/http";
import { useQuery } from "@tanstack/react-query";

export const Main = () => {
  const { data, isLoading, error, refetch } = useQuery<Character[], Error>({
    queryKey: ["characters"],
    queryFn: async () => {
      const res = await fetch("/api/swapi/");
      if (!res.ok) throw new Error("Error when fetching characters");
      return res.json();
    },
  });

  const groupedCharacters = data?.reduce<Record<string, Character[]>>(
    (acc, character) => {
      const letter = character.name[0].toUpperCase();
      if (!acc[letter]) acc[letter] = [];
      acc[letter].push(character);
      return acc;
    },
    {}
  );

  return (
    <div className="flex-1 overflow-y-auto px-6 mt-4 mb-4 custom-scrollbar">
      {error && <ErrorCard message={error.message} refetch={refetch} />}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mb-7 justify-items-center">
        {isLoading &&
          Array.from({ length: 21 }).map((_, i) => (
            <CharacterCardSkeleton key={i} />
          ))}

        {groupedCharacters &&
          Object.entries(groupedCharacters).map(([letter, characters]) => (
            <CharacterCard
              key={letter}
              letter={letter}
              characters={characters}
            />
          ))}
      </div>
    </div>
  );
};
