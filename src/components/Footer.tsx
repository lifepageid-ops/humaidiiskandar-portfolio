import { Sparkles, ArrowUp } from "lucide-react";

export default function Footer() {
  const handleBackToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-900 text-slate-300 py-12 relative overflow-hidden border-t border-slate-800">
      {/* Radial highlight blur */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[400px] h-[150px] bg-teal-500/10 rounded-full blur-[80px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col items-center text-center space-y-6">
          
          {/* Branding */}
          <div className="flex items-center space-x-2">
            <div className="relative flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-orange-500 to-teal-500 p-[2px]">
              <div className="flex items-center justify-center w-full h-full bg-slate-900 rounded-[9px]">
                <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-teal-500 text-sm">
                  HI
                </span>
              </div>
            </div>
            <span className="font-extrabold text-white tracking-tight text-lg">
              Humaidi Iskandar
            </span>
          </div>

          {/* Tagline */}
          <p className="max-w-xl text-xs sm:text-sm text-slate-400 leading-relaxed font-semibold italic flex items-center justify-center gap-1">
            <Sparkles className="w-4 h-4 text-orange-400 shrink-0" />
            &ldquo;Building Sustainable Impact Through Community, Strategy, and Human Capital Development.&rdquo;
          </p>

          {/* Social Media */}
          <div className="flex space-x-4">
            <a
              href="https://www.linkedin.com/in/humaidiiskandar"
              target="_blank"
              rel="noreferrer"
              className="p-2 rounded-xl bg-slate-800 hover:bg-blue-600 hover:text-white border border-slate-700 text-slate-400 transition-all duration-200 shadow-sm"
              title="LinkedIn"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
              </svg>
            </a>
            <a
              href="mailto:humaidicreativelabs@gmail.com"
              className="p-2 rounded-xl bg-slate-800 hover:bg-orange-500 hover:text-white border border-slate-700 text-slate-400 transition-all duration-200 shadow-sm"
              title="Email"
            >
              <svg className="w-4 h-4 fill-none stroke-current" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
                <rect width="20" height="16" x="2" y="4" rx="2" />
                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
              </svg>
            </a>
            <a
              href="https://wa.me/6285717306163"
              target="_blank"
              rel="noreferrer"
              className="p-2 rounded-xl bg-slate-800 hover:bg-green-600 hover:text-white border border-slate-700 text-slate-400 transition-all duration-200 shadow-sm"
              title="WhatsApp"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.513 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.739-1.456L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.42 9.864-9.864.002-2.637-1.023-5.117-2.886-6.981-1.862-1.865-4.339-2.891-6.98-2.892-5.445 0-9.866 4.421-9.87 9.867-.001 1.84.504 3.636 1.46 5.219l-.96 3.512 3.547-.93zm11.303-7.467c-.328-.164-1.94-.959-2.242-1.07-.301-.109-.522-.164-.74.164-.219.328-.848 1.07-.104 1.158.219.273.546.546.874.546h.079c.301 0 .522-.109.63-.273.11-.164.6-.984.738-1.257.137-.273.137-.52-.027-.684z" />
              </svg>
            </a>
          </div>

          {/* Links */}
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-xs font-semibold text-slate-400">
            <a href="#about" className="hover:text-teal-400 transition-colors">About</a>
            <a href="#experience" className="hover:text-teal-400 transition-colors">Experience</a>
            <a href="#skills" className="hover:text-teal-400 transition-colors">Skills</a>
            <a href="#projects" className="hover:text-teal-400 transition-colors">Projects</a>
            <a href="#education" className="hover:text-teal-400 transition-colors">Education</a>
            <a href="#certifications" className="hover:text-teal-400 transition-colors">Certifications</a>
            <a href="#contact" className="hover:text-teal-400 transition-colors">Contact</a>
          </div>

          {/* Bottom Copy and Back to top */}
          <div className="w-full pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-[11px] text-slate-500 font-medium">
              &copy; {currentYear} Humaidi Iskandar. All Rights Reserved.
            </p>
            
            <button
              onClick={handleBackToTop}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 hover:text-white text-xs font-bold shadow-md cursor-pointer group transition-all"
            >
              Back to Top
              <ArrowUp className="w-3.5 h-3.5 group-hover:-translate-y-0.5 transition-transform" />
            </button>
          </div>

        </div>
      </div>
    </footer>
  );
}