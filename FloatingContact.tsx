import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, X, Phone, Mail, FileText } from "lucide-react";

interface FloatingContactProps {
  onOpenCV: () => void;
}

export default function FloatingContact({ onOpenCV }: FloatingContactProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-40 print:hidden flex flex-col items-end gap-2 sm:gap-3">
      {/* Contact Options */}
      <AnimatePresence>
        {isOpen && (
          <div className="flex flex-col items-end gap-3 mb-2">
            {/* WhatsApp Call */}
            <motion.a
              href="https://wa.me/6285717306163"
              target="_blank"
              rel="noreferrer"
              initial={{ opacity: 0, scale: 0.8, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 10 }}
              className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-emerald-550 text-white shadow-lg hover:bg-emerald-650 transition-colors group"
            >
              <span className="text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                WhatsApp
              </span>
              <div className="p-1 rounded-full bg-white/15">
                <Phone className="w-4 h-4 fill-current" />
              </div>
            </motion.a>

            {/* Email */}
            <motion.a
              href="mailto:humaidicreativelabs@gmail.com"
              initial={{ opacity: 0, scale: 0.8, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 10 }}
              className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-orange-500 text-white shadow-lg hover:bg-orange-600 transition-colors group"
            >
              <span className="text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                Email Me
              </span>
              <div className="p-1 rounded-full bg-white/15">
                <Mail className="w-4 h-4" />
              </div>
            </motion.a>

            {/* View/Print CV */}
            <motion.button
              onClick={() => {
                onOpenCV();
                setIsOpen(false);
              }}
              initial={{ opacity: 0, scale: 0.8, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 10 }}
              className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-teal-550 text-white shadow-lg hover:bg-teal-650 transition-colors group cursor-pointer"
            >
              <span className="text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                Print/Save CV
              </span>
              <div className="p-1 rounded-full bg-white/15">
                <FileText className="w-4 h-4" />
              </div>
            </motion.button>
          </div>
        )}
      </AnimatePresence>

      {/* Main FAB Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`relative flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-full shadow-2xl text-white overflow-hidden transition-all duration-300 transform active:scale-95 touch-manipulation ${
          isOpen ? "bg-slate-800 dark:bg-slate-700 rotate-90" : "bg-gradient-to-tr from-orange-500 to-teal-500"
        }`}
        aria-label={isOpen ? "Close contact menu" : "Open contact menu"}
      >
        {/* Pulse Glow when closed */}
        {!isOpen && (
          <span className="absolute inset-0 bg-teal-500 rounded-full animate-ping opacity-25 pointer-events-none" />
        )}
        {isOpen ? <X className="w-5 h-5 sm:w-6 sm:h-6" /> : <MessageSquare className="w-5 h-5 sm:w-6 sm:h-6" />}
      </button>
    </div>
  );
}