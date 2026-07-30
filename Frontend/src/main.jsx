import { createRoot } from "react-dom/client";
import { ToastContainer, Bounce } from "react-toastify";
import { BrowserRouter } from "react-router";
import { ShopContextProvider } from "./context/ShopContext.jsx";

import "./index.css";
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <ShopContextProvider>
      <App />
      <ToastContainer
        position="top-center"
        autoClose={2000}
        hideProgressBar={false}
        closeOnClick={false}
        pauseOnHover={true}
        draggable={true}
        theme="light"
        transition={Bounce}
      />
    </ShopContextProvider>
  </BrowserRouter>,
);
