import { useState } from "react";
import { Outlet } from "react-router-dom";
import Header from "./Header";
import Sidebar from "./Sidebar";
import type { Board } from "@/api/board";

export default function Layout() {
  const [board, setBoard] = useState<Board | null>(null);

  return (
    <div className="flex flex-col h-screen overflow-hidden text-gray-800">
      <Header />

      {/* main contianer */}
      <div id="container" className="flex flex-1 overflow-hidden">
        <Sidebar board={board} setBoard={setBoard} />
        <main className="flex-1 min-w-0 overflow-hidden bg-[#2F3840]">
          <Outlet context={{ board, setBoard }} />
        </main>
      </div>
    </div>
  );
}
