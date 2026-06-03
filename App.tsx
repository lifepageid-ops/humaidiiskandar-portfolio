import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import About from "./components/About";
import Experience from "./components/Experience";
import Skills from "./components/Skills";
import Projects from "./components/Projects";
import Education from "./components/Education";
import Certifications from "./components/Certifications";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import ResumeModal from "./components/ResumeModal";
import FloatingContact from "./components/FloatingContact";

export default function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isCVOpen, setIsCVOpen] = useState(false);

  // Track theme preference on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    
    if (savedTheme === "dark" || (!savedTheme && systemPrefersDark)) {
      setIsDarkMode(true);
      document.documentElement.classList.add("dark");
    } else {
      setIsDarkMode(false);
      document.documentElement.classList.remove("dark");
    }

    // Pre-load image and set up smooth entrance
    const img = new Image();
    img.src = "/images/humaidi.png";
    img.onload = () => {
      setTimeout(() => setIsLoading(false), 1500);
    };
    // Fallback in case of offline loading
    const timer = setTimeout(() => setIsLoading(false), 1800);
    return () => clearTimeout(timer);
  }, []);

  const toggleDarkMode = () => {
    setIsDarkMode((prev) => {
      const nextTheme = !prev;
      if (nextTheme) {
        document.documentElement.classList.add("dark");
        localStorage.setItem("theme", "dark");
      } else {
        document.documentElement.classList.remove("dark");
        localStorage.setItem("theme", "light");
      }
      return nextTheme;
    });
  };

  const handleViewProjects = () => {
    const projectsSection = document.getElementById("projects");
    if (projectsSection) {
      projectsSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleContactMe = () => {
    const contactSection = document.getElementById("contact");
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 min-h-screen transition-colors duration-300 selection:bg-orange-500 selection:text-white">
      
      {/* PRINT SPECIFIC STYLE - Hides UI elements when browser prints */}
      <style>{`
        @media print {
          body {
            background-color: white !important;
            color: black !important;
          }
          nav, footer, button, .print\\:hidden {
            display: none !important;
          }
          #root > div > section {
            display: none !important;
          }
          #root > div > section#cv-print-section {
            display: block !important;
          }
        }
      `}</style>

      {/* Global Loading Screen */}
      <AnimatePresence>
        {isLoading && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="fixed inset-0 z-59 bg-slate-950 flex flex-col items-center justify-center text-center p-6"
          >
            {/* Monogram Monolith */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="relative flex items-center justify-center w-24 h-24 rounded-[32px] bg-gradient-to-br from-orange-500 via-teal-500 to-teal-600 p-[2px] shadow-2xl shadow-teal-500/10 mb-8"
            >
              <div className="flex items-center justify-center w-full h-full bg-slate-950 rounded-[30px]">
                <span className="font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-500 via-teal-400 to-teal-500 text-3xl tracking-tighter">
                  HI
                </span>
              </div>
            </motion.div>

            <motion.h1
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white"
            >
              Humaidi Iskandar
            </motion.h1>
            
            <motion.p
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="text-xs sm:text-sm text-slate-400 uppercase tracking-widest mt-2 font-semibold"
            >
              Community Development & Human Capital Consultant
            </motion.p>

            {/* Loading bar */}
            <div className="w-48 h-1 bg-slate-900 rounded-full overflow-hidden mt-8 relative">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ duration: 1.2, ease: "easeInOut" }}
                className="h-full bg-gradient-to-r from-orange-500 to-teal-400 rounded-full"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Layout */}
      {!isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="flex flex-col min-h-screen relative"
        >
          {/* Sticky Navigation Bar */}
          <Navbar isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />

          {/* Portfolio Page Sections */}
          <main className="flex-grow">
            <Hero
              onViewProjects={handleViewProjects}
              onContactMe={handleContactMe}
              onDownloadCV={() => setIsCVOpen(true)}
            />
            <About />
            <Experience />
            <Skills />
            <Projects />
            <Education />
            <Certifications />
            <Contact />
          </main>

          {/* Elegant Footer */}
          <Footer />

          {/* Print/Save Resume Modal */}
          <ResumeModal isOpen={isCVOpen} onClose={() => setIsCVOpen(false)} />

          {/* Sticky Interactive Contact FAB Widget */}
          <FloatingContact onOpenCV={() => setIsCVOpen(true)} />
        </motion.div>
      )}
    </div>
  );
}