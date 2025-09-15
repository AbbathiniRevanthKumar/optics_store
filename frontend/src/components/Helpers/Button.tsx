import type { ReactNode } from "react";

type Props = {
  onClick: any;
  children: ReactNode;
};

const Button = ({children,onClick}: Props) => {
  return (
    <button
      type="button"
      className="flex items-center justify-center bg-primary hover:bg-primary-hover text-text-primary p-2 rounded-lg transition"
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default Button;
