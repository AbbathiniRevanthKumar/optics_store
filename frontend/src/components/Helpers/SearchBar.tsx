import { Search } from "lucide-react";

type Props = {
  value: string;
  onChange: any;
};

const SearchBar = (props: Props) => {
  const { value, onChange } = props;
  return (
    <div className="flex items-center relative w-full py-2">
      <div className="absolute px-4 text-text-primary/80">
        <Search size={20} />
      </div>
      <input
        type="text"
        className="bg-cards  px-12 w-full py-2 rounded-lg  text-text-secondary focus:border-primary focus:ring-2 focus:ring-primary/40  transition-all duration-200 ease-in-out appearance-none outline-none shadow"
        value={value}
        onChange={(e)=>onChange(e.target.value)}
        placeholder="Search"
      />
    </div>
  );
};

export default SearchBar;
