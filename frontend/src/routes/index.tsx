import { createBrowserRouter, Navigate } from "react-router-dom";
import Login from "../container/Login.tsx";
import Dashboard from "../container/Dashboard.tsx";
import ProtectedRoute from "../components/ProtectedRoute.tsx";

export const router = createBrowserRouter([
  {
    path: "*",
    element: <Navigate to="/" replace />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <Dashboard />
      </ProtectedRoute>
    ),
  },
]);
