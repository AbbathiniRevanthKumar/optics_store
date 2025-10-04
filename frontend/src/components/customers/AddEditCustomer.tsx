import { useEffect, useState } from "react";
import FormField from "../Helpers/FormField";
import { toast } from "react-toastify";
import CustomToaster from "../Helpers/CustomToaster";
import { apigateway } from "../../config/axios.config";
import { urls } from "../../helpers/urls";

type Props = {
  data: any;
  dataUpdated: any;
};

type fieldOption = {
  label: string;
  value: string | number;
};
type Field = {
  type: "text" | "select" | "password" | "email" | "date";
  name: string;
  options?: fieldOption[];
  required?: boolean;
  key?: string;
};

const customerFormDetails: Field[] = [
  { type: "text", name: "Name", key: "c_name" },
  { type: "email", name: "Email", key: "c_email" },
  { type: "text", name: "Mobile", key: "c_mobile_number" },
  { type: "text", name: "Place", key: "c_place" },
  { type: "date", name: "DOB", key: "c_dob" },
];

const AddEditCustomer = (_props: Props) => {
  const { data, dataUpdated } = _props;
  // Store validation errors here
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [details, setDetails] = useState<any>({
    c_name: "",
    c_email: "",
    c_mobile_number: "",
    c_place: "",
    c_dob:"",
  });
  useEffect(() => {
    setDetails(data);
  }, [data]);

  const onDetailsChange = (name: string, value: string | number | Date) => {
    const field: any = customerFormDetails.find((item) => item.name === name);

    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[field.key];
      return newErrors;
    });

    if (field.key === "c_mobile_number") {
      const re = /^$|^[0-9]+$/;
      if (!re.test(value as any)) {
        setErrors((prev) => ({
          ...prev,
          [field.key]: "Enter valid Mobile Number",
        }));
      }
    }

    setDetails((prev: any) => ({
      ...prev,
      [field.key]: value,
    }));
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setErrors({});
    let errorObj = {};
    const fieldsRequired = ["c_name", "c_mobile_number", "c_place"];
    Object.keys(details).map((key) => {
      if (fieldsRequired.includes(key) && details[key] === "") {
        errorObj = { ...errorObj, [key]: "This field is required" };
        return;
      }
      const emailRegx = /^$|^[a-zA-Z0-9._]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      const mobileRegex = /^[0-9]{10}$/;

      if (key === "c_email" && details[key] && !emailRegx.test(details[key])) {
        errorObj = { ...errorObj, [key]: "Provide valid Email" };
        return;
      }
      if (key === "c_mobile_number" && !mobileRegex.test(details[key])) {
        errorObj = { ...errorObj, [key]: "Provide valid Mobile Number" };
        return;
      }
    });
    if (Object.keys(errorObj).length > 0) {
      setErrors(errorObj);
      return;
    }

    try {
      const { data } = await apigateway.post(urls.createCustomer, details);
      if (data.success) {
        toast(<CustomToaster type="success" message={data.message} />);
        dataUpdated();
        return;
      }
      throw new Error();
    } catch (error: any) {
      console.log(error);
      toast(
        <CustomToaster
          type="error"
          message={error.message || "Something went wrong!"}
        />
      );
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid grid-cols-1 md:grid-cols-2 md:gap-x-6 w-lg  px-6 py-12">
        {customerFormDetails.map((field: any, idx) => {
          return (
            <div className="flex gap-2 flex-col mb-2 " key={idx}>
              <div className="font-semibold">{field.name}</div>
              <FormField
                field={field}
                value={details[field.key]}
                onChange={onDetailsChange}
              />
              {field.key && errors[field.key] && (
                <div className="text-error text-sm">{errors[field.key]}</div>
              )}
            </div>
          );
        })}
      </div>
      <button
        className="w-full bg-primary text-text-primary font-medium py-2 mt-6 rounded-lg hover:bg-primary-hover transition-colors duration-200 cursor-pointer"
        onClick={handleSubmit}
        type="submit"
      >
        {data.c_mobile_number ? "Update" : "Add"} Customer
      </button>
    </form>
  );
};

export default AddEditCustomer;
