import { Outlet } from "react-router-dom";
import Header from "./Header";
import Sidebar from "./Sidebar";

export default function Layout() {
  return (
    <div className="flex flex-col h-screen overflow-hidden text-gray-800">
      <Header />

      {/* main contianer */}
      <div id="container" className="flex flex-1 overflow-hidden ">
        <Sidebar />
        <main className="flex-1 overflow-y-auto p-6 bg-[#2F3840]">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
