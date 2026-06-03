import React, { useState, useEffect } from "react";
import { Sun, Moon, Menu, X, ArrowUpRight } from "lucide-react";

interface NavbarProps {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

export default function Navbar({ isDarkMode, toggleDarkMode }: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("hero");
  const [scrollProgress, setScrollProgress] = useState(0);

  const navItems = [
    { id: "hero", label: "Home" },
    { id: "about", label: "Expertise" },
    { id: "experience", label: "Experience" },
    { id: "skills", label: "Pillars" },
    { id: "projects", label: "Portfolio" },
    { id: "education", label: "Education" },
    { id: "contact", label: "Contact" },
  ];

  useEffect(() => {
    const handleScroll = () => {
      // Scroll progress
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      if (totalScroll > 0) {
        setScrollProgress((window.scrollY / totalScroll) * 100);
      }

      // Scrolled bg trigger
      setIsScrolled(window.scrollY > 20);

      // Active section detection
      const sections = navItems.map((item) => document.getElementById(item.id));
      const scrollPosition = window.scrollY + 250;

      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        if (section && section.offsetTop <= scrollPosition) {
          setActiveSection(navItems[i].id);
          break;
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      const offset = 80; // height of sticky navbar
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
      setActiveSection(id);
      setIsMobileMenuOpen(false);
    }
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white/80 dark:bg-slate-950/80 backdrop-blur-md border-b border-slate-200/50 dark:border-slate-800/50 shadow-lg shadow-slate-900/5 dark:shadow-black/10"
          : "bg-transparent"
      }`}
    >
      {/* Scroll Progress Bar */}
      <div className="w-full h-1 bg-slate-200/30 dark:bg-slate-800/30">
        <div
          className="h-full bg-gradient-to-r from-orange-500 via-teal-500 to-teal-600 transition-all duration-75"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo Branding */}
          <a
            href="#hero"
            onClick={(e) => handleNavClick(e, "hero")}
            className="flex items-center space-x-2 group"
          >
            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-teal-500 p-[2px] shadow-md shadow-teal-500/10 group-hover:shadow-orange-500/20 transition-all duration-300">
              <div className="flex items-center justify-center w-full h-full bg-white dark:bg-slate-900 rounded-[9px]">
                <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-teal-500 text-lg">
                  HI
                </span>
              </div>
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-slate-900 dark:text-white tracking-tight leading-none text-base sm:text-lg group-hover:text-teal-500 dark:group-hover:text-orange-400 transition-colors">
                Humaidi Iskandar
              </span>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium tracking-wider uppercase mt-0.5">
                Social Impact & Organizational Development
              </span>
            </div>
          </a>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            {navItems.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                onClick={(e) => handleNavClick(e, item.id)}
                className={`px-3 py-2 rounded-lg text-sm font-semibold tracking-wide transition-all duration-200 ${
                  activeSection === item.id
                    ? "text-teal-600 dark:text-teal-400 bg-teal-50/80 dark:bg-teal-950/30"
                    : "text-slate-600 dark:text-slate-300 hover:text-orange-500 dark:hover:text-orange-400 hover:bg-slate-100/50 dark:hover:bg-slate-800/40"
                }`}
              >
                {item.label}
              </a>
            ))}
          </div>

          {/* Right-side actions (Dark mode toggle + Quick Contact CTA) */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Dark Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 hover:text-orange-500 dark:hover:text-orange-400 border border-slate-200/50 dark:border-slate-700/50 hover:border-orange-200 dark:hover:border-orange-900/50 transition-all duration-300 shadow-sm cursor-pointer"
              aria-label="Toggle Dark Mode"
            >
              {isDarkMode ? <Sun className="w-5 h-5 animate-pulse" /> : <Moon className="w-5 h-5" />}
            </button>

            {/* CTA Button */}
            <a
              href="#contact"
              onClick={(e) => handleNavClick(e, "contact")}
              className="relative group px-5 py-2.5 rounded-xl font-semibold text-sm tracking-wide text-white shadow-lg shadow-teal-500/15 overflow-hidden"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-orange-500 via-teal-500 to-teal-600 transition-transform duration-300 group-hover:scale-105" />
              <span className="relative flex items-center gap-1.5">
                Hire Me <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </span>
            </a>
          </div>

          {/* Mobile Menu & Dark mode triggers */}
          <div className="flex items-center space-x-2 lg:hidden">
            {/* Dark Mode Toggle for Mobile */}
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 transition-colors cursor-pointer"
            >
              {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 transition-colors cursor-pointer"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-white/95 dark:bg-slate-950/95 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800 px-3 sm:px-4 pt-2 pb-6 space-y-1 shadow-2xl max-h-[calc(100vh-4rem)] overflow-y-auto">
          {navItems.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              onClick={(e) => handleNavClick(e, item.id)}
              className={`block px-4 py-3.5 rounded-xl text-[15px] font-semibold tracking-wide transition-all touch-manipulation min-h-[48px] flex items-center ${
                activeSection === item.id
                  ? "text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-950/50"
                  : "text-slate-700 dark:text-slate-200 active:bg-slate-100 dark:active:bg-slate-800"
              }`}
            >
              {item.label}
            </a>
          ))}
          <div className="pt-4 px-2">
            <a
              href="#contact"
              onClick={(e) => handleNavClick(e, "contact")}
              className="flex items-center justify-center w-full px-5 py-3.5 rounded-xl bg-gradient-to-r from-orange-500 to-teal-500 text-white font-bold text-[15px] text-center shadow-lg shadow-teal-500/20 active:scale-[0.98] transition-all touch-manipulation min-h-[48px]"
            >
              Hire Humaidi <ArrowUpRight className="w-4 h-4 ml-1.5" />
            </a>
          </div>
        </div>
      )}
    </nav>
  );
}