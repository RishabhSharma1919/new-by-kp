

import React, { useEffect, useState, useContext } from "react";
import { ShopContext } from "../context/ShopContext";
import { useDebounce } from "use-debounce";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { X, Search } from "lucide-react"; // ShadCN Lucide Icons
import { useNavigate, useLocation } from "react-router-dom"; // Import navigation hooks

const SearchBar = () => {
  const { search, setSearch, showSearch, setShowSearch } = useContext(ShopContext);
  const [debouncedSearch] = useDebounce(search, 500);
  const navigate = useNavigate(); // Hook for navigation
  const location = useLocation(); // Hook to get current route

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") setShowSearch(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    // Logic to handle debouncedSearch here (e.g., API call or filtering)
  }, [debouncedSearch]);

  const handleSearchClick = () => {
    if (location.pathname !== "/collection") {
      navigate("/collection"); // Navigate to /collection if not already there
    }
    setShowSearch(true); // Show the search bar
  };

  return showSearch ? (
    <Card className="border-t border-b bg-gray-50 text-center transition-all duration-300 ease-in-out p-4">
      <div
        className="flex items-center justify-center border border-gray-400 rounded-full px-4 py-2 w-3/4 sm:w-1/2 mx-auto cursor-pointer"
        onClick={handleSearchClick} // Navigate to /collection on click
      >
        <Search className="w-5 h-5 text-gray-500" />
        <Input
          type="text"
          placeholder="Search"
          className="flex-1 outline-none bg-transparent text-sm px-2 py-1"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          autoFocus
        />
      </div>

      <Button
        variant="ghost"
        size="icon"
        className="mt-3"
        onClick={() => setShowSearch(false)}
      >
        <X className="w-5 h-5 text-gray-500" />
      </Button>
    </Card>
  ) : null;
};

export default SearchBar;
