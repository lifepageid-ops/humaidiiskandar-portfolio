import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { BookOpen, LayoutGrid, Calculator, Landmark, ArrowRight, GraduationCap, Building2 } from 'lucide-react';
import { motion } from 'framer-motion';
import FinanceApp from './modules/finance/src/App'; 
import PayrollApp from './modules/payroll/src/App'; 

// --- Konfigurasi Animasi ---
const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.2 } }
};

const Home = () => (
  <div className="min-h-screen bg-slate-50 flex flex-col font-sans overflow-hidden relative">
    {/* Background Efek Abstrak */}
    <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-teal-300 rounded-full mix-blend-multiply filter blur-[100px] opacity-40 animate-blob"></div>
    <div className="absolute top-[20%] right-[-10%] w-[40%] h-[40%] bg-orange-300 rounded-full mix-blend-multiply filter blur-[100px] opacity-40 animate-blob animation-delay-2000"></div>

    <main className="flex-grow flex flex-col items-center pt-24 p-6 relative z-10">
      {/* Header Section */}
      <motion.div 
        className="max-w-4xl w-full text-center mb-16"
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
      >
        <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 mb-6 px-5 py-2 rounded-full bg-white/80 backdrop-blur-sm border border-slate-200 text-teal-700 font-semibold text-sm shadow-sm">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-teal-500"></span>
          </span>
          Portofolio Digital Aktif
        </motion.div>
        
        <motion.h1 variants={fadeInUp} className="text-5xl md:text-7xl font-extrabold text-slate-800 mb-6 tracking-tight leading-tight">
          Humaidi Iskandar
        </motion.h1>
        
        <motion.p variants={fadeInUp} className="text-slate-600 text-xl md:text-2xl max-w-2xl mx-auto leading-relaxed mb-8">
          Menghadirkan solusi strategis dan alat bantu produktivitas yang efisien, modern, dan tepat sasaran.
        </motion.p>

        {/* Badges Profesional */}
        <motion.div variants={fadeInUp} className="flex flex-wrap justify-center gap-3 mb-10">
          <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg border border-slate-200 shadow-sm text-slate-600 text-sm font-medium">
            <GraduationCap className="w-4 h-4 text-teal-600" /> Magister Manajemen SDM
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg border border-slate-200 shadow-sm text-slate-600 text-sm font-medium">
            <Building2 className="w-4 h-4 text-orange-500" /> Banking & Social Finance
          </div>
        </motion.div>
      </motion.div>
      
      {/* Main Menu Cards Container */}
      <motion.div 
        className="grid md:grid-cols-2 gap-8 w-full max-w-5xl mb-20"
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
      >
        {/* Card 1: Humed Berbagi */}
        <motion.div variants={fadeInUp} className="h-full">
          <Link to="/humed-berbagi" className="group bg-white/70 backdrop-blur-md rounded-3xl p-8 md:p-10 shadow-lg hover:shadow-2xl border border-white/50 transition-all duration-500 hover:-translate-y-2 relative overflow-hidden flex flex-col h-full">
            <div className="absolute inset-0 bg-gradient-to-br from-teal-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative z-10">
              <div className="w-16 h-16 bg-gradient-to-br from-teal-400 to-teal-600 rounded-2xl flex items-center justify-center mb-8 shadow-md group-hover:scale-110 transition-transform duration-500">
                <LayoutGrid className="text-white w-8 h-8" />
              </div>
              <h2 className="text-3xl font-bold text-slate-800 mb-4">Humed Berbagi</h2>
              <p className="text-slate-600 mb-8 leading-relaxed text-lg flex-grow">
                Kumpulan ekosistem tools, kalkulator, dan simulasi sistem otomatisasi yang dirancang untuk kebutuhan tata kelola finansial dan manajemen kompensasi.
              </p>
              <div className="inline-flex items-center px-6 py-3 bg-slate-900 text-white rounded-full font-medium group-hover:bg-teal-600 transition-colors">
                Masuk ke Direktori 
                <ArrowRight className="ml-2 w-5 h-5 transform group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </Link>
        </motion.div>

        {/* Card 2: Bacain */}
        <motion.div variants={fadeInUp} className="h-full">
          <Link to="/bacain" className="group bg-white/70 backdrop-blur-md rounded-3xl p-8 md:p-10 shadow-lg hover:shadow-2xl border border-white/50 transition-all duration-500 hover:-translate-y-2 relative overflow-hidden flex flex-col h-full">
            <div className="absolute inset-0 bg-gradient-to-br from-orange-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative z-10">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-orange-600 rounded-2xl flex items-center justify-center mb-8 shadow-md group-hover:scale-110 transition-transform duration-500">
                <BookOpen className="text-white w-8 h-8" />
              </div>
              <h2 className="text-3xl font-bold text-slate-800 mb-4">Bacain</h2>
              <p className="text-slate-600 mb-8 leading-relaxed text-lg flex-grow">
                Ruang wawasan dan literasi digital. Kumpulan analisis, catatan strategis, dan praktik terbaik dalam pengembangan kapasitas serta organisasi.
              </p>
              <div className="inline-flex items-center px-6 py-3 bg-slate-900 text-white rounded-full font-medium group-hover:bg-orange-500 transition-colors">
                Mulai Membaca 
                <ArrowRight className="ml-2 w-5 h-5 transform group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </Link>
        </motion.div>
      </motion.div>
    </main>

    {/* Footer Minimalis */}
    <footer className="w-full text-center py-8 text-slate-500 text-sm border-t border-slate-200/60 bg-white/50 backdrop-blur-sm relative z-10">
      <p>© {new Date().getFullYear()} Humaidi Iskandar. Dirancang dengan presisi & fungsionalitas.</p>
    </footer>
  </div>
);

const HumedBerbagi = () => (
  <div className="min-h-screen bg-slate-50 flex flex-col items-center pt-24 p-6 font-sans">
    <motion.div 
      initial={{ opacity: 0, y: -20 }} 
      animate={{ opacity: 1, y: 0 }} 
      className="max-w-4xl w-full text-center mb-16"
    >
      <h1 className="text-4xl md:text-5xl font-extrabold text-slate-800 mb-6 tracking-tight">Humed Berbagi</h1>
      <p className="text-slate-600 text-lg max-w-2xl mx-auto">Sistem cerdas untuk mendukung akurasi dan produktivitas Anda.</p>
    </motion.div>
    
    <motion.div 
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="grid md:grid-cols-2 gap-6 w-full max-w-4xl mb-16"
    >
      <motion.div variants={fadeInUp}>
        <Link to="/humed-berbagi/finance" className="bg-white rounded-2xl p-8 shadow-md hover:shadow-xl border border-slate-100 flex items-start gap-6 transition-all hover:border-teal-300 hover:-translate-y-1">
          <div className="p-4 bg-teal-50 rounded-2xl">
            <Landmark className="text-teal-600 w-8 h-8" />
          </div>
          <div className="text-left">
            <h3 className="font-bold text-slate-800 text-xl mb-2">Pencatatan Keuangan</h3>
            <p className="text-slate-500 leading-relaxed">Sistem pelacakan dan visualisasi arus kas untuk memantau kesehatan finansial secara riil.</p>
          </div>
        </Link>
      </motion.div>

      <motion.div variants={fadeInUp}>
        <Link to="/humed-berbagi/payroll" className="bg-white rounded-2xl p-8 shadow-md hover:shadow-xl border border-slate-100 flex items-start gap-6 transition-all hover:border-orange-300 hover:-translate-y-1">
          <div className="p-4 bg-orange-50 rounded-2xl">
            <Calculator className="text-orange-500 w-8 h-8" />
          </div>
          <div className="text-left">
            <h3 className="font-bold text-slate-800 text-xl mb-2">Sistem Payroll (TER)</h3>
            <p className="text-slate-500 leading-relaxed">Kalkulator otomatisasi penggajian karyawan terintegrasi dengan regulasi perpajakan terbaru.</p>
          </div>
        </Link>
      </motion.div>
    </motion.div>

    <Link to="/" className="text-slate-500 hover:text-teal-600 font-medium transition-colors flex items-center px-6 py-3 bg-white rounded-full shadow-sm border border-slate-200">
      ← Kembali ke Beranda Utama
    </Link>
  </div>
);

// Placeholder Bacain
const Bacain = () => (
  <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-center font-sans">
    <BookOpen className="w-20 h-20 text-orange-400 mb-8 animate-bounce" />
    <h1 className="text-4xl font-bold text-slate-800 mb-4">Modul Bacain</h1>
    <p className="text-slate-600 text-lg mb-10 max-w-md leading-relaxed">Ruang literasi ini sedang disiapkan. Segera hadir untuk memberikan wawasan mendalam bagi Anda.</p>
    <Link to="/" className="px-8 py-4 bg-slate-900 text-white rounded-full hover:bg-slate-800 transition-colors shadow-lg font-medium">
      Kembali ke Beranda
    </Link>
  </div>
);

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/humed-berbagi" element={<HumedBerbagi />} />
        <Route path="/humed-berbagi/finance" element={<FinanceApp />} />
        <Route path="/humed-berbagi/payroll" element={<PayrollApp />} />
        <Route path="/bacain" element={<Bacain />} />
      </Routes>
    </Router>
  );
}
