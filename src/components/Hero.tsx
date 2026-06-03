import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Download, Sparkles, ShieldCheck, Award } from "lucide-react";

interface HeroProps {
  onViewProjects: () => void;
  onContactMe: () => void;
  onDownloadCV: () => void;
}

const headlines = [
  "Community Development & Human Capital Professional",
  "CSR, Sustainability & Human Capital Specialist",
  "Community Empowerment & Organizational Development Professional",
  "Strategic Partnership & Human Capital Enthusiast",
];

export default function Hero({ onViewProjects, onContactMe, onDownloadCV }: HeroProps) {
  const [currentHeadlineIndex, setCurrentHeadlineIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentHeadlineIndex((prev) => (prev + 1) % headlines.length);
    }, 4005);
    return () => clearInterval(interval);
  }, []);

  return (
    <section
      id="hero"
      className="relative min-h-[100dvh] flex items-center pt-24 sm:pt-28 pb-12 sm:pb-16 overflow-hidden bg-slate-50 dark:bg-slate-950 transition-colors duration-300"
    >
      {/* Premium Glow & Gradient Moving Shapes */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        {/* Dynamic soft gradient mesh */}
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-gradient-to-br from-orange-500/10 via-orange-500/5 to-transparent blur-[120px] animate-pulse duration-[6000ms]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full bg-gradient-to-tr from-teal-500/10 via-teal-500/5 to-transparent blur-[150px] animate-pulse duration-[8000ms]" />
        <div className="absolute top-[30%] right-[15%] w-[25%] h-[25%] rounded-full bg-gradient-to-br from-orange-400/5 via-teal-400/5 to-transparent blur-[80px] animate-bounce duration-[12000ms]" />

        {/* Decorative Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-[0.35] dark:opacity-[0.15]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Hero Text (7 Cols on large screens) */}
          <div className="lg:col-span-7 flex flex-col space-y-6 text-left">
            {/* Welcome Accent Badge */}
            <div className="inline-flex items-center self-start space-x-2 px-3 py-1.5 rounded-full bg-teal-50 dark:bg-teal-950/50 border border-teal-200/50 dark:border-teal-800/50 shadow-sm backdrop-blur-sm">
              <div className="relative">
                <div className="absolute inset-0 bg-orange-500/20 rounded-full animate-ping" />
                <svg className="w-4 h-4 text-orange-500 relative z-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                </svg>
              </div>
              <span className="text-xs font-semibold text-slate-800 dark:text-teal-300 tracking-wide">
                Welcome to My Portfolio
              </span>
            </div>

            {/* Main Headings */}
            <div className="space-y-3">
              <h1 className="text-[2.5rem] leading-[1.1] sm:text-5xl lg:text-6xl xl:text-7xl font-extrabold tracking-tight text-slate-950 dark:text-white">
                Humaidi Iskandar
              </h1>

              {/* Rotating Headline with Framer Motion */}
              <div className="h-[60px] sm:h-[72px] md:h-[80px] lg:h-[96px] flex items-center">
                <AnimatePresence mode="wait">
                  <motion.h2
                    key={currentHeadlineIndex}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    transition={{ duration: 0.5, ease: "easeInOut" }}
                    className="text-lg leading-snug sm:text-xl md:text-2xl lg:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-500 via-teal-500 to-teal-600"
                  >
                    {headlines[currentHeadlineIndex]}
                  </motion.h2>
                </AnimatePresence>
              </div>
            </div>

            {/* Subheadline */}
            <p className="text-slate-600 dark:text-slate-300 text-base sm:text-lg leading-relaxed font-normal max-w-2xl">
              Master’s Degree graduate in Human Resource Management with expertise in CSR programs, community empowerment, organizational culture development, strategic partnerships, public speaking, and data-driven program management.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col xs:flex-row xs:flex-wrap sm:flex-nowrap items-stretch gap-3 sm:gap-4 pt-2 sm:pt-4">
              <button
                onClick={onDownloadCV}
                className="relative group w-full xs:w-auto px-6 sm:px-7 py-3.5 sm:py-4 rounded-2xl font-bold text-sm sm:text-base tracking-wide text-white shadow-xl shadow-orange-500/15 overflow-hidden transition-all duration-300 hover:shadow-orange-500/25 active:scale-[0.98] touch-manipulation min-h-[48px]"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-orange-500 to-orange-600 transition-transform duration-300 group-hover:scale-105" />
                <span className="relative flex items-center justify-center gap-2">
                  <Download className="w-4 h-4 sm:w-5 sm:h-5" /> Download CV
                </span>
              </button>

              <button
                onClick={onViewProjects}
                className="w-full xs:w-auto px-6 sm:px-7 py-3.5 sm:py-4 rounded-2xl font-bold text-sm sm:text-base tracking-wide text-slate-800 dark:text-slate-200 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800/80 shadow-md transition-all duration-300 active:scale-[0.98] touch-manipulation min-h-[48px]"
              >
                View Portfolio
              </button>

              <button
                onClick={onContactMe}
                className="w-full xs:w-auto px-6 sm:px-7 py-3.5 sm:py-4 rounded-2xl font-bold text-sm sm:text-base tracking-wide text-slate-800 dark:text-slate-200 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-teal-500 hover:text-teal-600 dark:hover:border-teal-500 dark:hover:text-teal-400 shadow-md transition-all duration-300 active:scale-[0.98] touch-manipulation min-h-[48px]"
              >
                Contact Me
              </button>
            </div>

            {/* Quick Contact Icons */}
            <div className="flex items-center space-x-4 pt-6 border-t border-slate-200/60 dark:border-slate-800/60">
              <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                Connect directly:
              </span>
              <div className="flex space-x-2">
                <a
                  href="https://www.linkedin.com/in/humaidiiskandar"
                  target="_blank"
                  rel="noreferrer"
                  className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 hover:scale-105 transition-all duration-200 shadow-sm"
                  title="LinkedIn"
                >
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                  </svg>
                </a>
                <a
                  href="mailto:humaidicreativelabs@gmail.com"
                  className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:text-orange-500 dark:hover:text-orange-400 hover:scale-105 transition-all duration-200 shadow-sm"
                  title="Email"
                >
                  <svg className="w-5 h-5 fill-none stroke-current" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
                    <rect width="20" height="16" x="2" y="4" rx="2" />
                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                  </svg>
                </a>
                <a
                  href="https://wa.me/6285717306163"
                  target="_blank"
                  rel="noreferrer"
                  className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:text-green-600 dark:hover:text-green-400 hover:scale-105 transition-all duration-200 shadow-sm"
                  title="WhatsApp"
                >
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.513 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.739-1.456L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.42 9.864-9.864.002-2.637-1.023-5.117-2.886-6.981-1.862-1.865-4.339-2.891-6.98-2.892-5.445 0-9.866 4.421-9.87 9.867-.001 1.84.504 3.636 1.46 5.219l-.96 3.512 3.547-.93zm11.303-7.467c-.328-.164-1.94-.959-2.242-1.07-.301-.109-.522-.164-.74.164-.219.328-.848 1.07-.104 1.158.219.273.546.546.874.546h.079c.301 0 .522-.109.63-.273.11-.164.6-.984.738-1.257.137-.273.137-.52-.027-.684z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>

          {/* Right Hero Photo (5 Cols on large screens) */}
          <div className="lg:col-span-5 flex justify-center items-center relative mt-12 lg:mt-0 px-4 sm:px-0">
            <div className="relative w-full max-w-[300px] xs:max-w-[340px] sm:max-w-[400px] lg:max-w-full">
              
              {/* Glow backdrop */}
              <div className="absolute -inset-4 bg-gradient-to-tr from-orange-500 to-teal-500 rounded-3xl blur-2xl opacity-20 dark:opacity-30 animate-pulse duration-[4000ms]" />

              {/* Elegant floating cards in background - hidden on very small mobile to reduce clutter */}
              <div className="absolute -top-4 -left-4 sm:-top-6 sm:-left-6 bg-white/95 dark:bg-slate-900/95 border border-slate-200/50 dark:border-slate-800/50 rounded-xl sm:rounded-2xl p-2 sm:p-3 shadow-xl backdrop-blur-sm flex items-center gap-2 sm:gap-3 animate-bounce duration-[6000ms] z-20">
                <div className="p-2 bg-teal-50 dark:bg-teal-950/50 rounded-lg text-teal-600 dark:text-teal-400">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider leading-none">Certified</p>
                  <p className="text-xs font-bold text-slate-800 dark:text-slate-200">Human Capital BNSP</p>
                </div>
              </div>

              <div className="absolute -bottom-4 -right-6 bg-white/90 dark:bg-slate-900/90 border border-slate-200/50 dark:border-slate-800/50 rounded-2xl p-3.5 shadow-xl backdrop-blur-sm flex items-center gap-3 animate-bounce duration-[8000ms] z-20">
                <div className="p-2 bg-orange-50 dark:bg-orange-950/50 rounded-lg text-orange-500">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider leading-none">Academic Excellence</p>
                  <p className="text-xs font-bold text-slate-800 dark:text-slate-200">M.M. Human Resources</p>
                </div>
              </div>

              {/* Out-of-shape Asymmetrical Portrait Container */}
              <div className="relative bg-gradient-to-tr from-orange-500 via-slate-300 to-teal-500 rounded-[40px] rounded-tr-[100px] rounded-bl-[100px] p-[6px] overflow-hidden shadow-2xl transform hover:rotate-1 hover:scale-[1.02] transition-all duration-500">
                <div className="bg-slate-900 rounded-[34px] rounded-tr-[94px] rounded-bl-[94px] overflow-hidden relative aspect-[4/5] group">
                  {/* Outer Glowing Ring Hover */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-70 z-10" />
                  
                  {/* High Quality Image */}
                  <img
                    src="/images/humaidi.png"
                    alt="Humaidi Iskandar Portrait"
                    className="w-full h-full object-cover object-center transform group-hover:scale-105 transition-transform duration-700 relative z-0"
                    onError={(e) => {
                      // Fallback if image isn't generated/loaded yet
                      e.currentTarget.src = "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=600&auto=format&fit=crop";
                    }}
                  />

                  {/* Overlaying Accent Gradients */}
                  <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent z-20">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-bold text-white">Humaidi Iskandar</h3>
                        <p className="text-xs text-teal-300 font-medium">CSR & HC Expert</p>
                      </div>
                      <div className="h-8 w-8 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/10">
                        <Sparkles className="w-4 h-4 text-orange-400" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Animated Statistics Grid */}
        <div className="mt-12 sm:mt-16 lg:mt-20 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 lg:gap-6 bg-white/70 dark:bg-slate-900/50 border border-slate-200/50 dark:border-slate-800/50 rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 backdrop-blur-md shadow-xl shadow-slate-900/5 dark:shadow-black/10">
          <div className="flex flex-col items-center text-center p-2 sm:p-3 lg:border-r border-slate-200/50 dark:border-slate-800/50">
            <span className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-slate-900 dark:text-white">
              4+
            </span>
            <span className="text-[10px] sm:text-xs font-bold text-slate-500 dark:text-slate-400 tracking-wider uppercase mt-1 leading-tight">
              Years Experience
            </span>
          </div>
          <div className="flex flex-col items-center text-center p-2 sm:p-3 lg:border-r border-slate-200/50 dark:border-slate-800/50">
            <span className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-black tracking-tight text-orange-500">
              B2B
            </span>
            <span className="text-[10px] sm:text-xs font-bold text-slate-500 dark:text-slate-400 tracking-wider uppercase mt-1 leading-tight">
              Corporate Partners
            </span>
          </div>
          <div className="flex flex-col items-center text-center p-2 sm:p-3 lg:border-r border-slate-200/50 dark:border-slate-800/50">
            <span className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-teal-500">
              Rp420B
            </span>
            <span className="text-[10px] sm:text-xs font-bold text-slate-500 dark:text-slate-400 tracking-wider uppercase mt-1 leading-tight">
              Fundraising
            </span>
          </div>
          <div className="flex flex-col items-center text-center p-2 sm:p-3 lg:border-r border-slate-200/50 dark:border-slate-800/50">
            <span className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-slate-900 dark:text-white">
              15+
            </span>
            <span className="text-[10px] sm:text-xs font-bold text-slate-500 dark:text-slate-400 tracking-wider uppercase mt-1 leading-tight">
              Projects
            </span>
          </div>
          <div className="flex flex-col items-center text-center p-2 sm:p-3 col-span-2 sm:col-span-3 lg:col-span-1">
            <span className="text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-teal-500">
              Hybrid
            </span>
            <span className="text-[10px] sm:text-xs font-bold text-slate-500 dark:text-slate-400 tracking-wider uppercase mt-1 leading-tight">
              HC & CSR Expert
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}