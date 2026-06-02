import React, { useState, useEffect } from 'react';
import { FinanceProvider, useFinance } from './context/FinanceContext';
import { MobileFrame } from './components/MobileFrame';
import { BottomNav } from './components/BottomNav';
import { ConceptDocumentation } from './components/ConceptDocumentation';

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
  Smile
} from 'lucide-react';

const MainAppContent: React.FC = () => {
  const { resetToDefaults } = useFinance();
  
  const [activeTab, setActiveTab] = useState('home');
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [mobileOnlyView, setMobileOnlyView] = useState<'app' | 'docs'>('app');
  const [successMsg, setSuccessMsg] = useState('');

  // Check if onboarding was completed
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

  // Render content based on activeTab inside the phone shell
  const renderScreenContent = () => {
    switch (activeTab) {
      case 'home':
        return <HomeScreen setActiveTab={setActiveTab} />;
      case 'track':
        return <ExpenseScreen setActiveTab={setActiveTab} />;
      case 'wallets':
        return <WalletsScreen />;
      case 'grow':
        // Grow menu gives a beautiful bridge to Anti-Impulsive, Goals, Subscriptions, and Debts
        return (
          <div className="p-4 space-y-3">
            <div>
              <h2 className="text-base font-bold text-gray-100 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-emerald-400" /> Financial Growth Studio
              </h2>
              <p className="text-[10px] text-gray-400 mt-0.5">
                Pilih modul aksi untuk memperkuat pertahanan dan masa depan finansialmu.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-2.5 pt-1">
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
      
      {/* Top Universal Branding Header */}
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

        {/* Responsive Mobile-Only View Switcher */}
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

        {/* Global Action Controls */}
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

      {/* Main Dual-Panel Layout */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-0 lg:p-6 flex flex-col lg:flex-row items-stretch lg:items-start justify-center gap-8">
        
        {/* LEFT / APP SIDE */}
        <div className={`w-full lg:w-auto flex justify-center ${
          mobileOnlyView === 'docs' ? 'hidden lg:flex' : 'flex'
        }`}>
          <div className="relative w-full mobile-app-height lg:w-[390px] lg:min-h-0">
            
            {/* Phone Shell */}
            <MobileFrame 
              activeTab={activeTab}
              setActiveTab={setActiveTab}
            >
              
              {/* Back Button inside phone if not in home */}
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

              {/* Render current feature screen */}
              {renderScreenContent()}

            </MobileFrame>

            {/* Bottom App Tab navigation */}
            <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />

            {/* Simulated Onboarding Wizard Overlay */}
            {showOnboarding && (
              <div className="absolute inset-0 z-50 overflow-hidden lg:rounded-[46px]">
                <OnboardingFlow onComplete={handleCompleteOnboarding} />
              </div>
            )}

          </div>
        </div>

        {/* RIGHT / CONCEPT DOCUMENTATION SIDE */}
        <div className={`w-full lg:w-auto flex-1 flex justify-center ${
          mobileOnlyView === 'app' ? 'hidden lg:flex' : 'flex'
        }`}>
          <ConceptDocumentation />
        </div>

      </main>

      {/* Concept Instructions Footer */}
      <footer className="hidden lg:block border-t border-white/5 py-4 px-6 text-center text-xs text-gray-500 bg-[#111827] mt-auto">
        <p className="max-w-2xl mx-auto flex items-center justify-center gap-2">
          <Info className="w-4 h-4 text-sky-300" /> <span><strong className="text-gray-400">Tips Simulasi:</strong> Coba tambahkan pengeluaran impulsif di menu <strong className="text-emerald-400">Catat</strong>, lalu perhatikan bagaimana <strong className="text-sky-400">Cashflow Forecast</strong> dan <strong className="text-amber-400">Skor Kesehatan</strong> langsung merespons secara dinamis.</span>
        </p>
      </footer>

    </div>
  );
};

export default function App() {
  return (
    <FinanceProvider>
      <MainAppContent />
    </FinanceProvider>
  );
}
