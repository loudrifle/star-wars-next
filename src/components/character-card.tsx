import { Character } from "@/types/http";

interface CharacterCardProps {
  letter: string;
  characters: Character[];
}

export const CharacterCard = ({ letter, characters }: CharacterCardProps) => {
  return (
    <div className="bg-zinc-900 rounded-2xl hover:shadow-xl transition-shadow shadow-blue-800 h-40 flex flex-col w-full max-w-xs">
      {/* Header */}
      <div className="flex items-center justify-center h-12 rounded-t-2xl bg-blue-700 text-white text-lg font-semibold shrink-0">
        {letter}
      </div>

      {/* Scroll area */}
      <div className="flex-1 overflow-y-auto px-4 py-1 space-y-1.5 custom-scrollbar">
        {characters.map((character) => (
          <p
            key={character.name}
            className="text-zinc-300 text-sm hover:text-blue-400 transition-colors cursor-default"
          >
            {character.name}
          </p>
        ))}
      </div>
    </div>
  );
};
