import React from "react";
import { TreePine, Plus, Menu } from "lucide-react";
import { NavLink, Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import {
  Popover,
  PopoverContent,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

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

  const initials = user?.name
    ? user.name
        .split(" ")
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0].toUpperCase())
        .join("")
    : "FT";

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
          <NavLink
            className={navClass({
              isActive: window.location.pathname === "/circles",
            })} 
            to="/circles"
          >
            Circles
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
            <Popover>
              <PopoverTrigger asChild>
                <button
                  type="button"
                  className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-2 py-1 transition-colors hover:bg-gray-50"
                >
                  <Avatar size="sm">
                    <AvatarImage
                      src={`data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='64' height='64'><rect width='64' height='64' rx='32' fill='%23EADFD2'/><circle cx='32' cy='26' r='10' fill='%23C9B5A5'/><path d='M14 56c4-10 16-14 18-14s14 4 18 14' fill='%23C9B5A5'/></svg>`}
                      alt="Profile"
                    />
                    <AvatarFallback>{initials}</AvatarFallback>
                  </Avatar>
                </button>
              </PopoverTrigger>
              <PopoverContent align="end" className="w-48">
                <PopoverHeader>
                  <PopoverTitle className="text-sm">Account</PopoverTitle>
                </PopoverHeader>
                <Link
                  to="/profile"
                  className="rounded-md px-3 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-100"
                >
                  Go to profile
                </Link>
                <button
                  type="button"
                  onClick={logout}
                  className="rounded-md px-3 py-2 text-left text-sm text-gray-700 transition-colors hover:bg-gray-100"
                >
                  Logout
                </button>
              </PopoverContent>
            </Popover>
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
