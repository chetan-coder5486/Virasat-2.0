import React from "react";
import { TreePine, Plus, Menu } from "lucide-react";
import { NavLink, Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const navClass = ({ isActive }) =>
    `rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
      isActive
        ? "bg-[#A65E2E] text-white"
        : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
    }`;
  const { user, logout } = useAuth();

  const handleNewStory = () => {
    const targetState = { openUpload: true };

    if (location.pathname === "/stories") {
      navigate("/stories", { replace: true, state: targetState });
    } else {
      navigate("/stories", { state: targetState });
    }
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-gray-200 bg-white/80 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo Section */}
        <Link className="flex items-center gap-2" to="/">
          <TreePine className="h-7 w-7 text-[#A65E2E]" />
          <span className="text-xl font-bold text-gray-900">Family Trunk</span>
        </Link>

        {/* Desktop Navigation Links */}
        <div className="hidden items-center gap-1 md:flex">
          <NavLink
            className={navClass({ isActive: window.location.pathname === "/" })}
            to="/"
          >
            Dashboard
          </NavLink>
          <NavLink
            className={navClass({
              isActive: window.location.pathname === "/timeline",
            })}
            to="/timeline"
          >
            Timeline
          </NavLink>
          <NavLink
            className={navClass({
              isActive: window.location.pathname === "/stories",
            })}
            to="/stories"
          >
            Stories
          </NavLink>
          <NavLink
            className={navClass({
              isActive: window.location.pathname === "/family",
            })}
            to="/family"
          >
            Family
          </NavLink>
        </div>

        {/* Desktop Action Buttons */}
        <div className="hidden items-center gap-3 md:flex">
          <button
            type="button"
            onClick={handleNewStory}
            className="inline-flex items-center justify-center text-sm font-medium transition-colors bg-[#A65E2E] text-white hover:bg-[#8e4f26] h-9 rounded-md px-3 gap-2"
          >
            <Plus className="h-4 w-4" />
            New Story
          </button>
          {user ? (
            <button
              type="button"
              onClick={logout}
              className="inline-flex items-center justify-center text-sm font-medium transition-colors border border-gray-300 bg-white hover:bg-gray-50 h-9 rounded-md px-3"
            >
              Logout
            </button>
          ) : (
            <Link
              className="inline-flex items-center justify-center text-sm font-medium transition-colors border border-gray-300 bg-white hover:bg-gray-50 h-9 rounded-md px-3"
              to="/login"
            >
              Sign In
            </Link>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button className="md:hidden p-2 text-gray-600">
          <Menu className="h-6 w-6" />
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
