import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import Select from "react-select";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

type fieldOption = {
  label: string;
  value: string | number | Date;
};
type Field = {
  type: "text" | "select" | "password" | "email" | "date";
  name: string;
  options?: fieldOption[];
  required?: boolean;
};

type Props = {
  field: Field;
  value: string | number | Date;
  onChange: (name: string, value: string | number | Date) => void;
};

const FormField = (props: Props) => {
  const { field, value, onChange } = props;
  // if (field.type === "select") {
  //   return (
  //     <div className="mb-3 relative">
  //       <select
  //         name={field.name}
  //         value={value}
  //         onChange={(e) => onChange(field.name, e.target.value)}
  //         className="w-full py-2 px-4 pr-10 rounded-lg border-2 border-border bg-cards text-text-primary
  //                  focus:border-primary focus:ring-2 focus:ring-primary/40 transition-all
  //                  duration-200 ease-in-out outline-none cursor-pointer appearance-none"
  //       >
  //         {field.options?.map((opt, i) => (
  //           <option
  //             key={i}
  //             value={opt.value}
  //             className="bg-cards text-text-secondary px-4 py-2 text-sm
  //                hover:text-white
  //                border-0 outline-none"
  //           >
  //             {opt.label}
  //           </option>
  //         ))}
  //       </select>
  //       <Select options={field?.options} value={value} onChange={()=>onChange}/>
  //     </div>
  //   );
  // }
  if (field.type === "date") {
    const selectedDate = value;
    return (
      <div className="relative">
        <DatePicker
          selected={selectedDate as any}
          onChange={(date) =>
            onChange(
              field.name,
              date ? date.toISOString().split("T")[0] : ""
            )
          }
          dateFormat="dd-MM-yyyy"
          className="bg-cards px-3 py-2.5  rounded-lg border-2 border-border text-text-primary
                 focus:border-primary focus:ring-2 focus:ring-primary/40
                 transition-all duration-200 ease-in-out appearance-none outline-none text-[0.95rem]"
          placeholderText={`Select ${field.name}`}
        />
      </div>
    );
  }

  if (field.type === "select") {
    return (
      <div className="relative">
        <Select
          options={field.options}
          value={field?.options?.find((opt) => opt.value == value)}
          onChange={(selectedOption) =>
            onChange(field.name, selectedOption?.value as any)
          }
          placeholder={`Select ${field.name}`}
          className="w-full"
          styles={{
            control: (base, state) => ({
              ...base,
              backgroundColor: "var(--color-cards)",
              borderColor: state.isFocused
                ? "var(--color-primary)"
                : "var(--color-border)",
              borderWidth: 2,
              borderRadius: "0.5rem",
              minHeight: "2.75rem", // same height as input
              padding: "0 0.5rem",
              fontSize: "0.95rem",
              color: "var(--color-text-primary)",
              transition: "all 0.2s ease-in-out",
              boxShadow: state.isFocused
                ? "0 0 0 1px var(--color-primary-rgb)"
                : "none",

              "&:hover": {
                borderColor: "var(--color-primary)",
              },
            }),
            singleValue: (base) => ({
              ...base,
              color: "var(--color-text-primary)",
            }),
            placeholder: (base) => ({
              ...base,
              color: "var(--color-text-secondary)",
            }),
            menu: (base) => ({
              ...base,
              backgroundColor: "var(--color-background)",
              borderRadius: "0.25rem",
              boxShadow: "0 6px 12px rgba(0,0,0,0.15)",
              zIndex: 50,
            }),
            option: (base, state) => ({
              ...base,
              backgroundColor: state.isSelected
                ? "var(--color-primary-hover)"
                : state.isFocused
                ? "var(--color-primary)"
                : "transparent",
              color:
                state.isFocused || state.isSelected
                  ? "var(--color-active)"
                  : "var(--color-text-secondary)",
              padding: "0.5rem 1rem",
              cursor: "pointer",
              transition: "all 0.2s ease-in-out",
            }),
            dropdownIndicator: (base, state) => ({
              ...base,
              color: state.isFocused
                ? "var(--color-primary)"
                : "var(--color-text-secondary)",
              "&:hover": {
                color: "var(--color-primary-hover)",
              },
            }),
            indicatorSeparator: (base) => ({
              ...base,
              backgroundColor: "var(--color-border)",
            }),
          }}
        />
      </div>
    );
  }

  if (field.type === "password") {
    const [showPassword, setShowPassword] = useState<boolean>(false);

    return (
      <div className="relative">
        <input
          type={showPassword ? "text" : "password"}
          name={field.name}
          required={field?.required || false}
          value={value as string}
          onChange={(e) => onChange(field.name, e.target.value)}
          placeholder={`Enter ${String(field.name)}`}
          className="bg-cards px-3 py-2.5 w-full rounded-lg border-2 border-border text-text-primary
                 focus:border-primary focus:ring-2 focus:ring-primary/40
                 transition-all duration-200 ease-in-out appearance-none outline-none text-[0.95rem]"
        />
        <button
          type="button"
          onClick={() => setShowPassword((prev) => !prev)}
          className="absolute inset-y-0 right-3 flex items-center text-text-secondary hover:text-primary"
        >
          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>
    );
  }

  return (
    <div>
      <input
        type={field.type}
        name={field.name}
        required={field?.required || false}
        value={value as string | number}
        onChange={(e) => {
          onChange(field.name, e.target.value);
        }}
        placeholder={`Enter ${String(field.name)}`}
        className="bg-cards px-3 py-2.5 w-full rounded-lg border-2 border-border text-text-primary
                 focus:border-primary focus:ring-2 focus:ring-primary/40
                 transition-all duration-200 ease-in-out appearance-none outline-none text-[0.95rem]"
      />
    </div>
  );
};

export default FormField;
