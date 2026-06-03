import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Briefcase, BookOpen, LayoutGrid, Calculator, Landmark, ArrowRight } from 'lucide-react';
import FinanceApp from './modules/finance/src/App'; 
import PayrollApp from './modules/payroll/src/App'; 

const Home = () => (
  <div className="min-h-screen bg-slate-50 flex flex-col items-center pt-20 p-6 font-sans">
    {/* Header Section */}
    <div className="max-w-4xl w-full text-center mb-16 relative">
      <div className="inline-block mb-4 px-4 py-1.5 rounded-full bg-teal-50 border border-teal-100 text-teal-700 font-semibold text-sm tracking-wide">
        Portofolio Digital
      </div>
      <h1 className="text-4xl md:text-6xl font-extrabold text-slate-800 mb-6 tracking-tight">
        Humaidi Iskandar
      </h1>
      <p className="text-slate-600 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
        Community Development & Human Capital Professional. Menghadirkan solusi dan alat bantu produktivitas yang efisien.
      </p>
    </div>
    
    {/* Main Menu Cards Container */}
    <div className="grid md:grid-cols-2 gap-8 w-full max-w-4xl mb-16">
      
      {/* Menu 1: Humed Berbagi */}
      <Link to="/humed-berbagi" className="group bg-white rounded-3xl p-8 shadow-sm hover:shadow-xl border border-slate-100 transition-all duration-300 hover:-translate-y-1 relative overflow-hidden flex flex-col h-full">
        <div className="absolute top-0 left-0 w-full h-1.5 bg-teal-500 transition-all duration-300 group-hover:h-2"></div>
        <div className="w-14 h-14 bg-teal-50 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
          <LayoutGrid className="text-teal-600 w-7 h-7" />
        </div>
        <h2 className="text-2xl font-bold text-slate-800 mb-3">Humed Berbagi</h2>
        <p className="text-slate-600 mb-8 leading-relaxed flex-grow">
          Kumpulan tools, kalkulator, dan simulasi sistem yang dirancang untuk kebutuhan finansial dan manajemen SDM.
        </p>
        <div className="flex items-center text-teal-600 font-bold group-hover:text-teal-700">
          Masuk ke Direktori 
          <ArrowRight className="ml-2 w-5 h-5 transform group-hover:translate-x-1 transition-transform" />
        </div>
      </Link>

      {/* Menu 2: Bacain */}
      <Link to="/bacain" className="group bg-white rounded-3xl p-8 shadow-sm hover:shadow-xl border border-slate-100 transition-all duration-300 hover:-translate-y-1 relative overflow-hidden flex flex-col h-full">
        <div className="absolute top-0 left-0 w-full h-1.5 bg-orange-400 transition-all duration-300 group-hover:h-2"></div>
        <div className="w-14 h-14 bg-orange-50 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
          <BookOpen className="text-orange-500 w-7 h-7" />
        </div>
        <h2 className="text-2xl font-bold text-slate-800 mb-3">Bacain</h2>
        <p className="text-slate-600 mb-8 leading-relaxed flex-grow">
          Ruang baca dan literasi digital. Kumpulan artikel, ulasan, dan catatan pengembangan komunitas.
        </p>
        <div className="flex items-center text-orange-500 font-bold group-hover:text-orange-600">
          Buka Bacain 
          <ArrowRight className="ml-2 w-5 h-5 transform group-hover:translate-x-1 transition-transform" />
        </div>
      </Link>

    </div>
  </div>
);

const HumedBerbagi = () => (
  <div className="min-h-screen bg-slate-50 flex flex-col items-center pt-16 md:pt-24 p-6 font-sans">
    <div className="max-w-4xl w-full text-center mb-12">
      <h1 className="text-4xl md:text-5xl font-extrabold text-slate-800 mb-4 tracking-tight">Humed Berbagi</h1>
      <p className="text-slate-600 text-lg max-w-2xl mx-auto">Pilih aplikasi simulasi yang ingin Anda gunakan.</p>
    </div>
    
    <div className="grid md:grid-cols-2 gap-6 w-full max-w-3xl mb-12">
      <Link to="/humed-berbagi/finance" className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md border border-slate-100 flex items-center gap-4 transition-all hover:border-teal-300">
        <div className="p-3 bg-teal-50 rounded-xl">
          <Landmark className="text-teal-600 w-6 h-6" />
        </div>
        <div className="text-left">
          <h3 className="font-bold text-slate-800 text-lg">Pencatatan Keuangan</h3>
          <p className="text-slate-500 text-sm">Dashboard & Tracker</p>
        </div>
      </Link>

      <Link to="/humed-berbagi/payroll" className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md border border-slate-100 flex items-center gap-4 transition-all hover:border-orange-300">
        <div className="p-3 bg-orange-50 rounded-xl">
          <Calculator className="text-orange-500 w-6 h-6" />
        </div>
        <div className="text-left">
          <h3 className="font-bold text-slate-800 text-lg">Sistem Payroll (TER)</h3>
          <p className="text-slate-500 text-sm">Kalkulator PPh 21</p>
        </div>
      </Link>
    </div>

    <Link to="/" className="text-slate-500 hover:text-teal-600 font-medium transition-colors flex items-center">
      ← Kembali ke Beranda Utama
    </Link>
  </div>
);

// Placeholder untuk menu Bacain
const Bacain = () => (
  <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-center font-sans">
    <BookOpen className="w-16 h-16 text-orange-400 mb-6" />
    <h1 className="text-3xl font-bold text-slate-800 mb-4">Modul Bacain</h1>
    <p className="text-slate-600 mb-8 max-w-md">Fitur ini sedang dalam tahap pengembangan. Segera hadir untuk pengalaman literasi digital Anda.</p>
    <Link to="/" className="px-6 py-2.5 bg-white border border-slate-200 text-slate-600 rounded-full hover:bg-slate-50 hover:text-orange-500 transition-colors">
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
