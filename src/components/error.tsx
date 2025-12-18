import { UseQueryResult } from "@tanstack/react-query";

interface ErrorProps {
  message: string;
  refetch: UseQueryResult["refetch"];
}

export const ErrorCard = ({ message, refetch }: ErrorProps) => {
  return (
    <div className="flex justify-center items-center">
      <div className="bg-black border-2 border-red-800 text-white p-6 rounded-lg shadow-xl w-4/5 md:w-2/3 lg:w-1/2 flex flex-col items-center justify-center">
        <p className="text-xl font-semibold text-center text-red-800">
          Something went wrong: {message}
        </p>
        <button
          onClick={() => void refetch()}
          className="mt-4 bg-blue-800 text-white py-2 px-6 rounded-full transition-all transform hover:bg-blue-600 hover:scale-105 focus:outline-none"
        >
          Retry
        </button>
      </div>
    </div>
  );
};
