import React from 'react';
import { useFinance } from '../../context/FinanceContext';
import { 
  HeartPulse, 
  PiggyBank, 
  ShoppingBag, 
  ShieldCheck, 
  CreditCard, 
  TrendingUp, 
  Info
} from 'lucide-react';

export const HealthScreen: React.FC = () => {
  const { financialHealth } = useFinance();

  const renderStatusBadge = (score: number, type: 'percent' | 'score' | 'months') => {
    let isGood = false;
    let isWarning = false;

    if (type === 'percent') {
      // For saving ratio: >20% is good
      isGood = score >= 20;
      isWarning = score >= 10 && score < 20;
    } else if (type === 'score') {
      isGood = score >= 70;
      isWarning = score >= 50 && score < 70;
    } else if (type === 'months') {
      isGood = score >= 3;
      isWarning = score >= 1 && score < 3;
    }

    return (
      <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
        isGood ? 'bg-emerald-500/10 text-emerald-400' :
        isWarning ? 'bg-amber-500/10 text-amber-400' :
        'bg-rose-500/10 text-rose-400'
      }`}>
        {isGood ? 'Optimal' : isWarning ? 'Cukup' : 'Perlu Aksi'}
      </span>
    );
  };

  return (
    <div className="p-4 space-y-4">
      
      {/* Header */}
      <div>
        <h2 className="text-base font-bold text-gray-100 flex items-center gap-1.5">
          <HeartPulse className="w-4 h-4 text-emerald-400" /> Financial Health Matrix
        </h2>
        <p className="text-[10px] text-gray-400 mt-0.5">
          Skor kesehatan finansial berdasarkan 5 pilar utama Gen Z.
        </p>
      </div>

      {/* Main Score Display */}
      <div className="glass-card rounded-3xl p-5 text-center relative overflow-hidden border border-emerald-500/20 glow-primary">
        <div className="absolute -top-10 -left-10 w-32 h-32 bg-emerald-500/10 rounded-full blur-xl"></div>

        <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest block">
          SKOR KESELURUHAN
        </span>

        <div className="my-3 flex items-center justify-center">
          <div className="relative w-28 h-28 rounded-full bg-[#151C2B] border-4 border-emerald-500/25 flex flex-col items-center justify-center shadow-inner">
            <span className="text-4xl font-black text-white tracking-tight">
              {financialHealth.overallScore}
            </span>
            <span className="text-[9px] text-gray-500 font-medium">dari 100</span>
            
            {/* Ambient animated ring */}
            <div className="absolute inset-[-8px] rounded-full border-2 border-emerald-500/20 animate-spin" style={{ animationDuration: '12s' }}></div>
          </div>
        </div>

        <h3 className="text-xs font-bold text-gray-100">
          {financialHealth.overallScore >= 75 ? 'Finansial Sehat & Bertumbuh' :
           financialHealth.overallScore >= 50 ? 'Terkendali Namun Perlu Optimasi' :
           'Rawan Krisis Cashflow'}
        </h3>
        
        <p className="text-[10px] text-gray-400 mt-1 max-w-xs mx-auto">
          {financialHealth.overallScore >= 75 
            ? 'Pondasi keuanganmu sangat kuat! Kamu siap untuk mulai fokus pada financial growth & investasi jangka panjang.'
            : 'Ada beberapa kebocoran yang bisa ditambal. Kurangi pengeluaran impulsif dan perkuat dana daruratmu.'}
        </p>
      </div>

      {/* 5 Pillars Breakdown */}
      <div className="space-y-2.5">
        <span className="text-[10px] font-bold text-gray-400 block uppercase tracking-wider">
          Analisis 5 Pilar Utama
        </span>

        {/* 1. Saving Ratio */}
        <div className="glass-card rounded-2xl p-3 space-y-2 border border-white/5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                <PiggyBank className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-gray-200">Saving Ratio</h4>
                <span className="text-[9px] text-gray-500 block">Porsi menabung dari income</span>
              </div>
            </div>

            <div className="text-right">
              <span className="text-xs font-bold text-emerald-400 block">
                {financialHealth.savingRatio}%
              </span>
              {renderStatusBadge(financialHealth.savingRatio, 'percent')}
            </div>
          </div>

          <div className="w-full h-1 bg-gray-800 rounded-full overflow-hidden">
            <div 
              className="h-full bg-emerald-500 rounded-full"
              style={{ width: `${Math.min(100, financialHealth.savingRatio * 2.5)}%` }}
            ></div>
          </div>

          <p className="text-[9px] text-gray-400">
            {financialHealth.savingRatio >= 20 
              ? 'Kamu berhasil menyisihkan di atas 20% untuk tabungan dan investasi.' 
              : 'Coba terapkan aturan 50/30/20. Sisihkan minimal 20% di awal bulan, bukan dari sisa.'}
          </p>
        </div>

        {/* 2. Spending Habit */}
        <div className="glass-card rounded-2xl p-3 space-y-2 border border-white/5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-sky-500/10 flex items-center justify-center text-sky-400">
                <ShoppingBag className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-gray-200">Spending Habit</h4>
                <span className="text-[9px] text-gray-500 block">Kontrol pengeluaran impulsif</span>
              </div>
            </div>

            <div className="text-right">
              <span className="text-xs font-bold text-sky-400 block">
                {financialHealth.spendingHabitScore}/100
              </span>
              {renderStatusBadge(financialHealth.spendingHabitScore, 'score')}
            </div>
          </div>

          <div className="w-full h-1 bg-gray-800 rounded-full overflow-hidden">
            <div 
              className="h-full bg-sky-400 rounded-full"
              style={{ width: `${financialHealth.spendingHabitScore}%` }}
            ></div>
          </div>

          <p className="text-[9px] text-gray-400">
            {financialHealth.spendingHabitScore >= 70 
              ? 'Pengeluaranmu terencana dengan baik. Minim transaksi emosional.' 
              : 'Terlalu banyak transaksi berlabel impulsif. Gunakan fitur Anti-Impulsive sebelum checkout.'}
          </p>
        </div>

        {/* 3. Emergency Fund */}
        <div className="glass-card rounded-2xl p-3 space-y-2 border border-white/5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-400">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-gray-200">Emergency Fund</h4>
                <span className="text-[9px] text-gray-500 block">Kesiapan dana darurat</span>
              </div>
            </div>

            <div className="text-right">
              <span className="text-xs font-bold text-amber-400 block">
                {financialHealth.emergencyFundMonths} Bulan
              </span>
              {renderStatusBadge(financialHealth.emergencyFundMonths, 'months')}
            </div>
          </div>

          <div className="w-full h-1 bg-gray-800 rounded-full overflow-hidden">
            <div 
              className="h-full bg-amber-500 rounded-full"
              style={{ width: `${Math.min(100, (financialHealth.emergencyFundMonths / 6) * 100)}%` }}
            ></div>
          </div>

          <p className="text-[9px] text-gray-400">
            {financialHealth.emergencyFundMonths >= 3 
              ? 'Ketahanan kas yang bagus. Targetkan hingga 6x pengeluaran bulanan agar makin tenang.' 
              : 'Dana daruratmu masih di bawah 3 bulan pengeluaran. Alokasikan ekstra ke rekening terpisah.'}
          </p>
        </div>

        {/* 4. Debt Ratio */}
        <div className="glass-card rounded-2xl p-3 space-y-2 border border-white/5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-rose-500/10 flex items-center justify-center text-rose-400">
                <CreditCard className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-gray-200">Debt Ratio</h4>
                <span className="text-[9px] text-gray-500 block">Beban utang & paylater</span>
              </div>
            </div>

            <div className="text-right">
              <span className="text-xs font-bold text-rose-400 block">
                {financialHealth.debtRatio}%
              </span>
              {/* Custom logic for debt badge: lower is better */}
              <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                financialHealth.debtRatio <= 15 ? 'bg-emerald-500/10 text-emerald-400' :
                financialHealth.debtRatio <= 30 ? 'bg-amber-500/10 text-amber-400' :
                'bg-rose-500/10 text-rose-400'
              }`}>
                {financialHealth.debtRatio <= 15 ? 'Sangat Aman' : financialHealth.debtRatio <= 30 ? 'Batas Wajar' : 'Berbahaya'}
              </span>
            </div>
          </div>

          <div className="w-full h-1 bg-gray-800 rounded-full overflow-hidden">
            <div 
              className="h-full bg-rose-500 rounded-full"
              style={{ width: `${Math.min(100, financialHealth.debtRatio * 2.5)}%` }}
            ></div>
          </div>

          <p className="text-[9px] text-gray-400">
            {financialHealth.debtRatio <= 20 
              ? 'Rasio utang sangat sehat. Kamu tidak terbebani oleh cicilan konsumtif.' 
              : 'Beban cicilan cukup tinggi. Tunda keinginan upgrade gadget atau liburan dengan paylater.'}
          </p>
        </div>

        {/* 5. Cashflow Consistency */}
        <div className="glass-card rounded-2xl p-3 space-y-2 border border-white/5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-400">
                <TrendingUp className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-gray-200">Cashflow Consistency</h4>
                <span className="text-[9px] text-gray-500 block">Stabilitas surplus bulanan</span>
              </div>
            </div>

            <div className="text-right">
              <span className="text-xs font-bold text-indigo-400 block">
                {financialHealth.cashflowConsistencyScore}/100
              </span>
              {renderStatusBadge(financialHealth.cashflowConsistencyScore, 'score')}
            </div>
          </div>

          <div className="w-full h-1 bg-gray-800 rounded-full overflow-hidden">
            <div 
              className="h-full bg-indigo-400 rounded-full"
              style={{ width: `${financialHealth.cashflowConsistencyScore}%` }}
            ></div>
          </div>

          <p className="text-[9px] text-gray-400">
            {financialHealth.cashflowConsistencyScore >= 70 
              ? 'Pemasukanmu selalu konsisten menutupi seluruh kebutuhan operasional.' 
              : 'Rawan besar pasak daripada tiang. Evaluasi kembali pos pengeluaran gaya hidup.'}
          </p>
        </div>

      </div>

      {/* Advisory Note */}
      <div className="glass-pill rounded-xl p-3 flex items-start gap-2 text-[9px] text-gray-400">
        <Info className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
        <span>
          Skor ini diperbarui otomatis setiap kali kamu mencatat transaksi, membayar cicilan, atau menambah saldo tabungan.
        </span>
      </div>

    </div>
  );
};
