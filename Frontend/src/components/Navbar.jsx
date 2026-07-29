import React, { useContext, useState, useRef, useEffect } from "react";
import { Link, NavLink } from "react-router";
import { Search, User, ShoppingBag, Menu, ArrowLeft, LogOut, PackageCheck, Heart } from "lucide-react";
import logo from "../assets/logo.png";
import { ShopContext } from "../context/ShopContext";
import { ThemeToggle } from "./ui/theme-toggle";
import { Badge } from "./ui/badge";

const Navbar = () => {
  const [visible, setvisible] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const dropdownRef = useRef(null);
  const { showSearch, setShowSearch, getCartCount, setCartItems, navigate, setToken, token, wishlist, clearWishlist } = useContext(ShopContext);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, []);

  const handleMouseEnter = () => {
    if (window.matchMedia('(hover: hover)').matches) {
      setIsProfileOpen(true);
    }
  };

  const handleMouseLeave = () => {
    if (window.matchMedia('(hover: hover)').matches) {
      setIsProfileOpen(false);
    }
  };

  const logout = () => {
    navigate('/login');
    setToken('');
    localStorage.removeItem('token');
    setCartItems({});
    if (clearWishlist) clearWishlist();
  };

  return (
    <>
      <div className="flex items-center justify-between py-1 backdrop-blur-3xl font-medium transition-colors">
      <Link to="/" className="flex items-center gap-2">
        <img
          src={logo}
          alt="Brand_logo"
          className="w-28 sm:w-36 md:w-40 cursor-pointer brightness-105 dark:brightness-120 drop-shadow-sm"
        />
      </Link>

      <ul className="hidden sm:flex gap-6 text-sm tracking-wider font-semibold text-[var(--text-muted)]">
        <NavLink
          to="/"
          className="flex flex-col gap-1 items-center hover:text-[#0980FF] [&.active]:text-[#0980FF] transition-colors"
        >
          <p>HOME</p>
          <hr className="w-2/4 border-none bg-[#0980FF] h-[2px] hidden" />
        </NavLink>
        <NavLink
          to="/collection"
          className="flex flex-col gap-1 items-center hover:text-[#0980FF] [&.active]:text-[#0980FF] transition-colors"
        >
          <p>COLLECTION</p>
          <hr className="w-2/4 border-none bg-[#0980FF] h-[2px] hidden" />
        </NavLink>
        <NavLink
          to="/about"
          className="flex flex-col gap-1 items-center hover:text-[#0980FF] [&.active]:text-[#0980FF] transition-colors"
        >
          <p>ABOUT</p>
          <hr className="w-2/4 border-none bg-[#0980FF] h-[2px] hidden" />
        </NavLink>
        <NavLink
          to="/contact"
          className="flex flex-col gap-1 items-center hover:text-[#0980FF] [&.active]:text-[#0980FF] transition-colors"
        >
          <p>CONTACT</p>
          <hr className="w-2/4 border-none bg-[#0980FF] h-[2px] hidden" />
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
          className="p-2 rounded-full hover:bg-[#0980FF]/10 hover:text-[#0980FF] text-[var(--text-main)] transition-colors cursor-pointer"
        >
          <Search className="w-5 h-5" />
        </button>

        {/* Profile Dropdown */}
        <div
          ref={dropdownRef}
          className="group relative"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <button
            onClick={() => setIsProfileOpen((prev) => !prev)}
            type="button"
            aria-label="User Account"
            className="p-2 rounded-full hover:bg-[#0980FF]/10 hover:text-[#0980FF] text-[var(--text-main)] transition-colors cursor-pointer block"
          >
            <User className="w-5 h-5" />
          </button>
          <div
            className={`z-50 ${isProfileOpen ? "block" : "hidden"} sm:group-hover:block absolute dropdown-menu right-0 pt-2 w-44`}
          >
            <div className="flex flex-col gap-2 p-3 bg-[var(--bg-card)] border border-[var(--border-color)] text-[var(--text-main)] shadow-[var(--shadow-md)] rounded-xl backdrop-blur-md">
              {token ? (
                <>
                  <p
                    onClick={() => {
                      setIsProfileOpen(false);
                      navigate("/profile");
                    }}
                    className="px-3 py-1.5 rounded-md hover:bg-[#0980FF]/10 hover:text-[#0980FF] cursor-pointer text-sm font-medium transition-colors"
                  >
                    My Profile
                  </p>
                  <p
                    onClick={() => {
                      setIsProfileOpen(false);
                      navigate("/orders");
                    }}
                    className="px-3 py-1.5 rounded-md hover:bg-[#0980FF]/10 hover:text-[#0980FF] cursor-pointer text-sm font-medium transition-colors"
                  >
                    Orders
                  </p>
                  <p
                    onClick={() => {
                      setIsProfileOpen(false);
                      logout();
                    }}
                    className="px-3 py-1.5 rounded-md hover:bg-rose-500/20 text-rose-500 cursor-pointer text-sm font-medium transition-colors"
                  >
                    Logout
                  </p>
                </>
              ) : (
                <p
                  onClick={() => {
                    setIsProfileOpen(false);
                    navigate("/login");
                  }}
                  className="px-3 py-1.5 rounded-md hover:bg-[#0980FF]/10 hover:text-[#0980FF] cursor-pointer text-sm font-medium transition-colors"
                >
                  Login / Register
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Cart Icon & Badge */}
        <Link
          to="/cart"
          className="relative p-2 rounded-full hover:bg-[#0980FF]/10 hover:text-[#0980FF] text-[var(--text-main)] transition-colors"
        >
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
          className="p-2 rounded-md sm:hidden text-[var(--text-main)] hover:bg-[#0980FF]/10 hover:text-[#0980FF] transition-colors"
        >
          <Menu className="w-6 h-6" />
        </button>
      </div>
    </div>

      {/* Mobile Drawer */}
      <div
        className={`fixed top-0 right-0 bottom-0 z-[9999] overflow-hidden bg-[var(--bg-card)] text-[var(--text-main)] transition-all duration-300 border-l border-[var(--border-color)] ${
          visible ? "w-64 shadow-2xl" : "w-0"
        }`}
      >
        <div className="flex flex-col text-sm h-full">
          <div
            onClick={() => setvisible(false)}
            className="flex items-center gap-3 p-4 border-b border-[var(--border-color)]/50 cursor-pointer hover:bg-[#0980FF]/10 hover:text-[#0980FF] font-semibold"
          >
            <ArrowLeft className="w-5 h-5" />
            <p>Back</p>
          </div>
          <NavLink
            onClick={() => setvisible(false)}
            className="py-3 px-6 border-b border-[var(--border-color)]/30 hover:bg-[#0980FF]/10 hover:text-[#0980FF] font-medium"
            to="/"
          >
            HOME
          </NavLink>
          <NavLink
            onClick={() => setvisible(false)}
            className="py-3 px-6 border-b border-[var(--border-color)]/30 hover:bg-[#0980FF]/10 hover:text-[#0980FF] font-medium"
            to="/collection"
          >
            COLLECTION
          </NavLink>
          <NavLink
            onClick={() => setvisible(false)}
            className="py-3 px-6 border-b border-[var(--border-color)]/30 hover:bg-[#0980FF]/10 hover:text-[#0980FF] font-medium"
            to="/about"
          >
            ABOUT
          </NavLink>
          <NavLink
            onClick={() => setvisible(false)}
            className="py-3 px-6 border-b border-[var(--border-color)]/30 hover:bg-[#0980FF]/10 hover:text-[#0980FF] font-medium"
            to="/contact"
          >
            CONTACT
          </NavLink>

          {/* Account section in Mobile Drawer */}
          <div className="mt-auto border-t border-[var(--border-color)]/50 p-4 flex flex-col gap-2">
            {token ? (
              <>
                <div
                  onClick={() => {
                    setvisible(false);
                    navigate("/orders");
                  }}
                  className="flex items-center gap-3 py-2.5 px-3 rounded-lg hover:bg-[#0980FF]/10 hover:text-[#0980FF] cursor-pointer font-medium"
                >
                  <PackageCheck className="w-4 h-4 text-[#0980FF]" />
                  <span>My Orders</span>
                </div>
                <button
                  onClick={() => {
                    setvisible(false);
                    logout();
                  }}
                  className="flex items-center gap-3 py-2.5 px-3 rounded-lg hover:bg-rose-500/20 text-rose-500 cursor-pointer font-medium w-full text-left"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <div
                onClick={() => {
                  setvisible(false);
                  navigate("/login");
                }}
                className="flex items-center gap-3 py-2.5 px-3 rounded-lg bg-[#0980FF] text-white cursor-pointer font-medium justify-center"
              >
                <User className="w-4 h-4" />
                <span>Login / Register</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
