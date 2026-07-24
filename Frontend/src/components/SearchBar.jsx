import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import { Search, X } from "lucide-react";
import { useLocation } from "react-router";
import { Input } from "./ui/input";

const SearchBar = () => {
  const { search, setSearch, showSearch, setShowSearch } = useContext(ShopContext);
  const [visible, setVisible] = useState(false);
  const location = useLocation();

  useEffect(() => {
    if (location.pathname.includes("collection")) {
      setVisible(true);
    } else {
      setVisible(false);
    }
  }, [location]);

  return showSearch && visible ? (
    <div className="py-4 bg-[var(--bg-subtle)]/80 backdrop-blur-md border-b border-[var(--border-color)]/50 transition-all duration-300 flex justify-center items-center">
      <div className="relative w-full max-w-xl px-4 flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 pr-8 bg-[var(--bg-card)] rounded-full focus:ring-2 focus:ring-[var(--primary-accent)]"
            type="text"
            placeholder="Search collection..."
          />
          {search && (
            <X
              onClick={() => setSearch("")}
              className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] cursor-pointer hover:text-[var(--text-main)]"
            />
          )}
        </div>
        <button
          onClick={() => setShowSearch(false)}
          className="text-xs font-semibold text-[var(--text-muted)] hover:text-[var(--text-main)] p-2"
        >
          Close
        </button>
      </div>
    </div>
  ) : null;
};

export default SearchBar;
