export const CharacterCardSkeleton = () => {
  return (
    <div className="bg-zinc-900 rounded-2xl animate-pulse h-40 flex flex-col w-full max-w-xs">
      <div className="flex items-center justify-center h-12 rounded-t-2xl bg-blue-700 text-white text-lg font-semibold shrink-0" />

      <div className="flex-1 px-4 py-3 space-y-2 overflow-hidden">
        <div className="h-3 bg-zinc-700 rounded w-3/4" />
        <div className="h-3 bg-zinc-700 rounded w-2/3" />
        <div className="h-3 bg-zinc-700 rounded w-1/2" />
        <div className="h-3 bg-zinc-700 rounded w-4/5" />
      </div>
    </div>
  );
};
