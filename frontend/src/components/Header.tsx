import logo from "../assets/skipli_logo.png";
import { PiSquaresFour } from "react-icons/pi";

export default function Header() {
  return (
    <header className="flex items-center justify-between px-4 py-2 border-b border-gray-200 h-14 bg-[#242A30] shrink-0">
      <div className="flex items-center gap-4">
        <div className="">
          <PiSquaresFour size={24} color="#9095A1" />
        </div>
        <div className="flex flex-col items-center justify-center">
          <img src={logo} alt="Skipli Logo" className="h-[32px] w-auto" />
        </div>
      </div>
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-blue-800 text-white flex items-center justify-center font-bold text-xs">
          NH
        </div>
      </div>
    </header>
  );
}
