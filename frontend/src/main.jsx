import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <div className="m-5">
      <h1 className="text-red-500">header</h1>
      <App />
    </div>
  </StrictMode>
);
