import { RouterProvider } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { router } from "./routes/index.tsx";
import "./App.css";

function App() {
  return (
    <>
      <RouterProvider router={router} />
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
    </>
  );
}

export default App;
