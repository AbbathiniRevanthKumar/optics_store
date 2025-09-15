import { X } from "lucide-react";
import React from "react";

type Props = {
  show: boolean;
  onClose: () => void;
  header?: string;
  children: React.ReactNode;
};

const Modal = ({ show, onClose, header = "", children }: Props) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0.5  rounded-lg flex items-center justify-center backdrop-blur-2xl z-50 p-4 overflow-hidden">
      <div className="bg-white rounded-2xl shadow-xl w-fit max-w-6xl max-h-[96%] p-6 relative flex flex-col">
        {/* Header (sticky) */}
        <div
          className={`flex ${
            header ? "justify-between" : "justify-end"
          } items-center mb-4 sticky top-0 bg-white z-10 pb-2`}
        >
          {header && (
            <h2 className="text-xl font-semibold text-gray-800">{header}</h2>
          )}
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-800 p-1 rounded-full hover:bg-gray-100 transition-transform duration-200 hover:scale-110"
          >
            <X size={22} />
          </button>
        </div>

        {/* Scrollable content */}
        <div className="overflow-y-auto flex-1 px-1">{children}</div>
      </div>
    </div>
  );
};

export default Modal;
