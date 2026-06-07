import React, { useState, useEffect } from 'react';
import { FinanceProvider, useFinance } from './context/FinanceContext';
import { MobileFrame } from './components/MobileFrame';
import { BottomNav } from './components/BottomNav';
import { ConceptDocumentation } from './components/ConceptDocumentation';
import { motion } from 'framer-motion'; // Animasi Premium

// Screens
import { HomeScreen } from './components/screens/HomeScreen';
import { ExpenseScreen } from './components/screens/ExpenseScreen';
import { WalletsScreen } from './components/screens/WalletsScreen';
import { SubscriptionsScreen } from './components/screens/SubscriptionsScreen';
import { DebtScreen } from './components/screens/DebtScreen';
import { HealthScreen } from './components/screens/HealthScreen';
import { ImpulsiveAssistantScreen } from './components/screens/ImpulsiveAssistantScreen';
import { GoalsScreen } from './components/screens/GoalsScreen';
import { ForecastScreen } from './components/screens/ForecastScreen';
import { MoodScreen } from './components/screens/MoodScreen';
import { AIChatScreen } from './components/screens/AIChatScreen';
import { GamificationScreen } from './components/screens/GamificationScreen';
import { PrivacyScreen } from './components/screens/PrivacyScreen';
import { BudgetScreen } from './components/screens/BudgetScreen';
import { AssetsScreen } from './components/screens/AssetsScreen';
import { ReportScreen } from './components/screens/ReportScreen';
import { OnboardingFlow } from './components/screens/OnboardingFlow';

import { 
  Sparkles, 
  RotateCcw, 
  Smartphone, 
  FileText, 
  ChevronLeft,
  CheckCircle2,
  ShieldAlert,
  Target,
  Tv,
  CreditCard,
  TrendingUp,
  Info,
  PieChart,
  WalletCards,
  Smile,
  RefreshCw
} from 'lucide-react';

// ========================================================
// 🕌 SCREEN: ZAKAT & SHARIA SENTINEL (KONEKSI LIVE CONTEXT DATA)
// ========================================================
interface ZakatScreenProps {
  liveWallets: any[];
  liveAssets: any[];
  liveUser: any;
}

const ZakatSentinelScreen: React.FC<ZakatScreenProps> = ({ liveWallets, liveAssets, liveUser }) => {
  const [zakatMode, setZakatMode] = useState<'maal' | 'profesi'>('maal');
  const [hargaEmas, setHargaEmas] = useState(1450000); 

  // 🔄 EKSTRAKSI DATA ASLI DARI HUMEDLY CONTEXT
  // 1. Hitung total saldo semua dompet tunai/bank yang bukan utang/paylater
  const realWalletBalance = liveWallets
    .filter(w => w.type !== 'paylater' && w.type !== 'credit_card')
    .reduce((sum, w) => sum + w.balance, 0);

  // 2. Cari kepemilikan emas dan hitung nilai investasi reksa dana/saham lainnya
  const emasAsset = liveAssets.find(a => a.category?.toLowerCase() === 'emas');
  const realGoldValue = emasAsset ? emasAsset.currentValue : 0;
  
  const realInvestmentValue = liveAssets
    .filter(a => a.category?.toLowerCase() === 'investasi' || a.category?.toLowerCase() === 'saham' || a.category?.toLowerCase() === 'reksadana')
    .reduce((sum, a) => sum + a.currentValue, 0);

  // 3. Ambil data Gaji Bulanan Asli dari profil user HR
  const realMonthlySalary = liveUser?.monthlyIncome || 0;

  // State Input Simulator (Di-inisialisasi otomatis pake DATA LIVE ASLI dompet lo!)
  const [saldoTabungan, setSaldoTabungan] = useState(realWalletBalance || 85000000);
  const [beratEmas, setBeratEmas] = useState(25); // Standar simulasi awal gram emas
  const [investasiAset, setInvestasiAset] = useState(realInvestmentValue || 20000000);
  const [gajiBulanan, setGajiBulanan] = useState(realMonthlySalary || 12000000);
  const [bonusLain, setBonusLain] = useState(3000000);

  // Fungsi Tombol Reset/Sinkronisasi Ulang ke Kondisi Saldo Saat Ini
  const handleSyncWithWallet = () => {
    setSaldoTabungan(realWalletBalance);
    setInvestasiAset(realInvestmentValue);
    setGajiBulanan(realMonthlySalary);
  };

  // Perhitungan Hukum Fikih Zakat Maal (Tahunan)
  const nominalEmasKonversi = beratEmas * hargaEmas;
  const totalHartaMaal = saldoTabungan + nominalEmasKonversi + investasiAset;
  const batasNishabMaal = 85 * hargaEmas;
  const isWajibZakatMaal = totalHartaMaal >= batasNishabMaal;
  const estimasiZakatMaal = totalHartaMaal * 0.025;
  const persentaseNishabMaal = Math.min(100, Math.round((totalHartaMaal / batasNishabMaal) * 100));

  // Perhitungan Hukum Fikih Zakat Profesi (Bulanan)
  const totalPendapatanProfesi = gajiBulanan + bonusLain;
  const batasNishabProfesi = 522 * 15000; // Standar 522kg Beras (Asumsi rata-rata Rp15.000/kg)
  const isWajibZakatProfesi = totalPendapatanProfesi >= batasNishabProfesi;
  const estimasiZakatProfesi = totalPendapatanProfesi * 0.025;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      className="p-4 space-y-4 max-h-[80vh] overflow-y-auto pb-24 scrollbar-none text-left"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500"></span>
          </div>
          <div>
            <h2 className="text-base font-black text-amber-400 flex items-center gap-1.5 tracking-tight">
              Aset Terhubung Live 🕌
            </h2>
          </div>
        </div>
        
        {/* TOMBOL SYNC: Biar bisa dipencet buat narik isi dompet terbaru */}
        <button 
          onClick={handleSyncWithWallet}
          className="text-[9px] bg-white/5 hover:bg-white/10 text-gray-300 px-2 py-1 rounded-lg border border-white/10 flex items-center gap-1 transition-all cursor-pointer"
          title="Sinkronisasikan ulang dengan data dompet Humedly"
        >
          <RefreshCw className="w-2.5 h-2.5 text-emerald-400 animate-spin-slow" />
          Sync Dompet
        </button>
      </div>

      {/* Switcher Mode Zakat */}
      <div className="grid grid-cols-2 bg-white/5 p-1 rounded-xl border border-white/10 text-center relative z-10">
        <button
          onClick={() => setZakatMode('maal')}
          className={`py-2 text-xs font-black rounded-lg transition-all duration-300 cursor-pointer ${
            zakatMode === 'maal' ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-gray-950 shadow-md font-extrabold scale-[1.02]' : 'text-gray-400 hover:text-gray-200'
          }`}
        >
          Zakat Maal (Harta)
        </button>
        <button
          onClick={() => setZakatMode('profesi')}
          className={`py-2 text-xs font-black rounded-lg transition-all duration-300 cursor-pointer ${
            zakatMode === 'profesi' ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-gray-950 shadow-md font-extrabold scale-[1.02]' : 'text-gray-400 hover:text-gray-200'
          }`}
        >
          Zakat Profesi (HR)
        </button>
      </div>

      {/* RENDER MODE A: ZAKAT MAAL */}
      {zakatMode === 'maal' && (
        <div className="space-y-4">
          {isWajibZakatMaal ? (
            <motion.div 
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              className="p-3.5 rounded-2xl bg-gradient-to-br from-emerald-500/20 via-teal-500/10 to-transparent border border-emerald-500/40 shadow-[0_0_20px_rgba(16,185,129,0.15)]"
            >
              <p className="text-xs font-black text-emerald-400 flex items-center gap-1.5 uppercase tracking-wide">
                ✨ Barakah Alert: Wajib Zakat Maal!
              </p>
              <p className="text-[10px] text-gray-300 mt-1 leading-relaxed">
                Akumulasi harta haul Anda senilai <strong className="text-white">Rp {totalHartaMaal.toLocaleString('id-ID')}</strong> telah resmi melewati gawang batas nishab tahunan (Rp {batasNishabMaal.toLocaleString('id-ID')}).
              </p>
            </motion.div>
          ) : (
            <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10">
              <p className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                📊 Status Aset: Di Bawah Garis Wajib Zakat
              </p>
              <p className="text-[10px] text-gray-400 mt-1 leading-relaxed">
                Total kekayaan Anda saat ini Rp {totalHartaMaal.toLocaleString('id-ID')}. Butuh sekitar <strong className="text-white">Rp {(batasNishabMaal - totalHartaMaal).toLocaleString('id-ID')}</strong> lagi untuk mencapai batas haul wajib zakat tahunan.
              </p>
            </div>
          )}

          {/* Progress Tracker Nishab Line */}
          <div className="glass-card rounded-2xl p-3 border border-white/5 space-y-2.5">
            <div className="flex justify-between text-[10px] font-bold">
              <span className="text-gray-400 uppercase tracking-wider">Rasio Kedekatan Nishab</span>
              <span className="text-amber-400">{persentaseNishabMaal}%</span>
            </div>
            <div className="w-full bg-white/5 h-2.5 rounded-full overflow-hidden border border-white/5 p-[1px]">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${persentaseNishabMaal}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
                className={`h-full rounded-full relative overflow-hidden ${isWajibZakatMaal ? 'bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-400' : 'bg-gradient-to-r from-amber-500 via-orange-400 to-amber-400'}`}
              >
                <div className="absolute inset-0 bg-white/20 animate-[shine_2s_linear_infinite]" />
              </motion.div>
            </div>
          </div>

          {/* Input Control Panel */}
          <div className="glass-card rounded-2xl p-4 border border-white/5 space-y-3">
            <span className="text-[10px] font-black uppercase text-gray-400 tracking-wider block block pb-2 border-b border-white/5">Simulasi Parameter Kekayaan</span>
            
            <div className="space-y-3">
              <div>
                <label className="text-[10px] text-gray-400 block mb-1 font-semibold">Harga Pasaran Emas Hari Ini (Per Gram)</label>
                <input 
                  type="number" 
                  value={hargaEmas} 
                  onChange={(e) => setHargaEmas(Number(e.target.value))}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white font-bold focus:outline-none focus:border-amber-400 transition-colors"
                />
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="text-[10px] text-gray-400 block mb-1 font-semibold">Tabungan & Wallet (Rp)</label>
                  <input 
                    type="number" 
                    value={saldoTabungan} 
                    onChange={(e) => setSaldoTabungan(Number(e.target.value))}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white font-bold focus:outline-none focus:border-amber-400 transition-colors"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-gray-400 block mb-1 font-semibold">Simpanan Emas (Gram)</label>
                  <input 
                    type="number" 
                    value={beratEmas} 
                    onChange={(e) => setBeratEmas(Number(e.target.value))}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white font-bold focus:outline-none focus:border-amber-400 transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] text-gray-400 block mb-1 font-semibold">Aset Investasi / Reksa Dana / Saham (Rp)</label>
                <input 
                  type="number" 
                  value={investasiAset} 
                  onChange={(e) => setInvestasiAset(Number(e.target.value))}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white font-bold focus:outline-none focus:border-amber-400 transition-colors"
                />
              </div>
            </div>
          </div>

          {/* Bottom Summary Display */}
          <div className="p-4 bg-gradient-to-r from-white/5 to-white/[0.01] rounded-2xl border border-white/10 flex justify-between items-center shadow-inner relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
            <div>
              <p className="text-[10px] text-gray-400 uppercase tracking-wider font-black">Estimasi Zakat Maal (2.5%)</p>
              <p className="text-lg font-black bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent mt-0.5 tracking-tight">
                Rp {isWajibZakatMaal ? estimasiZakatMaal.toLocaleString('id-ID') : '0'}
              </p>
            </div>
            <span className="text-[9px] text-gray-500 font-medium text-right max-w-[110px] leading-tight">
              Kewajiban per periode haul (1 tahun).
            </span>
          </div>
        </div>
      )}

      {/* RENDER MODE B: ZAKAT PROFESI */}
      {zakatMode === 'profesi' && (
        <div className="space-y-4">
          {isWajibZakatProfesi ? (
            <div className="p-3.5 rounded-2xl bg-gradient-to-br from-emerald-500/20 via-teal-500/10 to-transparent border border-emerald-500/40 shadow-[0_0_20px_rgba(16,185,129,0.15)]">
              <p className="text-xs font-black text-emerald-400 flex items-center gap-1">💼 Income Mencapai Batas Nishab</p>
              <p className="text-[10px] text-gray-300 mt-1 leading-relaxed">
                Total pendapatan bulanan Anda senilai <strong className="text-white">Rp {totalPendapatanProfesi.toLocaleString('id-ID')}</strong> telah berada di atas ekuivalen nilai kontemporer 522 kg beras (Batas nishab: Rp {batasNishabProfesi.toLocaleString('id-ID')}).
              </p>
            </div>
          ) : (
            <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10">
              <p className="text-xs font-bold text-gray-400">ℹ️ Belum Mencapai Batas Potong Payroll</p>
              <p className="text-[10px] text-gray-400 mt-1 leading-relaxed">
                Akumulasi Take Home Pay bulan ini belum memicu alarm wajib zakat profesi bulanan.
              </p>
            </div>
          )}

          {/* Form Input Domain HR */}
          <div className="glass-card rounded-2xl p-4 border border-white/5 space-y-3">
            <span className="text-[10px] font-black uppercase text-gray-400 tracking-wider block border-b border-white/5 pb-2">Komponen Pendapatan Bulanan</span>
            
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="text-[10px] text-gray-400 block mb-1 font-semibold">Gaji Pokok Bersih (Rp)</label>
                  <input 
                    type="number" 
                    value={gajiBulanan} 
                    onChange={(e) => setGajiBulanan(Number(e.target.value))}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white font-bold focus:outline-none focus:border-amber-400 transition-colors"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-gray-400 block mb-1 font-semibold">Bonus & Tunjangan (Rp)</label>
                  <input 
                    type="number" 
                    value={bonusLain} 
                    onChange={(e) => setBonusLain(Number(e.target.value))}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white font-bold focus:outline-none focus:border-amber-400 transition-colors"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Output Profesi Box */}
          <div className="p-4 bg-gradient-to-r from-white/5 to-white/[0.01] rounded-2xl border border-white/10 flex justify-between items-center group relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
            <div>
              <p className="text-[10px] text-gray-400 uppercase tracking-wider font-black">Potongan Zakat Profesi (2.5%)</p>
              <p className="text-lg font-black text-amber-400 mt-0.5 tracking-tight">
                Rp {isWajibZakatProfesi ? estimasiZakatProfesi.toLocaleString('id-ID') : '0'}
              </p>
            </div>
            <span className="text-[9px] text-gray-500 font-medium text-right max-w-[130px] block leading-tight">
              Sistem rekomendasi potong langsung saat distribusi payroll.
            </span>
          </div>
        </div>
      )}
    </motion.div>
  );
};

// ========================================================
// MAIN APP CONTENT CORE SHELL
// ========================================================
const MainAppContent: React.FC = () => {
  // 🔄 KITA AMBIL DATA LIVE DARI CONTEXT UNTUK DIOPER KE MONITOR ZAKAT BRE!
  const { resetToDefaults, wallets, assets, user } = useFinance();
  
  const [activeTab, setActiveTab] = useState('home');
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [mobileOnlyView, setMobileOnlyView] = useState<'app' | 'docs'>('app');
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    const isCompleted = localStorage.getItem('zflow_onboarded');
    if (!isCompleted) {
      setShowOnboarding(true);
    }
  }, []);

  const handleCompleteOnboarding = () => {
    localStorage.setItem('zflow_onboarded', 'true');
    setShowOnboarding(false);
    setSuccessMsg('Selamat datang di Humedly. Ekosistemmu siap digunakan.');
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  const handleFactoryReset = () => {
    if (confirm("Reset demonstrasi ke kondisi awal? Seluruh perubahan pada saldo, e-wallet, dan transaksi akan diulang.")) {
      resetToDefaults();
      localStorage.removeItem('zflow_onboarded');
      setShowOnboarding(true);
      setActiveTab('home');
    }
  };

  const renderScreenContent = () => {
    switch (activeTab) {
      case 'home':
        return <HomeScreen setActiveTab={setActiveTab} />;
      case 'track':
        return <ExpenseScreen setActiveTab={setActiveTab} />;
      case 'wallets':
        return <WalletsScreen />;
      case 'zakat':
        // UBAH: KITA PASOKAN DATA ASLI DARI CONTEXT KE SINIPROPS BRE!
        return <ZakatSentinelScreen liveWallets={wallets} liveAssets={assets} liveUser={user} />;
      case 'grow':
        return (
          <div className="p-4 space-y-3 max-h-[80vh] overflow-y-auto pb-20 scrollbar-none text-left">
            <div>
              <h2 className="text-base font-bold text-gray-100 flex items-center gap-1.5 tracking-tight">
                <Sparkles className="w-4 h-4 text-emerald-400" /> Financial Growth Studio
              </h2>
              <p className="text-[10px] text-gray-400 mt-0.5 leading-none">
                Pilih modul aksi untuk memperkuat pertahanan dan masa depan finansialmu.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-3 pt-1">
              
              {/* BUTTON PREMIUM SHARIA MONITOR DENGAN ANIMASI GERAK & SHINE GLOW EFFECT */}
              <motion.button
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setActiveTab('zakat')}
                className="relative overflow-hidden rounded-2xl p-4 text-left border border-amber-500/30 bg-gradient-to-r from-amber-500/15 via-emerald-500/5 to-transparent hover:border-amber-400/60 transition-all flex gap-3 shadow-[0_4px_25px_rgba(245,158,11,0.06)] group cursor-pointer"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-in-out" />
                <div className="w-6 h-6 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-300 shrink-0 flex items-center justify-center font-bold text-xs relative">
                  <span className="relative z-10">...🕋...</span>
                  <span className="absolute inset-0 rounded-xl bg-amber-400/30 animate-ping opacity-75"></span>
                </div>
                <span>
                  <span className="text-xs font-black text-amber-300 flex items-center gap-1.5 uppercase tracking-wide">
                    Zakat & Sharia Sentinel <span className="text-[8px] bg-amber-400 text-gray-950 px-1 rounded-md font-black animate-pulse">PRO</span>
                  </span>
                  <p className="text-[10px] text-gray-400 mt-1 leading-relaxed">
                    Radar otomatis penentu batas nishab aset tabungan & emas serta penguji kepatuhan zakat profesi (HR).
                  </p>
                </span>
              </motion.button>

              <button
                onClick={() => setActiveTab('impulsive')}
                className="glass-card rounded-2xl p-3.5 text-left border-l-4 border-amber-400 hover:bg-white/5 transition-all flex gap-3"
              >
                <ShieldAlert className="w-5 h-5 text-amber-300 shrink-0 mt-0.5" />
                <span>
                  <span className="text-xs font-bold text-amber-300 block">Anti-Impulsive Assistant</span>
                  <p className="text-[10px] text-gray-400 mt-0.5">Uji barang incaranmu dengan konversi jam kerja & peluang investasi pasif 5 tahun.</p>
                </span>
              </button>

              <button
                onClick={() => setActiveTab('goals')}
                className="glass-card rounded-2xl p-3.5 text-left border-l-4 border-emerald-400 hover:bg-white/5 transition-all flex gap-3"
              >
                <Target className="w-5 h-5 text-emerald-300 shrink-0 mt-0.5" />
                <span>
                  <span className="text-xs font-bold text-emerald-300 block">Financial Goals System</span>
                  <p className="text-[10px] text-gray-400 mt-0.5">Pantau target dana darurat, liburan, dan simulasi auto-alokasi menabung.</p>
                </span>
              </button>

              <button
                onClick={() => setActiveTab('subscriptions')}
                className="glass-card rounded-2xl p-3.5 text-left border-l-4 border-sky-400 hover:bg-white/5 transition-all flex gap-3"
              >
                <Tv className="w-5 h-5 text-sky-300 shrink-0 mt-0.5" />
                <span>
                  <span className="text-xs font-bold text-sky-300 block">Subscription Tracker</span>
                  <p className="text-[10px] text-gray-400 mt-0.5">Cek daftar langganan aktif, dapatkan pengingat, dan temukan potensi kebocoran uang.</p>
                </span>
              </button>

              <button
                onClick={() => setActiveTab('debt')}
                className="glass-card rounded-2xl p-3.5 text-left border-l-4 border-rose-400 hover:bg-white/5 transition-all flex gap-3"
              >
                <CreditCard className="w-5 h-5 text-rose-300 shrink-0 mt-0.5" />
                <span>
                  <span className="text-xs font-bold text-rose-300 block">Paylater & Debt Health</span>
                  <p className="text-[10px] text-gray-400 mt-0.5">Kalkulasi beban cicilan bulanan, cek skor kesehatan utang, dan hindari batas kritis 30%.</p>
                </span>
              </button>

              <button
                onClick={() => setActiveTab('forecast')}
                className="glass-card rounded-2xl p-3.5 text-left border-l-4 border-indigo-400 hover:bg-white/5 transition-all flex gap-3"
              >
                <TrendingUp className="w-5 h-5 text-indigo-300 shrink-0 mt-0.5" />
                <span>
                  <span className="text-xs font-bold text-indigo-300 block">Cashflow Forecast</span>
                  <p className="text-[10px] text-gray-400 mt-0.5">Prediksi sisa uang akhir bulan berdasarkan tren burn rate harianmu saat ini.</p>
                </span>
              </button>

              <button
                onClick={() => setActiveTab('budget')}
                className="glass-card rounded-2xl p-3.5 text-left border-l-4 border-emerald-400 hover:bg-white/5 transition-all flex gap-3"
              >
                <PieChart className="w-5 h-5 text-emerald-300 shrink-0 mt-0.5" />
                <span>
                  <span className="text-xs font-bold text-emerald-300 block">Budget Planner</span>
                  <p className="text-[10px] text-gray-400 mt-0.5">Atur anggaran per kategori dan pantau realisasi bulan ini.</p>
                </span>
              </button>

              <button
                onClick={() => setActiveTab('assets')}
                className="glass-card rounded-2xl p-3.5 text-left border-l-4 border-teal-400 hover:bg-white/5 transition-all flex gap-3"
              >
                <WalletCards className="w-5 h-5 text-teal-300 shrink-0 mt-0.5" />
                <span>
                  <span className="text-xs font-bold text-teal-300 block">Aset & Net Worth</span>
                  <p className="text-[10px] text-gray-400 mt-0.5">Catat tanah, emas, kendaraan, dan proyeksi kenaikan atau penurunan nilai aset.</p>
                </span>
              </button>

              <button
                onClick={() => setActiveTab('reports')}
                className="glass-card rounded-2xl p-3.5 text-left border-l-4 border-indigo-400 hover:bg-white/5 transition-all flex gap-3"
              >
                <FileText className="w-5 h-5 text-indigo-300 shrink-0 mt-0.5" />
                <span>
                  <span className="text-xs font-bold text-indigo-300 block">Laporan Bulanan PDF</span>
                  <p className="text-[10px] text-gray-400 mt-0.5">Cetak riwayat transaksi dan rangkuman kondisi keuanganmu bulan ini.</p>
                </span>
              </button>
            </div>
          </div>
        );
      case 'ai':
        return <AIChatScreen />;
      case 'subscriptions':
        return <SubscriptionsScreen />;
      case 'debt':
        return <DebtScreen />;
      case 'health':
        return <HealthScreen />;
      case 'impulsive':
        return <ImpulsiveAssistantScreen setActiveTab={setActiveTab} />;
      case 'goals':
        return <GoalsScreen />;
      case 'forecast':
        return <ForecastScreen />;
      case 'mood':
        return <MoodScreen />;
      case 'gamification':
        return <GamificationScreen />;
      case 'privacy':
        return <PrivacyScreen />;
      case 'budget':
        return <BudgetScreen />;
      case 'assets':
        return <AssetsScreen />;
      case 'reports':
        return <ReportScreen />;
      default:
        return <HomeScreen setActiveTab={setActiveTab} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#111827] text-gray-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-white">
      <header className="border-b border-white/10 bg-[#111827]/95 backdrop-blur-md sticky top-0 z-50 px-3 py-2.5 lg:px-8 lg:py-3 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="relative w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-300 via-teal-400 to-sky-400 flex items-center justify-center text-slate-950 font-black text-base shadow-lg shadow-emerald-950/20 lg:w-11 lg:h-11 lg:text-lg overflow-hidden">
            <span className="relative z-10">H</span>
            <div className="absolute inset-0 bg-white/20 translate-x-[-120%] animate-[shine_4s_ease-in-out_infinite]"></div>
          </div>
          <div className="min-w-0">
            <span className="font-extrabold text-white text-base tracking-tight leading-none block lg:text-lg">Humedly</span>
            <span className="text-[10px] text-gray-400 flex items-center gap-1 mt-1 leading-none truncate">
              Feel better about money
              <span className="inline-flex w-4 h-4 rounded-full bg-emerald-500/10 border border-emerald-500/20 items-center justify-center text-emerald-300 animate-pulse-subtle">
                <Smile className="w-2.5 h-2.5" />
              </span>
            </span>
          </div>
        </div>

        <div className="flex lg:hidden bg-white/5 p-0.5 rounded-full border border-white/10 shrink-0 shadow-inner">
          <button
            onClick={() => setMobileOnlyView('app')}
            className={`w-8 h-8 text-xs font-semibold rounded-full transition-all flex items-center justify-center ${
              mobileOnlyView === 'app' ? 'bg-emerald-400 text-gray-950 shadow-lg shadow-emerald-950/30 scale-105' : 'text-gray-400 hover:text-gray-200'
            }`}
            title="Live app"
          >
            <Smartphone className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setMobileOnlyView('docs')}
            className={`w-8 h-8 text-xs font-semibold rounded-full transition-all flex items-center justify-center ${
              mobileOnlyView === 'docs' ? 'bg-emerald-400 text-gray-950 shadow-lg shadow-emerald-950/30 scale-105' : 'text-gray-400 hover:text-gray-200'
            }`}
            title="Konsep"
          >
            <FileText className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleFactoryReset}
            className="text-[10px] bg-white/5 hover:bg-white/10 text-gray-300 px-2.5 py-1.5 rounded-lg border border-white/10 flex items-center gap-1 transition-all"
            title="Kembalikan data ke awal simulasi"
          >
            <RotateCcw className="w-3 h-3 text-amber-400" />
            <span className="hidden md:inline">Reset Demo</span>
          </button>
        </div>
      </header>

      {successMsg && (
        <div className="bg-emerald-500 text-gray-950 font-bold py-2 px-4 text-xs text-center transition-all flex items-center justify-center gap-1">
          <CheckCircle2 className="w-4 h-4" /> {successMsg}
        </div>
      )}

      <main className="flex-1 max-w-7xl w-full mx-auto p-0 lg:p-6 flex flex-col lg:flex-row items-stretch lg:items-start justify-center gap-8">
        <div className={`w-full lg:w-auto flex justify-center ${
          mobileOnlyView === 'docs' ? 'hidden lg:flex' : 'flex'
        }`}>
          <div className="relative w-full mobile-app-height lg:w-[390px] lg:min-h-0">
            <MobileFrame 
              activeTab={activeTab}
              setActiveTab={setActiveTab}
            >
              {activeTab !== 'home' && (
                <div className="px-4 pt-2 pb-1 flex items-center justify-between bg-[#111827]">
                  <button
                    onClick={() => setActiveTab('home')}
                    className="text-[10px] text-emerald-400 hover:underline flex items-center gap-0.5"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" /> Kembali ke Home
                  </button>

                  <span className="text-[9px] text-gray-500 uppercase tracking-wider">
                    {activeTab}
                  </span>
                </div>
              )}

              {renderScreenContent()}
            </MobileFrame>

            <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />

            {showOnboarding && (
              <div className="absolute inset-0 z-50 overflow-hidden lg:rounded-[46px]">
                <OnboardingFlow onComplete={handleCompleteOnboarding} />
              </div>
            )}
          </div>
        </div>

        <div className={`w-full lg:w-auto flex-1 flex justify-center ${
          mobileOnlyView === 'app' ? 'hidden lg:flex' : 'flex'
        }`}>
          <ConceptDocumentation />
        </div>
      </main>

      <footer className="hidden lg:block border-t border-white/5 py-4 px-6 text-center text-xs text-gray-500 bg-[#111827] mt-auto">
        <p className="max-w-2xl mx-auto flex items-center justify-center gap-2">
          <Info className="w-4 h-4 text-sky-300" /> <span><strong className="text-gray-400">Tips Simulasi:</strong> Coba tambahkan pengeluaran impulsif di menu <strong className="text-emerald-400">Catat</strong>, lalu perhatikan bagaimana <strong className="text-sky-400">Cashflow Forecast</strong> dan <strong className="text-amber-400">Skor Kesehatan</strong> langsung merespons secara dinamis.</span>
        </p>
      </footer>
    </div>
  );
};

export default function FinanceApp() {
  return (
    <FinanceProvider>
      <MainAppContent />
    </FinanceProvider>
  );
}
