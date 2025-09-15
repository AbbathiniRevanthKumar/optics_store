import { useEffect } from "react";
import AppRoutes from "./routes/AppRoutes";
import "./App.css";
import { Slide, ToastContainer } from "react-toastify";
import { loginUser, logoutUser } from "./store/auth.slice";
import { apigateway } from "./config/axios.config";
import { useAppDispatch } from "./store/customStoreHook";
import { urls } from "./helpers/urls";

type Props = {};

const App = (_props: Props) => {
  const dispatch = useAppDispatch();

  const fetchLoggedUser = async () => {
    try {
      const { data } = await apigateway.get(urls.userDetails);
      const userPayload = data.data ;
      dispatch(loginUser(userPayload));
    } catch (error) {
      dispatch(logoutUser({}));
    }
  };

  useEffect(() => {
    fetchLoggedUser();
  }, [dispatch]);

  
  return (
    <div className="min-h-screen bg-gradient-to-r from-active/20 to-primary/20 font-primary  text-text-primary">
      {/* Routes  */}
      <AppRoutes />
      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar 
        closeOnClick
        pauseOnHover
        draggable
        theme="light"
        toastClassName={() =>
          "shadow-lg  p-0 rounded-full md:m-0 mt-2"
        }
        transition={Slide}
        icon={false}
        closeButton={false}
      />
    </div>
  );
};

export default App;
