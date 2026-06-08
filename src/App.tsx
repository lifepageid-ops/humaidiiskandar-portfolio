import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { BookOpen, Calculator, Landmark, ArrowRight, ArrowLeft, FileText } from "lucide-react";

// --- Komponen Portofolio Asli ---
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

// --- Aplikasi Ekosistem ---
import FinanceApp from './modules/finance/src/App';
import PayrollApp from './modules/payroll/src/App';
import CVApp from './modules/cv-generator/CVApp'; 
import { FinanceGate } from './components/FinanceGate'; 

// ==========================================
// 1. KOMPONEN HALAMAN HUMED BERBAGI (3-APPS UPGRADED GRID)
// ==========================================
const HumedBerbagi = () => (
  <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center pt-24 p-6 font-sans transition-colors duration-300 relative overflow-hidden">
    <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-teal-500/20 dark:bg-teal-900/30 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-[100px] opacity-60"></div>
    
    <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl w-full text-center mb-16 relative z-10">
      <h1 className="text-4xl md:text-5xl font-extrabold text-slate-800 dark:text-slate-100 mb-6 tracking-tight">Humed Berbagi</h1>
      <p className="text-slate-600 dark:text-slate-400 text-lg max-w-2xl mx-auto">
        Kumpulan sistem cerdas untuk mendukung tata kelola finansial, rekrutmen mandiri, dan manajemen kompensasi secara riil.
      </p>
    </motion.div>
    
    <motion.div 
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ staggerChildren: 0.2 }}
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl mb-16 relative z-10 text-left"
    >
      {/* CARD 1: FINANCE APP */}
      <Link to="/humed-berbagi/finance" className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-lg hover:shadow-xl border border-slate-100 dark:border-slate-800 flex flex-col justify-between items-start gap-4 transition-all hover:border-teal-400 dark:hover:border-teal-500 hover:-translate-y-1 group cursor-pointer">
        <div className="flex items-start gap-4">
          <div className="p-3.5 bg-teal-50 dark:bg-teal-900/50 rounded-2xl group-hover:scale-110 transition-transform shrink-0">
            <Landmark className="text-teal-600 dark:text-teal-400 w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-slate-800 dark:text-slate-100 text-lg mb-1 tracking-tight">Pencatatan Keuangan</h3>
            <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm leading-relaxed">Sistem pelacakan arus kas cerdas terintegrasi Radar Zakat Sentinel.</p>
          </div>
        </div>
        <div className="w-full text-right text-xs font-bold text-teal-500 dark:text-teal-400 flex items-center justify-end gap-1 group-hover:translate-x-1 transition-transform pt-2">
          Buka Aplikasi <ArrowRight className="w-3.5 h-3.5" />
        </div>
      </Link>

      {/* CARD 2: PAYROLL APP */}
      <Link to="/humed-berbagi/payroll" className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-lg hover:shadow-xl border border-slate-100 dark:border-slate-800 flex flex-col justify-between items-start gap-4 transition-all hover:border-orange-400 dark:hover:border-orange-500 hover:-translate-y-1 group cursor-pointer">
        <div className="flex items-start gap-4">
          <div className="p-3.5 bg-orange-50 dark:bg-orange-900/50 rounded-2xl group-hover:scale-110 transition-transform shrink-0">
            <Calculator className="text-orange-500 dark:text-orange-400 w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-slate-800 dark:text-slate-100 text-lg mb-1 tracking-tight">Sistem Payroll (TER)</h3>
            <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm leading-relaxed">Kalkulator otomatisasi kompensasi penggajian regulasi perpajakan terbaru.</p>
          </div>
        </div>
        <div className="w-full text-right text-xs font-bold text-orange-500 dark:text-orange-400 flex items-center justify-end gap-1 group-hover:translate-x-1 transition-transform pt-2">
          Buka Aplikasi <ArrowRight className="w-3.5 h-3.5" />
        </div>
      </Link>

      {/* CARD 3: CV GENERATOR SYSTEM */}
      <Link to="/humed-berbagi/cv-generator" className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-lg hover:shadow-xl border border-slate-100 dark:border-slate-800 flex flex-col justify-between items-start gap-4 transition-all hover:border-cyan-400 dark:hover:border-cyan-500 hover:-translate-y-1 group cursor-pointer relative overflow-hidden">
        <div className="absolute top-0 right-0 bg-cyan-500 text-white text-[9px] font-black px-2 py-0.5 rounded-bl-xl uppercase tracking-wider animate-pulse">Bilingual</div>
        <div className="flex items-start gap-4">
          <div className="p-3.5 bg-cyan-50 dark:bg-cyan-900/50 rounded-2xl group-hover:scale-110 transition-transform shrink-0">
            <FileText className="text-cyan-600 dark:text-cyan-400 w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-slate-800 dark:text-slate-100 text-lg mb-1 tracking-tight">Hum-CV Maker</h3>
            <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm leading-relaxed">Arsitek resume ATS-friendly (ID/EN) untuk memotong hambatan fresh graduate.</p>
          </div>
        </div>
        <div className="w-full text-right text-xs font-bold text-cyan-500 dark:text-cyan-400 flex items-center justify-end gap-1 group-hover:translate-x-1 transition-transform pt-2">
          Mulai Bikin CV <ArrowRight className="w-3.5 h-3.5" />
        </div>
      </Link>
    </motion.div>

    <Link to="/" className="text-slate-500 dark:text-slate-400 hover:text-teal-600 dark:hover:text-teal-400 font-medium transition-colors flex items-center px-6 py-3 bg-white dark:bg-slate-900 rounded-full shadow-sm border border-slate-200 dark:border-slate-800 relative z-10 cursor-pointer">
      <ArrowLeft className="w-4 h-4 mr-2" /> Kembali ke Beranda
    </Link>
  </div>
);

const Bacain = () => (
  <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center p-6 text-center font-sans transition-colors duration-300">
    <BookOpen className="w-20 h-20 text-orange-500 dark:text-orange-400 mb-8 animate-bounce" />
    <h1 className="text-4xl font-bold text-slate-800 dark:text-slate-100 mb-4">Modul Bacain</h1>
    <p className="text-slate-600 dark:text-slate-400 text-lg mb-10 max-w-md leading-relaxed">
      Ruang literasi digital ini sedang dalam tahap perakitan. Segera hadir untuk memberikan wawasan mendalam bagi Anda.
    </p>
    <Link to="/" className="px-8 py-4 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 rounded-full hover:bg-slate-800 dark:hover:bg-white transition-colors shadow-lg font-bold flex items-center cursor-pointer">
      <ArrowLeft className="w-5 h-5 mr-2" /> Kembali ke Beranda
    </Link>
  </div>
);

// ==========================================
// 3. KOMPONEN UTAMA (APP RENDERER CORE)
// ==========================================
export default function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isCVOpen, setIsCVOpen] = useState(false);

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

    // Bypass loader safe valve
    const timer = setTimeout(() => setIsLoading(false), 1500);

    const img = new Image();
    img.src = "/images/humaidi.png";
    img.onload = () => {
      setIsLoading(false);
      clearTimeout(timer);
    };
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
    if (projectsSection) projectsSection.scrollIntoView({ behavior: "smooth" });
  };

  const handleContactMe = () => {
    const contactSection = document.getElementById("contact");
    if (contactSection) contactSection.scrollIntoView({ behavior: "smooth" });
  };

  // --- Layout Portofolio Utama ---
  const PortfolioMain = () => (
    <div className="bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 min-h-screen transition-colors duration-300 selection:bg-orange-500 selection:text-white">
      <style>{`
        @media print {
          body { background-color: white !important; color: black !important; }
          nav, footer, button, .print\\:hidden, #ecosystem-section { display: none !important; }
          #root > div > section { display: none !important; }
          #root > div > section#cv-print-section { display: block !important; }
        }
      `}</style>

      <AnimatePresence>
        {isLoading && (
          <motion.div
            initial={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }}
            className="fixed inset-0 z-59 bg-slate-950 flex flex-col items-center justify-center text-center p-6"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.5, ease: "easeOut" }}
              className="relative flex items-center justify-center w-24 h-24 rounded-[32px] bg-gradient-to-br from-orange-500 via-teal-500 to-teal-600 p-[2px] shadow-2xl shadow-teal-500/10 mb-8"
            >
              <div className="flex items-center justify-center w-full h-full bg-slate-950 rounded-[30px]">
                <span className="font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-500 via-teal-400 to-teal-500 text-3xl tracking-tighter">
                  HI
                </span>
              </div>
            </motion.div>
            <motion.h1
              initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2, duration: 0.5 }}
              className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white"
            >
              Humaidi Iskandar
            </motion.h1>
            <motion.p
              initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3, duration: 0.5 }}
              className="text-xs sm:text-sm text-slate-400 uppercase tracking-widest mt-2 font-semibold"
            >
              Community Development & Human Capital Consultant
            </motion.p>
            <div className="w-48 h-1 bg-slate-900 rounded-full overflow-hidden mt-8 relative">
              <motion.div
                initial={{ width: 0 }} animate={{ width: "100%" }} transition={{ duration: 1.2, ease: "easeInOut" }}
                className="h-full bg-gradient-to-r from-orange-500 to-teal-400 rounded-full"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {!isLoading && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }} className="flex flex-col min-h-screen relative">
          <Navbar isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />
          <main className="flex-grow">
            <Hero onViewProjects={handleViewProjects} onContactMe={handleContactMe} onDownloadCV={() => setIsCVOpen(true)} />
            <About />
            <Experience />
            <Skills />
            <Projects />
            <Education />
            <Certifications />
            <Contact />
          </main>
          <Footer />
          <ResumeModal isOpen={isCVOpen} onClose={() => setIsCVOpen(false)} />
          <FloatingContact onOpenCV={() => setIsCVOpen(true)} />
        </motion.div>
      )}
    </div>
  );

  return (
    <Router>
      <Routes>
        <Route path="/" element={<PortfolioMain />} />
        <Route path="/humed-berbagi" element={<HumedBerbagi />} />
        <Route path="/humed-berbagi/finance" element={<FinanceGate><FinanceApp /></FinanceGate>} /> 
        <Route path="/humed-berbagi/payroll" element={<PayrollApp />} />
        <Route path="/humed-berbagi/cv-generator" element={<CVApp />} />
        <Route path="/bacain" element={<Bacain />} />
      </Routes>
    </Router>
  );
}
