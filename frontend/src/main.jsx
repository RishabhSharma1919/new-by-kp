import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";
import ShopContextProvider from "./context/ShopContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter
  
  future={{ 
    v7_startTransition: true, // ✅ Enables automatic state transitions in v7
    v7_relativeSplatPath: true // ✅ Enables new relative route resolution behavior
  }}>
    <ShopContextProvider>
      <App />
    </ShopContextProvider>
  </BrowserRouter>
);