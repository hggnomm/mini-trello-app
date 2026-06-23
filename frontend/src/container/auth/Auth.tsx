import { useLocation } from "react-router-dom";
import logo from "../../assets/skipli_logo.png";
import bgLeft from "../../assets/background_left.png";
import bgRight from "../../assets/background_right.png";
import { ROUTES } from "../../constants/route.constant";
import AuthForm from "../../components/AuthForm";

type AuthProps = {
  mode?: "login" | "register";
};

export default function Auth({ mode }: AuthProps) {
  const location = useLocation();
  const activeMode = mode || (location.pathname === ROUTES.REGISTER ? "register" : "login");

  return (
    <div id="login_page" className="relative flex min-h-screen flex-col items-center justify-center bg-white font-sans antialiased">
      <div className="z-10 w-full max-w-[350px] rounded border border-gray-200 py-8 px-8 flex flex-col gap-3">
        <div className="flex flex-col items-center justify-center">
          <img src={logo} alt="Skipli Logo" className="h-[56px] w-auto" />
        </div>

        <AuthForm mode={activeMode} />

        <div className="text-center text-[11px] text-[#536488]">
          <p className="text-[#3F4C67] hover:underline cursor-pointer">Privacy Policy</p>
          <div className="w-full">
            <p> This site is protected by reCAPTCHA and the Google Privacy</p>
            <a
              href="https://policies.google.com/privacy"
              target="_blank"
              rel="noreferrer"
              className="text-blue-600 hover:underline"
            >
              Privacy Policy and Terms of Service apply.
            </a>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 hidden md:block w-[24%] max-w-[312px]">
        <img src={bgLeft} alt="Background Left" className="w-full h-auto object-contain" />
      </div>

      <div className="absolute bottom-0 right-0 hidden md:block w-[24%] max-w-[312px]">
        <img src={bgRight} alt="Background Right" className="w-full h-auto object-contain" />
      </div>
    </div>
  );
}
