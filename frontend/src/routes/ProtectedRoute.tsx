import { Navigate } from "react-router-dom";
import { useAppSelector } from "../store/customStoreHook";
import Sidebar from "../components/Sidebar";
import Dashboard from "../components/Dashboard";
import Stock from "../components/Stock/Stock";
import Navbar from "../components/Navbar";
import Orders from "../components/Orders/Orders";

type Props = {};

const ProtectedRoute = (_props: Props) => {
  const user = useAppSelector((state) => state.auth);
  const app = useAppSelector((state) => state.app);

  if (!user.isAuthenticated) {
    return <Navigate to={"/login"} />;
  }
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden py-2 pr-2">
        <div className="flex-1 overflow-y-auto bg-cards/40 backdrop-blur-lg rounded-lg  shadow px-4 py-2 ">
          <Navbar tab={app.activeTab} />
          {app.activeTab === "Dashboard" && <Dashboard />}
          {app.activeTab === "Stock" && <Stock />}
          {app.activeTab === "Orders" && <Orders/>}
        </div>
      </div>
    </div>
  );
};

export default ProtectedRoute;
