import { createBrowserRouter, Navigate } from "react-router-dom";
import Login from "../container/auth/Login.tsx";
import Dashboard from "../container/Dashboard.tsx";
import ProtectedRoute from "../components/ProtectedRoute.tsx";
import { ROUTES } from "../constants/route.constant.ts";

export const router = createBrowserRouter([
  {
    path: ROUTES.LOGIN,
    element: <Login />,
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
