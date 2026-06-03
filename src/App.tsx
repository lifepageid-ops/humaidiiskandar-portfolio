import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import FinanceApp from './modules/finance/src/App'; 
import PayrollApp from './modules/payroll/src/App'; 

const Home = () => (
  <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6 text-center">
    <h1 className="text-4xl font-extrabold text-gray-900 mb-4">Humaidi Iskandar</h1>
    <p className="text-lg text-gray-600 mb-8 max-w-2xl">
      Strategic Partnership & Program Management Professional. Selamat datang di portofolio digital saya.
    </p>
    <Link to="/humed-berbagi" className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold shadow-md hover:bg-blue-700 transition">
      Masuk ke Humed Berbagi
    </Link>
  </div>
);

const HumedBerbagi = () => (
  <div className="min-h-screen bg-gray-50 flex flex-col items-center pt-20 p-6 text-center">
    <h1 className="text-3xl font-bold text-gray-900 mb-4">Humed Berbagi</h1>
    <p className="text-gray-600 mb-10 max-w-lg">
      Kumpulan tools dan simulasi aplikasi yang bermanfaat untuk kebutuhan finansial dan produktivitas Anda.
    </p>
    
    <div className="flex flex-col sm:flex-row justify-center gap-4 mb-12">
      <Link to="/humed-berbagi/finance" className="bg-emerald-500 text-white px-6 py-4 rounded-xl font-semibold shadow-lg hover:bg-emerald-600 transition">
        Aplikasi Pencatatan Keuangan
      </Link>
      <Link to="/humed-berbagi/payroll" className="bg-teal-600 text-white px-6 py-4 rounded-xl font-semibold shadow-lg hover:bg-teal-700 transition">
        Aplikasi Payroll & PPh 21 (TER)
      </Link>
    </div>

    <Link to="/" className="text-blue-500 hover:underline font-medium">
      &larr; Kembali ke Profil Utama
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
      </Routes>
    </Router>
  );
}
