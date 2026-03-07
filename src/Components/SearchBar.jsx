import { IoSearch, IoClose } from "react-icons/io5";

const SearchBar = ({ value, setValue, onEnterSearch, onClear }) => {

  const handleSubmit = (e) => {
    e.preventDefault();
    if (value.trim() !== "") {
      onEnterSearch();
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="max-w-full relative lg:ml-10">
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Search ideas..."
          className="pr-45 pl-3 py-1.5 w-full rounded-2xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
        />

        {value && (
          <button
            type="button"
            onClick={onClear}
            className="absolute inset-y-0 right-10 flex items-center pr-2 text-gray-400 hover:text-gray-600"
          >
            <IoClose className="w-5 h-5" />
          </button>
        )}

        <button
          type="submit"
          className="absolute inset-y-0 right-2 flex items-center pr-2 text-gray-400"
        >
          <IoSearch className="w-5 h-5" />
        </button>
      </form>
    </div>
  );
};

export default SearchBar;
