import { createBrowserRouter, Navigate } from "react-router-dom";
import Auth from "../container/auth/Auth.tsx";
import Dashboard from "../container/Dashboard.tsx";
import ProtectedRoute from "../components/ProtectedRoute.tsx";
import { ROUTES } from "../constants/route.constant.ts";

export const router = createBrowserRouter([
  {
    path: ROUTES.LOGIN,
    element: <Auth />,
  },
  {
    path: ROUTES.REGISTER,
    element: <Auth />,
  },
  {
    path: ROUTES.DASHBOARD,
    element: (
      <ProtectedRoute>
        <Dashboard />
      </ProtectedRoute>
    ),
  },
  {
    path: "*",
    element: <Navigate to={ROUTES.DASHBOARD} replace />,
  },
]);
