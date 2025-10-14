type SearchProps = {
  query: string;
  onQuery: (query: string) => void;
};

export const Search = ({ query, onQuery }: SearchProps) => {
  return (
    <div className="flex items-center border-b border-t border-gray-500 px-3 py-2 mt-2 bg-white">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        className="w-5 h-5 text-gray-500"
      >
        <path d="M21 21l-4.35-4.35m1.6-4.65a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
      <input
        type="text"
        placeholder="Search..."
        className="ml-2 w-full outline-none text-sm text-gray-700 placeholder-gray-400"
        value={query}
        onChange={(e) => onQuery(e.target.value)}
      />
    </div>
  );
};
