import { useState } from "react";
import FormField from "../Helpers/FormField";
import { urls } from "../../helpers/urls";
import { apigateway, handleApiError } from "../../config/axios.config";
import { toast } from "react-toastify";
import CustomToaster from "../Helpers/CustomToaster";

type Props = {
  productType: "frames" | "lens";
  productDetails: any;
  onSuccess: any;
};
type fieldOption = {
  label: string;
  value: string | number;
};
type Field = {
  type: "text" | "select" | "password" | "email";
  name: string;
  options?: fieldOption[];
  required?: boolean;
  key?: string;
};

const frameFormDetails: Field[] = [
  { type: "text", name: "Name", key: "f_name" },
  { type: "text", name: "Company", key: "f_company" },
  {
    type: "select",
    name: "Size",
    key: "f_size",
    options: [
      { label: "Small", value: "small" },
      { label: "Medium", value: "medium" },
      { label: "Large", value: "large" },
    ],
  },
  {
    type: "select",
    name: "Material",
    key: "f_material",
    options: [
      { label: "Metal", value: "metal" },
      { label: "Fiber", value: "fiber" },
    ],
  },
  {
    type: "select",
    name: "Model",
    key: "f_model",
    options: [
      { label: "Full-frame", value: "full-frame" },
      { label: "Half-frame", value: "half-frame" },
      { label: "Frame-less", value: "frame-less" },
    ],
  },
  { type: "text", name: "Price(Rs.)", key: "f_price" },
  { type: "text", name: "Qty", key: "f_qty" },
  { type: "text", name: "Discount(%)", key: "f_discount" },
];

const AddProduct = ({ productType, productDetails, onSuccess }: Props) => {
  const [currentProductDetails, setCurrentProductDetails] =
    useState<any>(productDetails);

  // Store validation errors here
  const [errors, setErrors] = useState<Record<string, string>>({});

  const findKey = (fieldName: string) => {
    if (productType === "frames") {
      const [item] = frameFormDetails.filter((item) => item.name === fieldName);
      return item?.key;
    }
  };

  const onProductDetailsChange = (
    name: string,
    value: string | number | Date
  ) => {
    const fieldKey: any = findKey(name);

    // Always allow empty string so user can clear the field
    if (value === "") {
      const productUpdate = { ...currentProductDetails, [fieldKey]: value };
      setCurrentProductDetails(productUpdate);
      setErrors((prev) => ({ ...prev, [fieldKey]: "" }));
      return;
    }

    // Regex validation
    let errorMessage = "";
    if (name === "Price(Rs.)" || name === "Discount(%)") {
      const numericRegex = /^[0-9]+(\.[0-9]*)?$/; // numbers, max 2 decimals
      if (!numericRegex.test(String(value))) {
        errorMessage = "Numbers like 1.22 are allowed";
      }
    } else if (name === "Qty") {
      const numericRegex = /^$|^[0-9]+$/; // integers only
      if (!numericRegex.test(String(value))) {
        errorMessage = "Only  numbers allowed";
      }
    }

    if (name === "Name" || name === "Company") {
      const alphaNumericRegex = /^[A-Za-z0-9 ]+$/;
      if (!alphaNumericRegex.test(String(value))) {
        errorMessage = "Only alphabets and numbers allowed";
      }
    }

    if (errorMessage) {
      setErrors((prev) => ({ ...prev, [fieldKey]: errorMessage }));
      setTimeout(() => {
        setErrors((prev) => ({ ...prev, [fieldKey]: "" }));
      }, 2000);
      return;
    }

    const productUpdate = { ...currentProductDetails, [fieldKey]: value };
    setCurrentProductDetails(productUpdate);
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    setErrors({});
    let errorObj = {};
    Object.keys(currentProductDetails).map((key) => {
      if (currentProductDetails[key] === "") {
        errorObj = { ...errorObj, [key]: "This field is required" };
        return;
      }
    });
    if (Object.keys(errorObj).length > 0) {
      setErrors(errorObj);
      return;
    }
    let details = {
      url: "",
      body: "",
      productType: "",
    };
    if (productType === "frames") {
      details.body = currentProductDetails;
      details.url = urls.createFrame;
      details.productType = productType;
    }
    addProduct(details);
  };

  const addProduct = async (details: any) => {
    try {
      const { data } = await apigateway.post(details.url, details.body);
      if (data.success) {
        toast(<CustomToaster type="success" message={data.message} />);
        onSuccess();
        return;
      }
      throw new Error("Try again!");
    } catch (error) {
      const message = handleApiError(error, "Failed to add! Try again");
      toast(<CustomToaster message={message} type={"error"} />);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid grid-cols-1 md:grid-cols-2 md:gap-x-4">
        {frameFormDetails.map((field, idx) => {
          return (
            <div className="flex gap-2 flex-col mb-2" key={idx}>
              <div className="font-semibold">{field.name}</div>
              <FormField
                field={field}
                value={field.key ? currentProductDetails[field.key] : ""}
                onChange={onProductDetailsChange}
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
        ADD {productType.toUpperCase()}
      </button>
    </form>
  );
};

export default AddProduct;
