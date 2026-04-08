import React from "react";
import Navbar from "../components/Navbar";
import { ArrowRight, BookOpen } from "lucide-react"; // Optional: cleaner than raw SVGs

const HeroPage = () => {
  return (
    <div className="min-h-screen">
      <section className="relative overflow-hidden">
        {/* Background Image & Overlay */}
        <div className="absolute inset-0">
          <img 
            src="hero-bg-D1VU07Ny.jpg" 
            alt="Family memories" 
            className="h-full w-full object-cover" 
          />
          {/* Using an arbitrary value for the overlay color if foreground isn't defined */}
          <div className="absolute inset-0 bg-black/60"></div>
        </div>

        {/* Content */}
        <div className="container relative z-10 flex min-h-[70vh] flex-col items-center justify-center py-20 text-center mx-auto px-4">
          <div style={{ opacity: 1, transform: 'none' }}>
            <h1 className="mb-4 font-serif text-4xl font-bold text-white md:text-6xl lg:text-7xl">
              Every Family Has<br />
              <span className="bg-gradient-to-r from-orange-400 to-rose-400 bg-clip-text text-transparent">
                A Story Worth Keeping
              </span>
            </h1>
            
            <p className="mx-auto mb-8 max-w-2xl text-lg text-white/80">
              Preserve your family's stories, photos, and memories in one beautiful place. 
              Share across generations and keep your legacy alive.
            </p>

            <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              {/* Primary Button - Using that brown color we found earlier */}
              <button className="inline-flex items-center justify-center font-medium transition-all bg-[#A65E2E] hover:bg-[#8e4f26] text-white h-12 rounded-md px-8 gap-2 text-base shadow-lg">
                Start Your Family Trunk
                <ArrowRight className="h-5 w-5" />
              </button>

              {/* Secondary Button */}
              <button className="inline-flex items-center justify-center font-medium transition-all border border-white/30 bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white h-12 rounded-md px-8 gap-2 text-base">
                <BookOpen className="h-5 w-5" />
                Browse Stories
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HeroPage;