import {
  Home,
  LogOut,
  Menu,
  X,
  Store,
  ShoppingCart,
  User2,
} from "lucide-react";
import { useState } from "react";
import { useAppDispatch, useAppSelector } from "../store/customStoreHook";
import { logoutUser } from "../store/auth.slice";
import { setActive } from "../store/app.slice";
import { apigateway } from "../config/axios.config";
import { urls } from "../helpers/urls";
import { toast } from "react-toastify";
import CustomToaster from "./Helpers/CustomToaster";

type Props = {};

const Sidebar = (_props: Props) => {
  const { activeTab } = useAppSelector((state) => state.app);
  const { user } = useAppSelector((state) => state.auth);
  const [isOpen, setIsOpen] = useState<boolean>(true);
  const dispatch = useAppDispatch();

  const menuItems = [
    {
      name: "Dashboard",
      icon: <Home size={20} />,
      acceptedRoles: ["user", "admin", "super-admin"],
    },
    {
      name: "Stock",
      icon: <Store size={20} />,
      acceptedRoles: ["user", "admin", "super-admin"],
    },
    {
      name: "Orders",
      icon: <ShoppingCart size={20} />,
      acceptedRoles: ["user", "admin", "super-admin"],
    },
    {
      name: "Customers",
      icon: <User2 size={20} />,
      acceptedRoles: ["admin", "super-admin","user"],
    },
  ];

  const handleLogout = async () => {
    const response = await apigateway.post(urls.logout);
    toast(
      <CustomToaster
        type="success"
        message={response?.data?.message || "Failed to Logout"}
      />
    );

    dispatch(logoutUser({}));
  };
  const handleActiveTab = (tab: string) => {
    // setActiveTab(tab);
    dispatch(setActive(tab));
  };
  return (
    <div className="py-2 p-1 h-screen">
      <div
        className={`${
          isOpen ? "md:w-44" : "md:w-20"
        } w-16  rounded-lg shadow backdrop-blur-lg h-full flex flex-col justify-between transition-all duration-300 ease-in-out `}
      >
        {/* Header (Logo + Toggle) */}
        <div className="flex items-center justify-center md:justify-between px-4 py-4">
          <div className="text-xl font-bold text-primary tracking-wide">MO</div>
          <div
            className="text-primary cursor-pointer hidden md:block"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={20} /> : <Menu size={20} />}
          </div>
        </div>

        {/* Menu */}
        <nav className="flex-1 mt-2 px-2">
          {menuItems.map((item) => {
            if (item.acceptedRoles.includes(user.role as string)) {
              return (
                <div
                  key={item.name}
                  className={`${
                    activeTab === item.name
                      ? "bg-primary/20 text-primary"
                      : "text-text-secondary"
                  } flex items-center gap-3 px-3 py-2 cursor-pointer rounded-md hover:bg-primary/20 hover:text-primary transition-all my-1 justify-center md:justify-start`}
                  onClick={() => handleActiveTab(item.name)}
                >
                  {item.icon}
                  {/* Names only on desktop & only when open */}
                  <span
                    className={`${
                      isOpen ? "md:inline " : "hidden"
                    } hidden  text-sm  font-semibold transition-all duration-200 ease-in-out whitespace-nowrap overflow-hidden`}
                  >
                    {item.name}
                  </span>
                </div>
              );
            }
          })}
        </nav>

        {/* Logout */}
        <div className="px-2 py-4">
          <div
            className="flex items-center gap-3 px-3 py-2 cursor-pointer rounded-md text-text-secondary hover:bg-error/20 hover:text-error transition-all justify-center md:justify-start"
            onClick={handleLogout}
          >
            <LogOut size={20} />
            <span
              className={`${
                isOpen ? "md:inline" : "hidden"
              } hidden text-sm font-semibold whitespace-nowrap`}
            >
              Logout
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
