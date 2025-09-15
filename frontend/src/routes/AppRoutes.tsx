import _React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "../pages/Login";
import Register from "../pages/Register";
import ProtectedRoute from "./ProtectedRoute";

type Props = {};

const AppRoutes = (_props: Props) => {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          {/* Public routes  */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<ProtectedRoute />} />

          {/* universal Route */}
          <Route path={"*"} element={<Navigate to={"/login"} />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default AppRoutes;
