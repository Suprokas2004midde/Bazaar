import React, { useContext, useState } from "react";
import { Link, NavLink } from "react-router";
import { Search, User, ShoppingBag, Menu, ArrowLeft } from "lucide-react";
import logo from "../assets/logo.png";
import { ShopContext } from "../context/ShopContext";
import { ThemeToggle } from "./ui/theme-toggle";
import { Badge } from "./ui/badge";

const Navbar = () => {
  const [visible, setvisible] = useState(false);
  const { showSearch, setShowSearch, getCartCount, setCartItems, navigate, setToken, token } = useContext(ShopContext);

  const logout = () => {
    navigate('/login');
    setToken('');
    localStorage.removeItem('token');
    setCartItems({});
  };

  return (
    <div className="flex items-center justify-between py-4 border-b border-[var(--border-color)]/40 font-medium transition-colors">
      <Link to="/" className="flex items-center gap-2">
        <img
          src={logo}
          alt="Brand_logo"
          className="w-32 sm:w-40 md:w-44 cursor-pointer brightness-105 dark:brightness-120 drop-shadow-sm"
        />
      </Link>

      <ul className="hidden sm:flex gap-6 text-sm tracking-wider font-semibold text-[var(--text-muted)]">
        <NavLink to="/" className="flex flex-col gap-1 items-center hover:text-[var(--primary-accent)] transition-colors">
          <p>HOME</p>
          <hr className="w-2/4 border-none bg-[var(--primary-accent)] h-[2px] hidden" />
        </NavLink>
        <NavLink to="/collection" className="flex flex-col gap-1 items-center hover:text-[var(--primary-accent)] transition-colors">
          <p>COLLECTION</p>
          <hr className="w-2/4 border-none bg-[var(--primary-accent)] h-[2px] hidden" />
        </NavLink>
        <NavLink to="/about" className="flex flex-col gap-1 items-center hover:text-[var(--primary-accent)] transition-colors">
          <p>ABOUT</p>
          <hr className="w-2/4 border-none bg-[var(--primary-accent)] h-[2px] hidden" />
        </NavLink>
        <NavLink to="/contact" className="flex flex-col gap-1 items-center hover:text-[var(--primary-accent)] transition-colors">
          <p>CONTACT</p>
          <hr className="w-2/4 border-none bg-[var(--primary-accent)] h-[2px] hidden" />
        </NavLink>
      </ul>

      <div className="flex flex-row gap-3 sm:gap-5 items-center">
        {/* Theme Switcher */}
        <ThemeToggle />

        {/* Search Icon */}
        <button
          onClick={() => setShowSearch(!showSearch)}
          type="button"
          aria-label="Toggle Search"
          className="p-2 rounded-full hover:bg-[var(--secondary-accent)]/20 text-[var(--text-main)] transition-colors cursor-pointer"
        >
          <Search className="w-5 h-5" />
        </button>

        {/* Profile Dropdown */}
        <div className="group relative">
          <button
            onClick={() => (token ? null : navigate("/login"))}
            type="button"
            aria-label="User Account"
            className="p-2 rounded-full hover:bg-[var(--secondary-accent)]/20 text-[var(--text-main)] transition-colors cursor-pointer block"
          >
            <User className="w-5 h-5" />
          </button>
          {token && (
            <div className="z-50 group-hover:block hidden absolute dropdown-menu right-0 pt-2 w-44">
              <div className="flex flex-col gap-2 p-3 bg-[var(--bg-card)] border border-[var(--border-color)] text-[var(--text-main)] shadow-[var(--shadow-md)] rounded-xl backdrop-blur-md">
                <p className="px-3 py-1.5 rounded-md hover:bg-[var(--secondary-accent)]/20 cursor-pointer text-sm font-medium transition-colors">
                  My Profile
                </p>
                <p
                  onClick={() => navigate('/orders')}
                  className="px-3 py-1.5 rounded-md hover:bg-[var(--secondary-accent)]/20 cursor-pointer text-sm font-medium transition-colors"
                >
                  Orders
                </p>
                <p
                  onClick={logout}
                  className="px-3 py-1.5 rounded-md hover:bg-rose-500/20 text-rose-500 cursor-pointer text-sm font-medium transition-colors"
                >
                  Logout
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Cart Icon & Badge */}
        <Link to="/cart" className="relative p-2 rounded-full hover:bg-[var(--secondary-accent)]/20 text-[var(--text-main)] transition-colors">
          <ShoppingBag className="w-5 h-5" />
          {getCartCount() > 0 && (
            <Badge
              variant="accent"
              className="absolute -top-1 -right-1 h-5 min-w-5 flex items-center justify-center p-0 text-[10px] font-bold shadow-md animate-pulse"
            >
              {getCartCount()}
            </Badge>
          )}
        </Link>

        {/* Mobile Menu Toggle */}
        <button
          onClick={() => setvisible(true)}
          type="button"
          aria-label="Open Menu"
          className="p-2 rounded-md sm:hidden text-[var(--text-main)] hover:bg-[var(--secondary-accent)]/20 transition-colors"
        >
          <Menu className="w-6 h-6" />
        </button>
      </div>

      {/* Mobile Drawer */}
      <div
        className={`fixed top-0 right-0 bottom-0 z-50 overflow-hidden bg-[var(--bg-card)] text-[var(--text-main)] transition-all duration-300 border-l border-[var(--border-color)] ${
          visible ? "w-64 shadow-2xl" : "w-0"
        }`}
      >
        <div className="flex flex-col text-sm h-full">
          <div
            onClick={() => setvisible(false)}
            className="flex items-center gap-3 p-4 border-b border-[var(--border-color)]/50 cursor-pointer hover:bg-[var(--secondary-accent)]/20 font-semibold"
          >
            <ArrowLeft className="w-5 h-5" />
            <p>Back</p>
          </div>
          <NavLink
            onClick={() => setvisible(false)}
            className="py-3 px-6 border-b border-[var(--border-color)]/30 hover:bg-[var(--secondary-accent)]/20 font-medium"
            to="/"
          >
            HOME
          </NavLink>
          <NavLink
            onClick={() => setvisible(false)}
            className="py-3 px-6 border-b border-[var(--border-color)]/30 hover:bg-[var(--secondary-accent)]/20 font-medium"
            to="/collection"
          >
            COLLECTION
          </NavLink>
          <NavLink
            onClick={() => setvisible(false)}
            className="py-3 px-6 border-b border-[var(--border-color)]/30 hover:bg-[var(--secondary-accent)]/20 font-medium"
            to="/about"
          >
            ABOUT
          </NavLink>
          <NavLink
            onClick={() => setvisible(false)}
            className="py-3 px-6 border-b border-[var(--border-color)]/30 hover:bg-[var(--secondary-accent)]/20 font-medium"
            to="/contact"
          >
            CONTACT
          </NavLink>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
