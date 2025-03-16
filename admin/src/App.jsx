import { Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import SideBar from "./components/SideBar";
import Add from "./pages/Add";
import List from "./pages/List";
import Order from "./pages/Orders";
import Artists from "./pages/Artists"; // Corrected name
import { useEffect, useState } from "react";
import Login from "./components/Login";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CreateBlog from "./pages/CreateBlog";
import UpdateBlog from "./pages/UpdateBlog";
import BlogList from "./pages/BlogList";

export const backendUrl = import.meta.env.VITE_BACKEND_URL;
export const currency = "$";

const App = () => {
  const [token, setToken] = useState(localStorage.getItem("token") || "");

  useEffect(() => {
    localStorage.setItem("token", token);
  }, [token]);

  return (
    <div className="bg-gray-50 min-h-screen">
      <ToastContainer />
      {token === "" ? (
        <Login setToken={setToken} />
      ) : (
        <>
          <Navbar setToken={setToken} />
          <hr />
          <div className="flex w-full">
            <SideBar />
            <div className="w-[70%] mx-auto ml-[max(5vw, 25px)] my-8 text-gray-600 text-base">
              <Routes>
                <Route path="/add" element={<Add token={token} />} />
                <Route path="/list" element={<List token={token} />} />
                <Route path="/order" element={<Order token={token} />} />
                <Route path="/create" element={<CreateBlog token={token} />} />
                <Route path="/ListBlog" element={<BlogList token={token} />} />
                <Route path="/ListBlog/update/:id" element={<UpdateBlog token={token} />} />
                <Route path="/artist" element={<Artists />} /> {/* Updated route */}
              </Routes>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default App;
