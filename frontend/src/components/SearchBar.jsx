import React, { useEffect, useState, useContext, useMemo } from "react";
import { ShopContext } from "../context/ShopContext";
import { assets } from "../assets/assets";
import { useLocation } from "react-router-dom";

const SearchBar = () => {
  const { search, setSearch, showSearch, setShowSearch } = useContext(ShopContext);
  const [visible, setVisible] = useState(false);
  const location = useLocation();

  const isVisible = useMemo(() => location.pathname.startsWith("/collection"), [location]);

  useEffect(() => {
    setVisible(isVisible);
  }, [isVisible]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") setShowSearch(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return showSearch && visible ? (
    <div className="border-t border-b bg-gray-50 text-center transition-all duration-300 ease-in-out">
      <div className="inline-flex items-center justify-center border border-gray-400 px-5 py-2 my-5 mx-3 rounded-full w-3/4 sm:w-1/2">
        <input
          type="text"
          placeholder="Search"
          className="flex-1 outline-none bg-inherit text-sm px-2 py-1"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <img src={assets.search_icon} className="w-4" alt="Search Icon" />
      </div>

      <img
        src={assets.cross_icon}
        className="inline w-3 cursor-pointer"
        alt="Close Search"
        onClick={() => setShowSearch(false)}
      />
    </div>
  ) : null;
};

export default SearchBar;
