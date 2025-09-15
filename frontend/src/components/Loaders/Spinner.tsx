type Props = {};

const Spinner = (_props: Props) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-background/10 backdrop-blur-sm z-50">
      <div className="relative flex items-center justify-center">
        {/* Spinning ring */}
        <div className="w-24 h-24  border-primary-hover/90 rounded-full border-t-transparent animate-spin border-r-2 border-b-4 border-l-8"></div>

        {/* Static center text */}
        <span className="absolute text-text-primary font-bold text-2xl animate-pulse">MO</span>
      </div>
    </div>
  );
};

export default Spinner;
