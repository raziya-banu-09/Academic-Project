import { IoSearch, IoClose } from "react-icons/io5";

const SearchBar = ({ value, setValue, onEnterSearch, onClear }) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    if (value.trim() !== "") onEnterSearch();
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="relative flex items-center w-[220px] sm:w-[300px] md:w-[380px] lg:w-[460px]"
    >
      {/* search icon left */}
      <IoSearch className="absolute left-3.5 text-gray-400 w-4 h-4 pointer-events-none" />

      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Search ideas, boards, creators…"
        className="w-full pl-9 pr-10 py-2.5 rounded-2xl bg-gray-100 border border-transparent text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-300 focus:bg-white transition-all duration-200"
      />

      {/* clear button */}
      {value && (
        <button
          type="button"
          onClick={onClear}
          className="absolute right-3 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <IoClose className="w-4 h-4" />
        </button>
      )}
    </form>
  );
};

export default SearchBar;