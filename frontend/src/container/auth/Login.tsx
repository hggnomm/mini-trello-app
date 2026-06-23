import React, { useState } from "react";
import logo from "../../assets/skipli_logo.png";
import bgLeft from "../../assets/background_left.png";
import bgRight from "../../assets/background_right.png";

export default function Login() {
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Email submitted: " + email);
  };

  return (
    <div id="login_page" className="relative flex min-h-screen flex-col items-center justify-center bg-white">
      <div className="z-10 w-full max-w-[350px] rounded border border-gray-200 py-8 px-8 flex flex-col gap-3">
        <div className="flex flex-col items-center justify-center">
          <img src={logo} alt="Skipli Logo" className="h-[56px] w-auto " />
        </div>

        <div className="text-center">
          <p className="text-sm font-medium text-gray-600 leading-4.5">Log in to continue</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-1">
          <div>
            <input
              type="email"
              required
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-sm border border-[#565D6D] px-3 py-2.5 text-sm  outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>
          <button
            type="submit"
            className="flex w-full items-center justify-center rounded-sm bg-[#0052CC] py-2.5 text-[12px] font-normal text-white transition hover:bg-[#0065FF]"
          >
            Continue
          </button>
        </form>

        <div className="text-center text-[11px] text-[#536488]">
          <p className="text-[#3F4C67]">Privacy Policy</p>
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
