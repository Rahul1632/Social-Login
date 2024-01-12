import React from "react";
import ReactDOM from "react-dom/client";
import { UserProvider } from "./context/index";
import 'react-toastify/dist/ReactToastify.css';

import App from "./App.jsx";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <UserProvider>
      <App />
    </UserProvider>
  </React.StrictMode>
);
