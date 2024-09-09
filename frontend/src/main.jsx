import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
createRoot(document.getElementById("root")).render(
  // <StrictMode>
  <div>
    <App />
    <ToastContainer
      position="bottom-right"
      autoClose={3000}
      closeOnClick={true}
    />
  </div>
  // </StrictMode>
);
