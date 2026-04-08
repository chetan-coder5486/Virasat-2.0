import React from "react";
import { TreePine, Plus, Menu } from "lucide-react";

const Navbar = () => {
  return (
    <nav className="sticky top-0 z-50 border-b border-gray-200 bg-white/80 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        
        {/* Logo Section */}
        <a className="flex items-center gap-2" href="/">
          <TreePine className="h-7 w-7 text-[#A65E2E]" />
          <span className="text-xl font-bold text-gray-900">Family Trunk</span>
        </a>

        {/* Desktop Navigation Links */}
        <div className="hidden items-center gap-1 md:flex">
          <a 
            className="rounded-lg px-4 py-2 text-sm font-medium transition-colors bg-[#A65E2E] text-white" 
            href="/"
          >
            Dashboard
          </a>
          <a 
            className="rounded-lg px-4 py-2 text-sm font-medium transition-colors text-gray-600 hover:bg-gray-100 hover:text-gray-900" 
            href="/timeline"
          >
            Timeline
          </a>
          <a 
            className="rounded-lg px-4 py-2 text-sm font-medium transition-colors text-gray-600 hover:bg-gray-100 hover:text-gray-900" 
            href="/stories"
          >
            Stories
          </a>
          <a 
            className="rounded-lg px-4 py-2 text-sm font-medium transition-colors text-gray-600 hover:bg-gray-100 hover:text-gray-900" 
            href="/family"
          >
            Family
          </a>
        </div>

        {/* Desktop Action Buttons */}
        <div className="hidden items-center gap-3 md:flex">
          <button className="inline-flex items-center justify-center text-sm font-medium transition-colors bg-[#A65E2E] text-white hover:bg-[#8e4f26] h-9 rounded-md px-3 gap-2">
            <Plus className="h-4 w-4" />
            New Story
          </button>
          
          <a className="inline-flex items-center justify-center text-sm font-medium transition-colors border border-gray-300 bg-white hover:bg-gray-50 h-9 rounded-md px-3 " 
          href="/login">
            Sign In
          </a>
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