import { useState } from "react";
import FormField from "../Helpers/FormField";
import { apigateway, handleApiError } from "../../config/axios.config";
import { urls } from "../../helpers/urls";
import { toast } from "react-toastify";
import CustomToaster from "../Helpers/CustomToaster";
import Spinner from "../Loaders/Spinner";
import { useAppDispatch, useAppSelector } from "../../store/customStoreHook";
import { Navigate } from "react-router-dom";
import { loginUser } from "../../store/auth.slice";

type Props = {
  type: "login" | "register";
};

type FieldOption = {
  label: string;
  value: string | number;
};

type Field = {
  type: "text" | "select" | "password" | "email";
  name: string;
  options?: FieldOption[];
  required?: boolean;
};

const loginFields: Field[] = [
  {
    name: "email",
    type: "email",
    required: true,
  },
  {
    name: "password",
    type: "password",
    required: true,
  },
];

const registerFields: Field[] = [
  {
    name: "name",
    type: "text",
    required: true,
  },
  {
    name: "email",
    type: "email",
    required: true,
  },
  {
    name: "password",
    type: "password",
    required: true,
  },
  {
    name: "role",
    type: "select",
    required: true,
    options: [
      {
        label: "user",
        value: "user",
      },
      {
        label: "admin",
        value: "admin",
      },
    ],
  },
];

const LoginRegister = ({ type }: Props) => {
  const fields = type === "login" ? loginFields : registerFields;

  const [formData, setFormData] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState<boolean>(false);

  const user = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();

  const handleChange = (name: string, value: string | number) => {
    setFormData((prev) => ({ ...prev, [name]: String(value) }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    type === "login" && handleLogin();
    type === "register" && handleRegister();
  };

  const handleLogin = async () => {
    try {
      setLoading(true);
      const { data } = await apigateway.post(urls.login, formData);
      const payload = {
        ...data.user,
      };
      dispatch(loginUser(payload));
      setLoading(false);
      toast(<CustomToaster type="success" message={data.message} />);
    } catch (error) {
      console.log(error);
      setLoading(false);
      const message = handleApiError(error);
      toast(<CustomToaster type="error" message={message} />);
    }
  };

  const handleRegister = async () => {
    try {
      setLoading(true);
      const response = await apigateway.post(urls.register, formData);
      const { data } = await apigateway.post(urls.login, formData);
      const payload = {
        ...data.user,
      };
      dispatch(loginUser(payload));
      setLoading(false);
      toast(<CustomToaster type="success" message={response.data.message} />);
    } catch (error) {
      console.log(error);
      setLoading(false);
      const message = handleApiError(error);
      toast(<CustomToaster type="error" message={message} />);
    }
  };

  if (user.isAuthenticated) {
    return <Navigate to={"/"} />;
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-t lg:bg-gradient-to-r from-primary/40 to-background/100 relative">
      {loading && <Spinner />}

      {/* Left side */}
      <div className="hidden lg:flex basis-2/3 items-center justify-center lg:h-screen">
        <h1 className="text-8xl font-bold text-primary drop-shadow-md backdrop-blur-lg">
          M O
        </h1>
      </div>

      {/* Form Section */}
      <div className="basis-full lg:basis-1/3 flex items-center justify-center p-6">
        <form
          onSubmit={handleSubmit}
          className="bg-gradient-to-b from-background/100 to-primary/40 backdrop-blur-lg shadow-xl rounded-2xl p-8 w-full max-w-sm transition transform hover:scale-[1.01] ease-in-out"
        >
          <h2 className="text-2xl font-bold mb-2 text-text-primary capitalize text-center">
            {type}
          </h2>
          <p className="text-sm text-text-secondary text-center mb-6">
            {type === "login"
              ? "Login to continue to your account"
              : "Create a new account to get started"}
          </p>

          <div className="space-y-4">
            {fields.map((field, index) => (
              <FormField
                key={index}
                field={field}
                value={formData[field.name] || ""}
                onChange={handleChange}
              />
            ))}
          </div>

          <button
            type="submit"
            className="w-full bg-primary text-white font-medium py-2 mt-6 rounded-lg shadow-md hover:bg-primary-hover transition-colors duration-200 cursor-pointer"
          >
            {type === "login" ? "Login" : "Register"}
          </button>

          <p className="text-sm text-text-secondary mt-4 text-center">
            {type === "login" ? (
              <>
                Don’t have an account?{" "}
                <a href="/register" className="text-primary hover:underline">
                  Register
                </a>
              </>
            ) : (
              <>
                Already have an account?{" "}
                <a href="/login" className="text-primary hover:underline">
                  Login
                </a>
              </>
            )}
          </p>
        </form>
      </div>
    </div>
  );
};

export default LoginRegister;
