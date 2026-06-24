import { createBrowserRouter, Navigate } from "react-router-dom";
import Auth from "../container/auth/Auth.tsx";
import Dashboard from "../container/dashboard/Dashboard.tsx";
import Layout from "../components/Layout.tsx";
import ProtectedRoute from "../components/ProtectedRoute.tsx";
import GithubCallback from "../container/auth/GithubCallback.tsx";
import { ROUTES } from "../constants/route.constant.ts";
import { lazy } from "react";

const BoardView = lazy(() => import("../container/dashboard/BoardView.tsx"));
const BoardInviteAccept = lazy(() => import("../container/dashboard/BoardInviteAccept.tsx"));

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
    element: (
      <ProtectedRoute>
        <Layout />
      </ProtectedRoute>
    ),
    children: [
      {
        path: ROUTES.DASHBOARD,
        element: <Dashboard />,
      },
      {
        path: ROUTES.BOARD_DETAIL,
        element: <BoardView />,
      },
      {
        path: ROUTES.BOARD_INVITE_ACCEPT,
        element: <BoardInviteAccept />,
      },
      {
        path: ROUTES.GITHUB_CALLBACK,
        element: <GithubCallback />,
      },
    ],
  },
  {
    path: "*",
    element: <Navigate to={ROUTES.DASHBOARD} replace />,
  },
]);
