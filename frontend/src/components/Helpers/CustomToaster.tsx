type Props = {
  type: "success" | "error";
  message: string;
};

const CustomToaster = ({ type, message }: Props) => {
  const baseStyles =
    "md:w-[380px] max-w-full py-4 px-6 rounded-full  flex items-center gap-3 backdrop-blur";

  const successStyles =
    "bg-gradient-to-t from-success/40 to-background/100 text-success/100 border border-success/80";
  const errorStyles =
    "bg-gradient-to-r from-error/40 to-background/100 text-error/100 border border-error/80";

  const icon =
    type === "success" ? (
      <span className="text-success text-lg">✅</span>
    ) : (
      <span className="text-error text-lg">❌</span>
    );

  return (
    <div
      className={`${baseStyles} ${
        type === "success" ? successStyles : errorStyles
      }`}
    >
      {icon}
      <span className="font-medium text-[15px] w-full">{message}</span>
    </div>
  );
};

export default CustomToaster;
