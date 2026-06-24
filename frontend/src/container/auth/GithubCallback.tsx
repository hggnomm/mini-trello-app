import { useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";

import BaseModal from "../../base/baseModal";
import { exchangeGithubCode, getProfile } from "../../api/auth";
import { ROUTES } from "../../constants/route.constant";
import { setUser } from "../../store/userSlice";
import { cn } from "../../utils/cn";
import BaseSpinner from "@/base/baseSpinner";

type Status = "loading" | "success" | "error";

export default function GithubCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const hasExchanged = useRef(false);
  const code = searchParams.get("code");

  const [status, setStatus] = useState<Status>("loading");
  const [githubName, setGithubName] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [countdown, setCountdown] = useState(3);

  const isLoading = status === "loading";
  const isSuccess = status === "success";
  const isError = status === "error";

  useEffect(() => {
    if (hasExchanged.current) return;
    hasExchanged.current = true;

    window.history.replaceState({}, "", "/");

    if (!code) {
      setStatus("error");
      setErrorMessage("No authorization code received from GitHub.");
      return;
    }

    const exchange = async () => {
      try {
        const result = await exchangeGithubCode(code);

        setGithubName(result.githubName ?? "");
        setStatus("success");

        const profile = await getProfile();
        dispatch(setUser(profile));
      } catch (error) {
        setStatus("error");
        setErrorMessage(error instanceof Error ? error.message : "GitHub connection failed.");
      }
    };

    exchange();
  }, [code, dispatch]);

  useEffect(() => {
    if (!isSuccess) return;

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          navigate(ROUTES.DASHBOARD, { replace: true });
          return 0;
        }

        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isSuccess, navigate]);

  const handleClose = () => {
    navigate(ROUTES.DASHBOARD, { replace: true });
  };

  return (
    <BaseModal isOpen onClose={handleClose}>
      <div className="flex min-h-44 flex-col items-center justify-center gap-4 py-2 text-center">
        {isLoading && <BaseSpinner className="h-10 w-10" />}

        {(isSuccess || isError) && (
          <>
            {isSuccess && <FaCheckCircle className="text-5xl text-green-500" />}
            {isError && <FaTimesCircle className="text-5xl text-red-500" />}

            <div>
              <h3 className="text-lg font-semibold">{isSuccess ? "Connected successfully" : "Connection failed"}</h3>

              {isSuccess && githubName && <p className="mt-1 text-sm text-gray-500">@{githubName}</p>}
              {isError && <p className="mt-1 text-sm text-gray-500">{errorMessage}</p>}
            </div>

            {isSuccess && <p className="text-sm text-gray-400">Redirecting in {countdown}s...</p>}

            <button
              type="button"
              onClick={handleClose}
              className={cn("w-full rounded-lg py-2 text-white transition", "bg-gray-900 hover:bg-gray-800")}
            >
              {isSuccess ? "Go to Dashboard" : "Back to Dashboard"}
            </button>
          </>
        )}
      </div>
    </BaseModal>
  );
}
