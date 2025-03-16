import React, { useState, useContext } from "react";
import { Link, NavLink } from "react-router-dom";
import { assets } from "../assets/assets";
import { ShopContext } from "../context/ShopContext";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetClose,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

const Navbar = () => {
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
    { to: "/", text: "Home" },
    { to: "/collection", text: "Collection" },
    { to: "/artist", text: "Artists" },
    {to:"/wishlist",text:"WishList"},
    { to: "/Blog", text: "Our Blogs" },
    { to: "/about", text: "About" },
    { to: "/contact", text: "Contact" },
  ];

  return (
    <div className="relative z-50">
      {/* Main Navbar */}
      <div className="flex items-center justify-between py-6 px-6 sm:px-12 font-medium shadow-md">
        <Link to="/">
          <img src={assets.logo1} className="w-44" alt="Logo" />
        </Link>

        {/* Desktop Navigation */}
        <ul className="hidden sm:flex gap-8 text-xl text-[#D6D6C7]">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className="relative flex flex-col items-center gap-1 hover:underline hover:text-white transition"
            >
              {link.text}
            </NavLink>
          ))}
        </ul>

        {/* Icons and Mobile Menu Button */}
        <div className="flex items-center gap-8">
          {/* Search Icon */}
          <img
            src={assets.search_icon}
            className="w-6 cursor-pointer"
            onClick={() => setShowSearch(true)}
            alt="Search"
            aria-label="Search"
          />

          {/* Profile Dropdown Menu */}
          {/* Profile Dropdown Menu */}
{/* Profile Dropdown Menu */}
<DropdownMenu>
  <DropdownMenuTrigger asChild>
    <img
      src={assets.profile_icon}
      className="w-6 cursor-pointer"
      alt="Profile"
      aria-label={token ? "Profile" : "Login"}
      onClick={() => (token ? null : navigate("/login"))}
    />
  </DropdownMenuTrigger>
  {token && (
    <DropdownMenuContent
      align="end"
      className="w-48 bg-[#262B2B] text-gray-500 shadow-lg rounded-md py-2"
    >
      <DropdownMenuItem 
        onClick={() => navigate("/cart")} 
        className="px-4 py-2 hover:bg-[#3A3F3F] hover:text-gray-300"
      >
        My Profile
      </DropdownMenuItem>
      <DropdownMenuItem 
        onClick={() => navigate("/orders")} 
        className="px-4 py-2 hover:bg-[#3A3F3F] hover:text-gray-300"
      >
        Orders
      </DropdownMenuItem>
      <DropdownMenuItem 
        onClick={logout} 
        className="px-4 py-2 text-red-400 hover:bg-[#3A3F3F] hover:text-red-300"
      >
        Logout
      </DropdownMenuItem>
     
    </DropdownMenuContent>
  )}
</DropdownMenu>
  {/* Cart Icon */}
          <Link to="/cart" className="relative">
            <img
              src={assets.cart_icon}
              className="w-6 min-w-6"
              alt="Cart"
              aria-label="Shopping Cart"
            />
            <p className="absolute right-[-6px] bottom-[-6px] w-5 text-center leading-5 bg-white text-black aspect-square rounded-full text-[10px]">
              {getCartCount()}
            </p>
          </Link>

          {/* Mobile Menu Button */}
          <Sheet>
            <SheetTrigger asChild>
              <img
                src={assets.menu_icon}
                className="w-6 cursor-pointer sm:hidden"
                alt="Menu"
                aria-label="Open Menu"
              />
            </SheetTrigger>
            <SheetContent side="right" className="w-64 p-4 bg-[#262B2B] text-[#D6D6C7] shadow-lg">
  <SheetClose asChild>
    <button className="absolute top-4 right-4 text-white text-xl">❌</button>
  </SheetClose>
  <nav className="flex flex-col gap-6 mt-12 text-2xl">
    {navLinks.map((link) => (
      <SheetClose asChild key={link.to}>
        <NavLink 
          to={link.to} 
          className="hover:underline hover:text-white"
        >
          {link.text}
        </NavLink>
      </SheetClose>
    ))}
  </nav>
</SheetContent>

          </Sheet>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
