import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import logo from "../assets/skipli_logo.png";
import { PiSquaresFour } from "react-icons/pi";
import { SiGithub } from "react-icons/si";
import { FaUserCircle } from "react-icons/fa";
import { ROUTES } from "../constants/route.constant";
import { clearUser } from "../store/userSlice";
import { getLinkUrl } from "../api/auth";
import type { RootState } from "../store/index";

export default function Header() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  const profile = useSelector((state: RootState) => state.user.profile);

  const displayName = profile?.name;
  const displayEmail = profile?.email || "";

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    dispatch(clearUser());
    navigate(ROUTES.LOGIN, { replace: true });
  };

  useEffect(() => {
    if (!isUserMenuOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isUserMenuOpen]);

  return (
    <header className="flex items-center justify-between px-4 py-2 h-14 bg-[#242A30] shrink-0">
      <div className="flex items-center gap-4">
        <div className="">
          <PiSquaresFour size={24} color="#9095A1" />
        </div>
        <button className="hover:bg-gray-900 rounded-2xl p-1 flex flex-col items-center justify-center">
          <img
            onClick={() => {
              navigate("/");
            }}
            src={logo}
            alt="Skipli Logo"
            className="h-[32px] w-auto"
          />
        </button>
      </div>
      <div className="relative flex items-center gap-3" ref={userMenuRef}>
        <button
          type="button"
          onClick={() => setIsUserMenuOpen((prev) => !prev)}
          className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-800 text-white transition-colors hover:bg-blue-700"
        >
          <FaUserCircle size={20} />
        </button>

        {isUserMenuOpen && (
          <div className="absolute right-0 top-10 z-[9999] w-[320px] overflow-hidden rounded-lg border border-gray-200 bg-white py-3 text-gray-800 shadow-xl">
            <div className="px-4 text-xs font-bold uppercase text-gray-500">Account profile</div>

            <div className="mt-4 flex items-center gap-3 px-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-blue-950 text-white">
                <FaUserCircle size={32} />
              </div>
              <div className="min-w-0">
                <div className="truncate text-sm font-medium text-gray-900">{displayName}</div>
                <div className="truncate text-sm text-gray-500">{displayEmail}</div>
              </div>
            </div>

            <div className="mt-4 border-y border-gray-200 py-1">
              <div className="flex items-center justify-between gap-2 px-4 py-2 text-sm">
                <div className="flex items-center gap-2">
                  <SiGithub size={16} className="shrink-0 text-gray-600" />
                  <div className="flex items-center gap-2 mt-0.5">
                    {profile?.isGithubLinked && profile.githubName && (
                      <>
                        GitHub:{" "}
                        <a
                          href={`https://github.com/${profile.githubName}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-gray-700 transition hover:text-black hover:underline"
                        >
                          <span className="font-medium text-gray-900">@{profile.githubName}</span>
                        </a>
                      </>
                    )}

                    {!profile?.isGithubLinked && <span className="italic text-gray-400">GitHub not linked</span>}
                  </div>
                </div>
                {!profile?.isGithubLinked && (
                  <button
                    type="button"
                    onClick={async () => {
                      try {
                        const { url } = await getLinkUrl();
                        window.location.href = url;
                      } catch {
                        // ignore
                      }
                    }}
                    className="shrink-0 rounded-md bg-gray-900 px-2.5 py-1 text-xs font-medium text-white hover:bg-gray-700 transition-colors"
                  >
                    Connect
                  </button>
                )}
              </div>
            </div>

            <div className="py-1">
              <button
                type="button"
                onClick={handleLogout}
                className="w-full px-4 py-2 text-left text-sm transition-colors hover:bg-gray-100"
              >
                Log out
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
