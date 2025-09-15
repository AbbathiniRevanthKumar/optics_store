import {  BellDot, Moon,Sun, UserCircle } from "lucide-react";

type Props = {
  tab: string;
};

const Navbar = (props: Props) => {
  const { tab } = props;
  const theme:string = "light";
  return (
    <div className="flex justify-between py-2 items-center sticky top-0 z-50 px-4 rounded-lg backdrop-blur-lg bg-transparent">
      <span className="text-xl font-bold">{tab}</span>
      <div className="flex">
        <div className="cursor-pointer flex gap-2">
          {theme === "dark" ? (
            <Sun size={20}  />
          ) : (
            <Moon size={20} />
          )}
          <div><UserCircle size={20} /></div>
          <div><BellDot size={20} /></div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
