import React, { useState, useContext } from "react";
import { Link, NavLink } from "react-router-dom";
import { assets } from "../assets/assets";
import { ShopContext } from "../context/ShopContext";

const Navbar = () => {
  const [visible, setVisible] = useState(false);

  const {
    setShowSearch,
    getCartCount,
    navigate,
    token,
    setToken,
    setCartItems,
  } = useContext(ShopContext);

  const logout = () => {
    navigate("/login");
    localStorage.removeItem("token");
    setToken("");
    setCartItems({});
  };

  const navLinks = [
    { to: "/", text: "HOME" },
    { to: "/collection", text: "COLLECTION" },
    { to: "/artist", text: "ARTISTS" },
    { to: "/about", text: "ABOUT" },
    { to: "/contact", text: "CONTACT" },
  ];

  return (
    <div className="relative z-50">
      {/* Main Navbar */}
      <div className="flex items-center justify-between py-5 px-4 sm:px-10 font-medium bg-white shadow-md">
        <Link to="/">
          <img src={assets.logo1} className="w-36" alt="Logo" />
        </Link>

        {/* Desktop Navigation */}
        <ul className="hidden sm:flex gap-5 text-sm text-gray-700">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className="flex flex-col items-center gap-1"
              activeClassName="text-black"
            >
              <p>{link.text}</p>
              <hr className="w-2/4 border-none h-[1.5px] bg-gray-700 hidden" />
            </NavLink>
          ))}
        </ul>

        {/* Icons and Mobile Menu Button */}
        <div className="flex items-center gap-6">
          <img
            src={assets.search_icon}
            className="w-5 cursor-pointer"
            onClick={() => setShowSearch(true)}
            alt="Search"
            aria-label="Search"
          />
          <div className="group relative">
            <img
              src={assets.profile_icon}
              className="w-5 cursor-pointer"
              alt="Profile"
              onClick={() => (token ? null : navigate("/login"))}
              aria-label={token ? "Profile" : "Login"}
            />
            {token && (
              <div className="group-hover:block hidden absolute dropdown-menu right-0 pt-4">
                <div className="flex flex-col gap-2 w-36 py-3 px-5 bg-slate-100 text-gray-500 rounded">
                  <p className="cursor-pointer hover:text-black">My Profile</p>
                  <p
                    onClick={() => navigate("/orders")}
                    className="cursor-pointer hover:text-black"
                  >
                    Orders
                  </p>
                  <p
                    onClick={logout}
                    className="cursor-pointer hover:text-black"
                  >
                    Logout
                  </p>
                </div>
              </div>
            )}
          </div>
          <Link to="/cart" className="relative">
            <img
              src={assets.cart_icon}
              className="w-5 min-w-5"
              alt="Cart"
              aria-label="Shopping Cart"
            />
            <p className="absolute right-[-5px] bottom-[-5px] w-4 text-center leading-4 bg-black text-white aspect-square rounded-full text-[8px]">
              {getCartCount()}
            </p>
          </Link>
          <img
            src={assets.menu_icon}
            className="w-5 cursor-pointer sm:hidden"
            onClick={() => setVisible(true)}
            alt="Menu"
            aria-label="Open Menu"
          />
        </div>
      </div>

      {/* Full-Screen Sidebar Menu for Small Devices */}
      <div
        className={`fixed inset-0 bg-white transition-all duration-300 z-50 ${visible ? "translate-x-0" : "translate-x-full"}`}
      >
        <div className="flex flex-col text-gray-600 h-full">
          <div
            onClick={() => setVisible(false)}
            className="flex items-center gap-4 p-4 cursor-pointer border-b"
          >
            <img
              src={assets.dropdown_icon}
              className="h-4 rotate-180"
              alt="Close Menu"
              aria-label="Close Menu"
            />
            <p>Close</p>
          </div>
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              onClick={() => setVisible(false)}
              to={link.to}
              className="py-4 pl-6 border-b"
              activeClassName="text-black"
            >
              {link.text}
            </NavLink>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
