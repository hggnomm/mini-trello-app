import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { ROUTES } from "../constants/route.constant.ts";
import { getProfile } from "../api/auth.ts";
import { setUser } from "../store/userSlice.ts";
import type { RootState } from "../store/index.ts";

export const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const token = localStorage.getItem("accessToken");
  const dispatch = useDispatch();

  const profile = useSelector((state: RootState) => state.user.profile);

  const [isFetching, setIsFetching] = useState(!profile);
  if (!token) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  useEffect(() => {
    if (profile) {
      setIsFetching(false);
      return;
    }

    const fetchProfile = async () => {
      try {
        const data = await getProfile();
        dispatch(setUser(data));
      } catch {
        localStorage.removeItem("accessToken");
        window.location.href = ROUTES.LOGIN;
      } finally {
        setIsFetching(false);
      }
    };

    fetchProfile();
  }, []);

  if (isFetching) return null;

  return <>{children}</>;
};

export default ProtectedRoute;
