import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { ROUTES } from "../constants/route.constant.ts";

export const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const token = localStorage.getItem("accessToken");
  if (!token) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }
  return <>{children}</>;
};

export default ProtectedRoute;
