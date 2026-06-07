import React, { useState, useEffect } from 'react';
import { FinanceProvider, useFinance } from './context/FinanceContext';
import { MobileFrame } from './components/MobileFrame';
import { BottomNav } from './components/BottomNav';
import { ConceptDocumentation } from './components/ConceptDocumentation';
import { motion } from 'framer-motion'; // 🌟 BARU: SUNTIKAN ANIMASI GERAK PREMIUM

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

// ==========================================
// 🕌 SCREEN: ZAKAT & SHARIA SENTINEL (ANIMATED VERSION)
// ==========================================
const ZakatSentinelScreen: React.FC = () => {
  const [zakatMode, setZakatMode] = useState<'maal' | 'profesi'>('maal');
  const [hargaEmas, setHargaEmas] = useState(1450000); 
  const [saldoTabungan, setSaldoTabungan] = useState(85000000);
  const [beratEmas, setBeratEmas] = useState(25); 
  const [investasiAset, setInvestasiAset] = useState(20000000);

  // State Input Zakat Profesi (HR Domain)
  const [gajiBulanan, setGajiBulanan] = useState(12000000);
  const [bonusLain, setBonusLain] = useState(3000000);

  // Perhitungan Zakat Maal (Tahunan)
  const nominalEmasKonversi = beratEmas * hargaEmas;
  const totalHartaMaal = saldoTabungan + nominalEmasKonversi + investasiAset;
  const batasNishabMaal = 85 * hargaEmas;
  const isWajibZakatMaal = totalHartaMaal >= batasNishabMaal;
  const estimasiZakatMaal = totalHartaMaal * 0.025;
  const persentaseNishabMaal = Math.min(100, Math.round((totalHartaMaal / batasNishabMaal) * 100));

  // Perhitungan Zakat Profesi (Bulanan)
  const totalPendapatanProfesi = gajiBulanan + bonusLain;
  const batasNishabProfesi = 522 * 15000; // Standar 522kg Beras (Asumsi Rp15.000/kg)
  const isWajibZakatProfesi = totalPendapatanProfesi >= batasNishabProfesi;
  const estimasiZakatProfesi = totalPendapatanProfesi * 0.025;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      className="p-4 space-y-4 max-h-[80vh] overflow-y-auto pb-24 scrollbar-none text-left"
    >
      <div className="flex items-center gap-2">
        <div className="relative flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500"></span>
        </div>
        <div>
          <h2 className="text-base font-black text-amber-400 flex items-center gap-1.5 tracking-tight">
            🕌 Zakat & Sharia Sentinel
          </h2>
          <p className="text-
